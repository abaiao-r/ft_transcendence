from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from trans_app.models import UserSetting
from trans_app.models import UserStats
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

class StatsAPIView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # check for user and user setting
        if not user or not UserSetting.objects.filter(user=user).exists():
            return Response({'error': 'User not found'}, status=400)

        user_stats = UserStats.objects.filter(user=user)

        user_data = {
            'username': user.username,
            'points_scored': user.points_scored,
            'points_conceded': user.points_conceded,
            'rallies': user.rallies,
            'time_played': user.time_played,
            'rallies_per_point': user.rallies / user.points_scored if user.points_scored > 0 else 0,
            'wins': user.wins,
            'losses': user.losses,
            'games': user.games,
            'win_rate': user.wins / (user.wins + user.losses) * 100 if user.wins + user.losses > 0 else 0,
            'tournaments_won': user.tournaments_won,
        }
        return Response(user_data)