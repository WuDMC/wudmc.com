# from django.shortcuts import render
#
# from django.http import HttpResponse
# import random
# import requests
# import json
# import gmaps
#
#
# responseStyle = 'short'
# citySize = 'cities15000'
# radius = 50
# maxRows = 30
# username = 'wudmc'
# city = 'Batumi'
# country_code = 'GE'
# key = 'AIzaSyC1bv4VSX5EqyfQ5j4GM5Cpwi4wh2pjKwQ'
#
# gmaps.configure(api_key=key)
#
# def nearests(lat, lng):
#     body = {}
#     headers = {'content-type': 'application/json'}
#     url = f'http://api.geonames.org/findNearbyPlaceNameJSON?lat={lat}&lng={lng}&style={responseStyle}&cities={citySize}&radius={radius}&maxRows={maxRows}&username={username}'
#     r = requests.post(url, data=json.dumps(body), headers=headers)
#     cities = json.loads(r.content)
#     return cities
#
#
# def choose_city(cities, worldwide=False):
#     arr = []
#     for city in cities['geonames']:
#         # print(city['name'])
#         if worldwide == True:
#             arr.append(city)
#         elif city['countryCode'] == country_code:
#             arr.append(city)
#     return random.choice(arr[1:])
#
#
# def gen_route(lat, lng, worldwide=False, rounds=1, cache=None):
#     # print(f'Режим по всему МИРУ включен') if worldwide == True else print(f'Режим по всему взаперти включен')
#     cities = nearests(lat, lng)
#     route = cache or [cities['geonames'][0]]
#
#     next_city = choose_city(cities, worldwide)
#
#     # print(f'Следующий город')
#     # print(next_city['name'])
#     route.append(next_city)
#     if rounds == 1:
#         print(f'\n\nМаршрут:')
#         for point in route:
#             print(point['name'])
#         return (route)
#     else:
#         return (gen_route(next_city['lat'], next_city['lng'], worldwide, rounds - 1, route))
#
#
# def city_coordinates(city, country_code):
#     url = f'https://maps.googleapis.com/maps/api/geocode/json?address={city},{country_code}&key={key}'
#     body = {}
#     headers = {'content-type': 'application/json'}
#
#     r = requests.post(url, data=json.dumps(body), headers=headers)
#     geocodeObject = json.loads(r.content)
#     latitude = geocodeObject['results'][0]['geometry']['location']['lat']
#     longitude = geocodeObject['results'][0]['geometry']['location']['lng']
#     return ({'lat': latitude, 'lng': longitude})
#
#
# def trip_roulette(city, country_code, worldwide=False, rounds=1):
#     start_coordinates = city_coordinates(city, country_code)
#     lat, lng = start_coordinates['lat'], start_coordinates['lng']
#     route = []
#     route.append(gen_route(lat, lng, worldwide, rounds))
#     return (route)
#
# def create_route(route):
#     start = (float(route[0][0]['lat']), float(route[0][0]['lng']))
#     finish = (float(route[0][-1]['lat']), float(route[0][-1]['lng']))
#
#     stops = []
#
#     for stop in route[0][1:-1]:
#         stops.append((float(stop['lat']), float(stop['lng'])))
#
#     fig = gmaps.figure()
#
#     trip = gmaps.directions_layer(
#         start, finish, waypoints=stops)
#     fig.add_layer(trip)
#     fig
#
# def roulette(request):
#     return render(request, startpoint.html, {})