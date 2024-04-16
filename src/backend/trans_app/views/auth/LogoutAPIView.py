from django.contrib.auth.models import User
from trans_app.models import UserSetting
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import OutstandingToken
from django.contrib.auth import logout

class LogoutAPIView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


    def post(self, request):
    
        if not request.headers.get('Refresh'):
            return Response({"error": "No refresh token found"}, status=400)
        
        user = request.user

        if not user:
            return Response({"error": "User not found"}, status=404)
        if not User.objects.filter(username=user.username).exists():
            return Response({"error": "User does not exist"}, status=404)
        if not user.is_active:
            return Response({"error": "User is already logged out"}, status=400)
        # Set user as offline
        user_setting = UserSetting.objects.get(user=user)
        user_setting.is_online = False
        user_setting.last_online = None
        user_setting.save()
        logout(request)
        
        # Revoke JWT token
        refresh_token = request.headers.get('Refresh')
        if refresh_token:
            try:
                # Blacklist the refresh token
                OutstandingToken.objects.filter(token=refresh_token).delete()
                return Response({"message": "Logout successful"})
            except Exception as e:
                return Response({"error": str(e)}, status=500)

        else:
            return Response({"error": "No refresh token found"}, status=400)