$(document).ready(
  $('#post-form2').submit(function(e){
    e.preventDefault();
    var formData = {
                    lat: parseFloat($('#id_cityLat').val()),
                    lng: parseFloat($('#id_cityLng').val()),
                    opts: {
                        size: parseInt($('#id_citySize').val()),
                        local: $('#id_local').is(':checked'),
                        radius: parseInt($('#id_radius').val()),
                        type: $('#id_type').val(),
                        rounds: parseInt($('#id_rounds').val())
                    }
                };
    var jsonData = JSON.stringify(formData);
    console.log(jsonData);
    $.ajax({
      type:"POST",
      url: "http://localhost:4567/route",
      data:  jsonData,
      success: function(data){
        $("#result").text(data["result"]);
        route = data["result"];
        initMap();
      }
    });
  })
);

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

}

function calcRoute() {
    console.log('startcalc');
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
        travelMode: google.maps.DirectionsTravelMode.WALKING
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
    console.log(country_code);
    test = place;
    console.log(place);
});
}

function getCountryCode(place) {
    var code;
    var adr = place.address_components;
    for (var i = 1; i < adr.length + 1; i++) {
          console.log(adr.length);
          console.log(i);
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
          console.log(reason)
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