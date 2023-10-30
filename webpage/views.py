from django.shortcuts import render
from .forms import RouletteForm

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


