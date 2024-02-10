from django import forms
from django.forms import HiddenInput

ROUTE_TYPES = [('car', 'car'), ('walk', 'walk'), ('bicycle', 'bicycle')]
CITY_SIZES = [('0', 'Deravnya'), ('1', 'Selo'), ('2', 'Gorod'), ('3', 'Megapolis')]

class RouletteForm(forms.Form):
    searchTextField = forms.CharField(help_text='enter a city mazafaka', widget=forms.TextInput(attrs={'placeholder': 'enter a location' ,'autocomplete': 'on', 'runat': 'server', 'class': 'form-control'}), max_length=100)
    # rounds = forms.DecimalField(help_text='1-10 rounds recomended', widget=forms.NumberInput(attrs={'class': 'form-control'}))
    # citySize = forms.ChoiceField(help_text='do u prefer megapolis or vilage?',widget=forms.Select(attrs={ 'class': 'form-control'}), choices=CITY_SIZES)
    # radius = forms.DecimalField(help_text='50-300 recomended', widget=forms.NumberInput(attrs={'class': 'form-control'}))
    # type = forms.ChoiceField(help_text='How much wheels do u havem bro?',widget=forms.Select(attrs={'class': 'form-control'}), choices=ROUTE_TYPES)
    # local = forms.BooleanField(help_text='No one border can stop me?', widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}), required=False)
    random = forms.BooleanField(widget=HiddenInput(), initial=True)

    city = forms.CharField(widget=HiddenInput(), max_length=100)
    cityLat = forms.CharField(widget=HiddenInput(), max_length=100)
    cityLng = forms.CharField(widget=HiddenInput(), max_length=100)

class CityForm(forms.Form):
    searchTextField = forms.CharField(help_text='enter a city mazafaka', widget=forms.TextInput(attrs={'placeholder': 'enter a location' ,'autocomplete': 'on', 'runat': 'server', 'class': 'form-control'}), max_length=100)
    random = forms.BooleanField(widget=HiddenInput(), initial=True)
    city = forms.CharField(widget=HiddenInput(), max_length=100)
    cityLat = forms.CharField(widget=HiddenInput(), max_length=100)
    cityLng = forms.CharField(widget=HiddenInput(), max_length=100)

