from django.urls import path
from webpage import views

urlpatterns = [
    path('', views.index, name='index'),
    path('index.html', views.index, name='index'),	
    path('skills.html', views.skills, name='skills'),
    path('projects.html', views.projects, name='projects'),
    path('hobbies.html', views.hobbies, name='hobbies'),
    path('startpoint.html', views.roulette, name='startpoint.html'),
    path('visionz.html', views.visionz, name='visionz.html'),
    path('roulette_result', views.roulette_result, name='roulette_result'),
]
