$(document).ready(function() {
    $('#post-form2').submit(function(e) {
        e.preventDefault();
        document.getElementById("map").style.backgroundImage = 'none';
        document.getElementById("map").innerHTML = '';
        document.getElementById("preloader").style.display = '';
        document.getElementById("geo_results").style.display = 'none';
        document.getElementById("journey-share-button").style.display = 'none';
        document.getElementById("mapLink").style.display = 'none';
        document.getElementById("error").style.display = 'none';

        var formData = {
            lat: parseFloat($('#id_cityLat').val()),
            lng: parseFloat($('#id_cityLng').val()),
            opts: {
                size: parseInt($('#id_citySize').val()),
                local: $('#id_local').is(':checked'),
                radius: parseInt($('#id_radius').val()),
                type: $('#id_type').val(),
                rounds: parseInt($('#id_rounds').val()),
                random: $('#id_random').val() === 'True'
            }
        };
        var jsonData = JSON.stringify(formData);
        var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
        $.ajaxSetup({
            headers: {
                'X-CSRFToken': csrfToken
            }
        });
        console.log(jsonData);
        $.ajax({
            type: "POST",
            url: "/roulette_result",
            data: jsonData,
            success: function(data) {
                try {
                    $("#result").text(data["result"].length);
                    console.log(data);
                    route = data["result"];
                    var namesString = "";
                    route.forEach(function(result) {
                        namesString += "<li>" + result.name + "</li>";
                    });
                    initMap();
                    $("#stoplist").html("<ul>" + namesString + "</ul>");
                    $("#geo_results").removeAttr("style");
                    $("#journey-share-button").removeAttr("style");
                    $("#mapLink").removeAttr("style");
                    // Получаем позицию элемента с id="map"
                    var mapElement = document.getElementById("map");
                    var elementPosition = mapElement.getBoundingClientRect().top;
                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });

                } catch (error) {
                    console.log("An error occurred during success handling: " + error);
                document.getElementById("preloader").style.display = 'none';
                document.getElementById("error").style.display = '';
                document.getElementById("error-text").innerHTML = "Try again with another parameters. An error occurred while processing the request: " + error;                }
            },
            error: function(xhr, status, error) {
                console.log("An error occurred while processing the request: " + error);
                document.getElementById("preloader").style.display = 'none';
                document.getElementById("error").style.display = '';
                document.getElementById("error-text").innerHTML = "Try again with another parameters. An error occurred while processing the request: " + error;
            }
        });
    });
});


//$(document).ready(
//  $('#post-form2').submit(function(e){
//    e.preventDefault();
//    console.log('button_press')
//    document.getElementById("map").style.backgroundImage = 'none';
//    document.getElementById("map").innerHTML = '';
//    document.getElementById("preloader").style.display = '';
//    document.getElementById("geo_results").style.display = 'none';
//    document.getElementById("journey-share-button").style.display = 'none';
//    document.getElementById("mapLink").style.display = 'none';
//    document.getElementById("error").style.display = 'none';
//
//    var formData = {
//                    lat: parseFloat($('#id_cityLat').val()),
//                    lng: parseFloat($('#id_cityLng').val()),
//                    opts: {
//                        size: parseInt($('#id_citySize').val()),
//                        local: $('#id_local').is(':checked'),
//                        radius: parseInt($('#id_radius').val()),
//                        type: $('#id_type').val(),
//                        rounds: parseInt($('#id_rounds').val()),
//                        random: $('#id_random').val() === 'True'
//                    }
//                };
//    var jsonData = JSON.stringify(formData);
//    var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
//    $.ajaxSetup({
//            headers: {
//                'X-CSRFToken': csrftoken
//            }
//        });
//    console.log(jsonData);
//    $.ajax({
//      type:"POST",
//      url: "/roulette_result",
//      data:  jsonData,
//      success: function(data){
//        $("#result").text(data["result"].length);
//        console.log(data);
//        route = data["result"];
//        var namesString = "";
//        route.forEach(function(result) {
//          namesString += "<li>" + result.name + "</li>";
//        });
//
//
//        initMap();
//        // Устанавливаем текст элемента #stoplist
//        $("#stoplist").html("<ul>" + namesString + "</ul>");
//        $("#geo_results").removeAttr("style");
//        $("#journey-share-button").removeAttr("style");
//        $("#mapLink").removeAttr("style");
//      },
//        error: function (xhr, status, error) {
//            console.log("An error occurred while processing the request: " + error);
//            document.getElementById("preloader").style.display = 'none';
//            document.getElementById("error").style.display = '';
//            document.getElementById("error-text").innerHTML = "Try again with another parameters. An error occurred while processing the request: " + error;
//
//            // Добавьте сюда код, который вы хотите выполнить при ошибке
//        }
//    });
//  })
//);

var origin = 'trip start';
var destin = 'trip finish';
var route;
var geocoder;
var hashPlaces = {};
var map;
var directionDisplay;
var directionsService;
var country_code;
var test;

function initMap() {
  directionsService = new google.maps.DirectionsService();
//  directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        map: map,
        panel: document.getElementById('right-panel')
      });
  var center = { lat: parseFloat(route[0]['lat']), lng: parseFloat(route[0]['lng']) }
  var mapOptions = {
                    zoom: 6,
                                mapTypeId: google.maps.MapTypeId.ROADMAP,
                    center: center
                    }
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  console.log(map);

  geocoder = new google.maps.Geocoder();

  directionsDisplay.addListener('directions_changed', function() {
    computeTotalDistance(directionsDisplay.getDirections());
    prepareMapLink(directionsDisplay.getDirections());
  });
  directionsDisplay.setMap(map);
  calcRoute()
  document.getElementById("preloader").style.display = 'none';


}

function calcRoute() {
//    console.log('startcalc');
    var waypts = [];
    for (  stop of route.slice(0,-1) ) {
         point = new google.maps.LatLng( parseFloat(stop['lat']), parseFloat(stop['lng']))
         waypts.push({
              location:point,
              stopover:true
              });
              };
    var lat = document.getElementById('id_cityLat').value;
    var lng = document.getElementById('id_cityLng').value;
    start  = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
    end = new google.maps.LatLng(parseFloat(route[route.length - 1]['lat']), parseFloat(route[route.length - 1]['lng']));
    var request = {
        origin: start,
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];

        }
});
}

function initialize() {
  var input = document.getElementById('id_searchTextField');
  var autocomplete = new google.maps.places.Autocomplete(input);
              google.maps.event.addListener(autocomplete, 'place_changed', function () {
    var place = autocomplete.getPlace();
    document.getElementById('id_city').value = place.name;
    document.getElementById('id_cityLat').value = place.geometry.location.lat();
    document.getElementById('id_cityLng').value = place.geometry.location.lng();
    country_code = getCountryCode(place);
//    console.log(country_code);
    test = place;
//    console.log(place);
});
}

function getCountryCode(place) {
    var code;
    var adr = place.address_components;
    for (var i = 1; i < adr.length + 1; i++) {
//          console.log(adr.length);
//          console.log(i);
          code = adr[adr.length - i].short_name
          if (/[A-Z]/.test(code)) {
            break;
            }

        };
    return code;
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
        }
    }
    }
    return cookieValue;
    }
const csrftoken = getCookie('csrftoken');


function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000;
  document.getElementById('total').innerHTML = total + ' km';
}

function geocodePlaceId (placeId) {
  return new Promise(function(resolve, reject) {
      geocoder.geocode({'placeId': placeId}, function(results, status) {
         if (status === 'OK') {
            var r = Object.create(null);
            r[placeId] = results[0].formatted_address
            resolve(r);
         } else {
            reject('Geocode was not successful for the following reason: ' + status);
         }
      });
  });
}

function prepareMapLink(result) {
  var arrWp = [];
  result.geocoded_waypoints.forEach(function (wp) {
      arrWp.push(wp.place_id);
  });

  var oplaceId = arrWp.shift();
  var dplaceId = arrWp.pop();

  var arrProm = [];
  arrWp.forEach( function (pId) {
    if (!hashPlaces[pId]) {
      arrProm.push(geocodePlaceId(pId));
    }
  });

  if (arrProm.length) {
      Promise.all(arrProm).then( function (values) {
          values.forEach(function (val) {
             for (key in val) {
                hashPlaces[key] = val[key];
             }
          });
          constructMapsUrl(oplaceId, dplaceId, arrWp);
      }).catch(reason => {
//          console.log(reason)
      });
  } else {
      constructMapsUrl(oplaceId, dplaceId, arrWp);
  }

}

function constructMapsUrl(originId, destinationId, waypoints) {
    var res = "https://www.google.com/maps/dir/?api=1&";
    res += "origin="+encodeURIComponent(origin)+"&origin_place_id="+originId;
    res += "&destination="+encodeURIComponent(destin)+"&destination_place_id="+destinationId;

    var wpAddr = [];
    waypoints.forEach( function (wp) {
        wpAddr.push(hashPlaces[wp]);
    });

    var waypointsStr = encodeURIComponent(wpAddr.join('|'));
    var waypointsIds = waypoints.join('|');

    res += "&waypoints="+waypointsStr+"&waypoint_place_ids="+waypointsIds+"&travelmode=driving";

    var aElem = document.getElementById("mapLink");
    aElem.setAttribute("href", res);
}

// Получаем ссылку на кнопку по ее id
var customizeButton = document.getElementById('customize-button');
var randomButton = document.getElementById('random-button');
var spanJourneyType = document.getElementById('span_journey_type');

// Получаем ссылку на форму по ее id
var postForm = document.getElementById('post-form2');

// Получаем ссылки на все элементы внутри формы с их id
var idRandomElement = postForm.querySelector('#id_random');
var idRoundsElement = postForm.querySelector('#id_rounds_trigger_div');
var idCitySizeElement = postForm.querySelector('#id_citySize_trigger_div');
var idRadiusElement = postForm.querySelector('#id_radius_trigger_div');
var idTypeElement = postForm.querySelector('#id_type_trigger_div');
var idLocalElement = postForm.querySelector('#id_local_trigger_div');

// Назначаем обработчик события click на кнопку
randomButton.addEventListener('click', function() {
    // Получаем текущее значение атрибута "value" для каждого элемента
    var currentValueRandom = idRandomElement.value;
    var currentValueRounds = idRoundsElement.style.display;
    var currentValueCitySize = idCitySizeElement.style.display;
    var currentValueRadius = idRadiusElement.style.display;
    var currentValueLocal = idLocalElement.style.display;

    randomButton.classList.add('active');
    spanJourneyType.innerHTML = 'random'
    customizeButton.classList.remove('active');
    idRandomElement.value = 'true'
    idRoundsElement.style.display = 'none';
    idCitySizeElement.style.display = 'none';
    idRadiusElement.style.display = 'none';
    idLocalElement.style.display = 'none';
});

customizeButton.addEventListener('click', function() {
    // Получаем текущее значение атрибута "value" для каждого элемента
    var currentValueRandom = idRandomElement.value;
    var currentValueRounds = idRoundsElement.style.display;
    var currentValueCitySize = idCitySizeElement.style.display;
    var currentValueRadius = idRadiusElement.style.display;
    var currentValueLocal = idLocalElement.style.display;

    spanJourneyType.innerHTML = 'customized'
    customizeButton.classList.add('active');
    randomButton.classList.remove('active');
    idRandomElement.value = 'false';
    idRoundsElement.style.display = 'block';
    idCitySizeElement.style.display = 'block';
    idRadiusElement.style.display = 'block';
    idLocalElement.style.display = 'block';
});



function custom_toggle() {
//    console.log('togle');
}


function updateValue(inputElement) {
    var labelElement = inputElement.parentElement; // Находим родительский элемент
    var smallElement = labelElement.querySelector('span'); // Находим первый элемент <small> внутри родительского элемента
    if (smallElement && inputElement.getAttribute('name') === 'citySize') {
        var value = parseInt(inputElement.value);
        var sizeLabels = ['XS', 'S', 'M', 'L'];
        smallElement.textContent = sizeLabels[value];
    } else {
        // В случае других ползунков, просто отображаем числовое значение
        if (smallElement) {
            smallElement.textContent = inputElement.value;
        }
    }
}

function toggleParameterText(inputElement) {
    var parent = inputElement.parentElement; // Находим родительский элемент
    var smallElement = parent.querySelector('small'); // Находим первый элемент <small> внутри родительского элемента
    var labelElement = parent.querySelector('label');
        if (inputElement.checked) {
            labelElement.innerHTML = 'Only country of startpoint'
            smallElement.innerHTML = "Now restrict the search to the country of startpoint";
        } else {
            labelElement.innerHTML = 'Any country'
            smallElement.innerHTML = "Now allow the search outside the country of startpoint";
        }
    }

const shareButton = document.getElementById("journey-share-button");
shareButton.addEventListener("click", (e) => {
  if (navigator.share) {
    navigator.share({
        title: 'Share your journey',
        text: 'Hey, check this out',
        url: document.getElementById('mapLink').href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  } else {
    // Копирование URL в буфер обмена
    const urlToCopy = document.getElementById('mapLink').href;
    navigator.clipboard.writeText(urlToCopy)
      .then(() => {
        console.log('URL скопирован в буфер обмена: ', urlToCopy);
        // Уведомление о копировании URL
        alert('URL скопирован в буфер обмена: ' + urlToCopy);
      })
      .catch((error) => {
        console.error('Ошибка копирования в буфер обмена: ', error);
        // Уведомление об ошибке копирования
        alert('Ошибка копирования в буфер обмена.');
      });
  }
});
