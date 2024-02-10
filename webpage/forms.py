from django import forms
from django.forms import HiddenInput

ROUTE_TYPES = [('car', 'car'), ('walk', 'walk'), ('bicycle', 'bicycle')]
CITY_SIZES = [('0', 'Deravnya'), ('1', 'Selo'), ('2', 'Gorod'), ('3', 'Megapolis')]

class RouletteForm(forms.Form):
    searchTextField = forms.CharField(help_text='enter a city mazafaka', widget=forms.TextInput(attrs={'placeholder': 'enter a location' ,'autocomplete': 'on', 'runat': 'server', 'class': 'form-control'}), max_length=100)
    rounds = forms.DecimalField(help_text='how mich rounds', label='roulette rounds', widget=forms.NumberInput(attrs={'class': 'form-control'}), required=False)
    citySize = forms.ChoiceField(help_text='Choose city size', label='city size',widget=forms.Select(attrs={ 'class': 'form-control'}), choices=CITY_SIZES, required=False)
    radius = forms.DecimalField(help_text='choosue radius', label='radius', widget=forms.NumberInput(attrs={'class': 'form-control'}), required=False)
    type = forms.ChoiceField(help_text='car/walk/bycycle', label='type of route',widget=forms.Select(attrs={'class': 'form-control'}), choices=ROUTE_TYPES, required=False)
    local = forms.BooleanField(help_text='no borders?', label='Local or not', widget=forms.CheckboxInput(attrs={'class': 'form-check-input'}), required=False)
    random = forms.BooleanField(widget=HiddenInput(), initial=True)

    city = forms.CharField(widget=HiddenInput(), max_length=100)
    cityLat = forms.CharField(widget=HiddenInput(), max_length=100)
    cityLng = forms.CharField(widget=HiddenInput(), max_length=100)
