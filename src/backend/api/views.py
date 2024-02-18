from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.conf import settings
from django.core.files.base import ContentFile
from urllib.parse import quote
import requests
from .forms import CustomUserCreationForm
from .models import CustomUser
from .forms import ProfileImageForm


class CustomLoginView(LoginView):
    template_name = 'login.html'

    def form_valid(self, form):
        return super().form_valid(form)


def register_view(request):
    if request.user.is_authenticated:
        return redirect('/api/profile')
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save(commit=False)  # Save the form to get a user instance, but don't commit to DB yet
            # if profile pic is not provided, use a default image
            if not user.profile_pic:
                default_img_url = 'https://i.ibb.co/cTHYRDn/OP73-K1g-Imgur.png'
                response = requests.get(default_img_url)
                if response.status_code == 200:
                    user.profile_pic.save('default.png', ContentFile(response.content), save=False)
            user.save()  # Now save the user to the database
            return redirect('/api/login')
        else:
            return render(request, 'register.html', {'form': form})
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})


def update_profile(request):
    if request.method == 'POST':
        form = ProfileImageForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('/api/profile')
    else:
        form = ProfileImageForm(instance=request.user)
    return render(request, 'profile_update.html', {'form': form})

@login_required(login_url='/api/login/')
def profile_view(request):
    if request.method == 'POST':
        form = ProfileImageForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('/api/profile')
    else:
        form = ProfileImageForm(instance=request.user)
    return render(request, 'profile.html', {'user': request.user, 'form': form})


def save_user_image_from_url(user, image_url):
    response = requests.get(image_url)
    if response.status_code == 200:
        # The name of the image file can be customized
        user.profile_pic.save(f"user_{user.pk}_profile.jpg", ContentFile(response.content), save=True)

def oauth_login(request):
    base_url = "https://api.intra.42.fr/oauth/authorize"
    redirect_uri = request.build_absolute_uri(reverse('oauth_callback'))
    if not redirect_uri.endswith('/'):
        redirect_uri += '/'
    encoded_redirect_uri = quote(redirect_uri, safe='')
    # Delete last 3 characters from encoded_redirect_uri to remove %2F
    encoded_redirect_uri = encoded_redirect_uri[:-3]
    oauth_url = f"{base_url}?client_id={settings.OAUTH_CLIENT_ID}&redirect_uri={encoded_redirect_uri}&response_type=code"
    print(oauth_url)
    return redirect(oauth_url)

def oauth_callback(request):
    code = request.GET.get('code')
    token_url = "https://api.intra.42.fr/oauth/token"
    redirect_uri = "https://localhost/api/oauth/callback"
    data = {
        'grant_type': 'authorization_code',
        'client_id': settings.OAUTH_CLIENT_ID,
        'client_secret': settings.OAUTH_CLIENT_SECRET,
        'code': code,
        'redirect_uri': redirect_uri,
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    token_response = requests.post(token_url, data=data, headers=headers)
    access_token = token_response.json().get('access_token')

    # Use the access token to get user data
    user_data_response = requests.get("https://api.intra.42.fr/v2/me", headers={"Authorization": f"Bearer {access_token}"})
    user_data = user_data_response.json()

    user_login = user_data['login']
    user_email = user_data['email']
    user_small_pfp = user_data['image']['versions']['small']

    # Here we assume that the email can uniquely identify a user
    user, created = CustomUser.objects.update_or_create(
        email=user_email,  # Use email for lookup
        defaults={
            'username': user_login,  # Update username
            #'profile_pic': user_small_pfp,  # Update profile pic
            'is_oauth': True,  # Set a flag to indicate that this user was created via OAuth
        }
    )
    if created:
        save_user_image_from_url(user, user_small_pfp)
    user.backend = 'django.contrib.auth.backends.ModelBackend'  # Specify the backend
    login(request, user)


    return redirect('/api/profile')