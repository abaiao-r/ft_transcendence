from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

# Create a form for user registration
class CustomUserCreationForm(UserCreationForm):
    profile_pic = forms.ImageField(required=False)
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = UserCreationForm.Meta.fields + ('email', 'profile_pic',)
