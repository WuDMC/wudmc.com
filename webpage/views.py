import json
import requests
from django.shortcuts import render
from .forms import RouletteForm
from django.http import JsonResponse


def index(request):
    return render(request, 'index.html', {})
    
def skills(request):
    return render(request, 'skills.html', {})
    
def hobbies(request):
    return render(request, 'hobbies.html', {})

def projects(request):
    return render(request, 'projects.html', {})

def roulette(request):
    roulette_form = RouletteForm(initial={'rounds': 3, 'radius': 300, 'citySize': '2'})
    return render(request, 'roulette.html', {'roulette_form': roulette_form})

def roulette_result(request):
    if request.method == 'POST':
        try:
            # Получаем данные из POST-запроса
            post_data = json.loads(request.body.decode('utf-8'))
            print(post_data)
            # Формируем данные для запроса к локальному хосту
            local_request_data = {
                "lat": post_data.get("lat"),
                "lng": post_data.get("lng"),
                "opts": post_data.get("opts")
            }
            print(local_request_data)
            # Формируем запрос к локальному хосту
            local_url = "http://localhost:4567/route"
            response = requests.post(local_url, json=local_request_data)
            # Получаем данные из ответа и возвращаем их
            result_data = response.json()
            print(result_data)
            return JsonResponse(result_data)
        except json.JSONDecodeError as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=400)




