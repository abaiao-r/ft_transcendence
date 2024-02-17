from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

# Create a form for user registration
class CustomUserCreationForm(UserCreationForm):
    profile_pic = forms.ImageField(required=False)
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = UserCreationForm.Meta.fields + ('email', 'profile_pic',)


    def save(self, commit=True):
        user = super().save(commit=False)
        if not self.cleaned_data.get('profile_pic'):
            user.profile_pic = 'default.png'
        if commit:
            user.save()
        return user
    
class ProfileImageForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['profile_pic']