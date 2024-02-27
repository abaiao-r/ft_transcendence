from django.contrib.auth import login
from django.contrib.auth.models import User
from chat.models import UserSetting
from django.conf import settings
import requests
from django.core.files.base import ContentFile
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.renderers import JSONRenderer

class OAuthCallbackAPIView(APIView):
    renderer_classes = [JSONRenderer]  # Specify JSON renderer

    def get(self, request):
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

        print("ACCESS TOKEN: ", access_token)

        # Use the access token to get user data
        user_data_response = requests.get("https://api.intra.42.fr/v2/me", headers={"Authorization": f"Bearer {access_token}"})
        user_data = user_data_response.json()
        print(user_data)
        user_email = user_data['email']
        user_login = user_data['login']
        user_small_pfp = user_data['image']['versions']['small']

        user, created = User.objects.get_or_create(username=user_login)
        if created:
            save_oauth_user(user, user_login, user_email, user_small_pfp)
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)

        # print 42 data
        print("email: ", user_email)
        print("login: ", user_login)
        print("image: ", user_small_pfp)

        # Generate JWT token
        refresh = RefreshToken.for_user(user)

        # Return a successful response with JWT token access and refresh
        return Response({
            'message': 'Remote authentication successful',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
        })
    
def save_oauth_user(user, username, email, image_url):
    response = requests.get(image_url)
    if response.status_code == 200:
        # Get or create the UserSetting instance for the user
        user_setting, created = UserSetting.objects.get_or_create(user=user)
        # Save the image to the profile_image attribute of the UserSetting instance
        user_setting.profile_image.save(f"user_{user.pk}_profile.jpg", ContentFile(response.content), save=True)
        # Save the username and email to the UserSetting instance
        user_setting.username = username
        user_setting.save()