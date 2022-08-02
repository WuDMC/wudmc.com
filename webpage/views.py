from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.http import JsonResponse

from .forms import RouletteForm


import random
import requests
import json

# Create your views here.

def index(request):
    return render(request, 'index.html', {})
    
def skills(request):
    return render(request, 'skills.html', {})
    
def hobbies(request):
    return render(request, 'hobbies.html', {})


def nearests(lat, lng, size=2, radius=300, local=True):
    username = 'wudmc'
    responseStyle = 'short'
    maxRows = 30
    citySizeArr = ['cities500', 'cities1000', 'cities5000', 'cities15000']
    citySize = citySizeArr[size]
    body = {}
    radius = 300 if radius > 300 else radius
    radius = 15 if radius < 15 else radius
    headers = {'content-type': 'application/json'}
    url = f'http://api.geonames.org/findNearbyPlaceNameJSON?lat={lat}&lng={lng}&style={responseStyle}&cities={citySize}&radius={radius}&maxRows={maxRows}&username={username}&localCountry={local}'
    r = requests.post(url, data=json.dumps(body), headers=headers)
    cities = json.loads(r.content)
    return cities


def choose_city(cities, type='car', skiped=None, radius = None):
    arr = []
    skipped_arr = skiped or []
    dist_dict = {'car': {'min': 10, 'max': 300}, 'walk': {'min': 1, 'max': 10}, 'bicycle': {'min': 3, 'max': 30}}
    radius = radius or dist_dict[type]['max']
    print('test')
    print(radius)
    for city in cities['geonames']:
        # print(city['name'])
        if (dist_dict[type]['min'] < float(city['distance']) < float(radius)) and (city not in skipped_arr):
            arr.append(city)
        elif dist_dict[type]['min'] > float(city['distance']) and (city not in skipped_arr):
            skipped_arr.append(city)
    # print(arr)
    # print(skipped_arr)
    return [random.choice(arr), skipped_arr]


def gen_route(lat, lng, size=2, local=True, radius = None, type='car', cache=None, skiped=None, rounds=1):
    dist_dict = {'car': {'min': 10, 'max': 300}, 'walk': {'min': 1, 'max': 10}, 'bicycle': {'min': 3, 'max': 30}}
    radius = radius or dist_dict[type]['max']
    print(radius)
    cities = nearests(lat, lng, size, radius, local)
    route = cache or []
    skiped_arr = skiped or []
    next_city, skiped_arr = choose_city(cities, type, skiped_arr, radius)
    print(f'Следующий город')
    print(next_city['name'])
    route.append(next_city)
    if rounds == 1:
        print(f'\n\nМаршрут:')
        for point in route:
            print(point['name'])
        return (route)
    else:
        return (gen_route(next_city['lat'], next_city['lng'], local=local, radius=radius, rounds=rounds - 1, cache=route,
                          skiped=skiped_arr))


def roulette(request):
    roulette_form = RouletteForm(initial={'rounds': 3, 'radius': 300, 'citySize': '2'})
    return render(request, 'roulette.html', {'roulette_form': roulette_form})

def roulette_result(request):
    if request.method == 'POST':
        roulette_form = RouletteForm(request.POST)
        if roulette_form.is_valid():
            lan = request.POST.get('cityLat')
            lng = request.POST.get('cityLng')
            radius_form = int(request.POST.get('radius'))
            rounds_form = int(request.POST.get('rounds'))
            type_form = request.POST.get('type')
            local_form = request.POST.get('local')
            print(local_form)
            result = gen_route(lan, lng, size=2, local=local_form, type=type_form, rounds=rounds_form, radius=radius_form)
            return JsonResponse({"result": result})
    else:
        return JsonResponse({"result": 'null'})
