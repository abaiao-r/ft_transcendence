from django.shortcuts import redirect
from django.urls import reverse
from urllib.parse import quote
from django.conf import settings
from rest_framework.views import APIView

class OAuthLoginAPIView(APIView):
    def get(self, request):
        base_url = "https://api.intra.42.fr/oauth/authorize"
        redirect_uri = request.build_absolute_uri(reverse('oauth_callback'))
        if not redirect_uri.endswith('/'):
            redirect_uri += '/'
        encoded_redirect_uri = quote(redirect_uri, safe='')
        # Delete last 3 characters from encoded_redirect_uri to remove %2F
        encoded_redirect_uri = encoded_redirect_uri[:-3]
        encoded_redirect_uri = "https%3A%2F%2Flocalhost%3A8443%2Foauth%2Fcallback"
        oauth_url = f"{base_url}?client_id={settings.OAUTH_CLIENT_ID}&redirect_uri={encoded_redirect_uri}&response_type=code"
        return redirect(oauth_url)