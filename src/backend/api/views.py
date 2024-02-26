from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from chat.models import UserSetting
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from datetime import datetime as dt
from datetime import timedelta
from django.utils.timezone import now
from django.urls import reverse
from urllib.parse import quote
from django.conf import settings
import requests
from django.core.files.base import ContentFile
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
import re

def signup_view(request):
    logout(request)

    if request.method == 'POST':

        jwt_token = request.POST.get('jwt_token')  # Assuming the JWT token is sent in the request
        
        # Check if JWT token is present and valid
        if not jwt_token:
            return JsonResponse({'error': 'JWT token is required.'}, status=400)
        
        try:
            # Verify the JWT token
            access_token = AccessToken(jwt_token)
            user = access_token.payload.get('user_id')  # Extract user ID from token payload
            if not user:
                return JsonResponse({'error': 'Invalid JWT token.'}, status=401)
        except Exception as e:
            return JsonResponse({'error': 'Invalid JWT token.'}, status=401)

        email = request.POST.get('email')
        username = request.POST.get('username')
        password = request.POST.get('password')
        error = ''
        
        if not email_valid(email):
            error = "Wrong email address."
        try:
            if User.objects.get(username=email) is not None:
                error = 'This email is already used.'
        except: pass

        # if error or  jwt not valid
        if error:
            return render(request, "signup.html", context={'error': error})

        user = User.objects.create_user(
            username = email, 
            password = password,
        )
        userset = UserSetting.objects.create(user=user, username=username)
        
        login(request, user)
        return redirect('/')


    return render(request, 'signup.html')

def login_view(request):
    logout(request)
    context = {}


    if request.POST:
        email = request.POST['email']
        password = request.POST['password']
        
        user = authenticate(username=email, password=password)
        
        if user is not None:
            if user.is_active:
                login(request, user)
                return redirect('/')
        else:
            context = {
            "error": 'Email or Password was wrong.',
            }    
        
    return render(request, 'login.html',context)

@login_required
def settings_view(request):
    user = User.objects.get(username=request.user)
    Usettings = UserSetting.objects.get(user=user)  

    if request.method == 'POST':
        try:    avatar = request.FILES["avatar"]
        except: avatar = None
        username = request.POST['username']

        Usettings.username = username
        if(avatar != None):
            Usettings.profile_image.delete(save=True)
            Usettings.profile_image = avatar
        Usettings.save()

    context = {
        "settings" : Usettings,
        'user' : user,
    }
    return render(request, 'settings.html', context=context)

def email_valid(email):
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if(re.fullmatch(regex, email)): return True
    return False


def save_oauth_user(user, username, email, image_url):
    response = requests.get(image_url)
    if response.status_code == 200:
        # Get or create the UserSetting instance for the user
        user_setting, created = UserSetting.objects.get_or_create(user=user)
        # Save the image to the profile_image attribute of the UserSetting instance
        user_setting.profile_image.save(f"user_{user.pk}_profile.jpg", ContentFile(response.content), save=True)
        # Save the username and email to the UserSetting instance
        user_setting.username = username
        user_setting.user.email  = email
        user_setting.save()

def oauth_login(request):
    base_url = "https://api.intra.42.fr/oauth/authorize"
    redirect_uri = request.build_absolute_uri(reverse('oauth_callback'))
    if not redirect_uri.endswith('/'):
        redirect_uri += '/'
    encoded_redirect_uri = quote(redirect_uri, safe='')
    # Delete last 3 characters from encoded_redirect_uri to remove %2F
    encoded_redirect_uri = encoded_redirect_uri[:-3]
    encoded_redirect_uri = "https%3A%2F%2Flocalhost%2Foauth%2Fcallback"
    oauth_url = f"{base_url}?client_id={settings.OAUTH_CLIENT_ID}&redirect_uri={encoded_redirect_uri}&response_type=code"
    print(oauth_url)
    return redirect(oauth_url)

def oauth_callback(request):
    code = request.GET.get('code')
    token_url = "https://api.intra.42.fr/oauth/token"
    redirect_uri = "https://localhost/oauth/callback"
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
    print("data: ", user_data)

    user_email = user_data['email']
    user_login = user_data['login']
    user_small_pfp = user_data['image']['versions']['small']

    # Here we assume that the email can uniquely identify a user
    user, created = User.objects.get_or_create(username=user_email)
    if created:
        save_oauth_user(user, user_login, user_email, user_small_pfp)
    user.backend = 'django.contrib.auth.backends.ModelBackend'  # Specify the backend
    login(request, user)


    return redirect('/')

# JWT token endpoints
def obtain_jwt_token(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        user = authenticate(username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

def refresh_jwt_token(request):
    if request.method == 'POST':
        refresh_token = request.POST.get('refresh')
        token = RefreshToken(refresh_token)
        if token.blacklist_after:
            return JsonResponse({'error': 'Token is blacklisted'}, status=401)
        return JsonResponse({'access': str(token.access_token)})