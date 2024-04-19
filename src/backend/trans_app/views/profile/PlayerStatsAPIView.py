from django.contrib.auth.models import User
from trans_app.models import UserSetting
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response

class PlayerStatsAPIView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not UserSetting.objects.filter(user=user).exists():
            return Response({'error': 'User not found'}, status=400)
        
        user_setting = UserSetting.objects.get(user=user)

        response = {
            'username': user.username,
            'wins': user_setting.wins,
            'losses': user_setting.losses,
            'games_played': user_setting.number_of_matches,
            'win_rate': user_setting.wins / user_setting.number_of_matches if user_setting.number_of_matches > 0 else 0,
            'win_loss_difference': user_setting.wins - user_setting.losses,
        }

        return Response(response)