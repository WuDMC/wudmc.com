from django.urls import path
from webpage import views

urlpatterns = [
    path('', views.index, name='index'),
    path('index.html', views.index, name='index'),	
    path('skills.html', views.skills, name='skills'),
    path('hobbies.html', views.hobbies, name='hobbies'),
]
