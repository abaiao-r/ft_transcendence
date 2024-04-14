from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
import requests

User = get_user_model()

class LoginAPIOauthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        access_token = request.data.get('access_token')

        if not access_token:
            return Response({'error': 'Access token is required'}, status=400)

        # Validate the access token and get the user's information from the OAuth provider
        # This will depend on your OAuth provider and may require additional requests
        user_data = validate_access_token_and_get_user_data(access_token)

        if not user_data:
            return Response({'error': 'Invalid access token'}, status=401)

        # Create or get a corresponding user in your database
        user, created = User.objects.get_or_create(username=user_data['username'])

        # Generate JWT tokens for the user
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Login successful',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })