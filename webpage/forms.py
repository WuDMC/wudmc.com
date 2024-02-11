from django import forms
from django.forms import HiddenInput

ROUTE_TYPES = [('car', 'car'), ('walk', 'walk'), ('bicycle', 'bicycle')]
CITY_SIZES = [('0', 'Deravnya'), ('1', 'Selo'), ('2', 'Gorod'), ('3', 'Megapolis')]

class RouletteForm(forms.Form):
    searchTextField = forms.CharField(help_text='',label='Just enter your startpoint and press the button!', widget=forms.TextInput(attrs={'placeholder': 'enter a location' ,'autocomplete': 'on', 'runat': 'server', 'class': 'form-control'}), max_length=100)
    rounds = forms.DecimalField(help_text='How many stops will be in your trip', label='Stops:', widget=forms.NumberInput(attrs={'class': 'form-control form-range' , 'type':'range', 'min': '1', 'max': '15', 'step': '1', 'oninput':"updateValue(this);"}), required=False, initial=3)
    citySize = forms.ChoiceField(help_text='Choose the size of places to stop', label='Max city size:',widget=forms.NumberInput(attrs={ 'class': 'form-control form-range', 'type':'range', 'min': '0', 'max': '3', 'step': '1', 'oninput':"updateValue(this);"}), required=False, initial='M')
    radius = forms.DecimalField(help_text='How many km between each stop', label='Max distance between stops:', widget=forms.NumberInput(attrs={'class': 'form-control form-range', 'type':'range', 'min': '5', 'max': '300', 'step': '5', 'oninput':"updateValue(this);"}), required=False, initial=75)
    local = forms.BooleanField(help_text='this parameter will restrict the search on the country of startpoint,', label='Only  country of startpoint', widget=forms.CheckboxInput(attrs={'class': 'form-check-input custom-control-input'}), required=False)
    random = forms.BooleanField(widget=HiddenInput(), initial=True)

    city = forms.CharField(widget=HiddenInput(), max_length=100)
    cityLat = forms.CharField(widget=HiddenInput(), max_length=100)
    cityLng = forms.CharField(widget=HiddenInput(), max_length=100)
