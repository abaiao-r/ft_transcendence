from django.contrib.auth.models import User
from trans_app.models import UserStats
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response

class PlayerStatsAPIView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not UserStats.objects.filter(user=user).exists():
            return Response({'error': 'User not found'}, status=400)
        
        user_stats = UserStats.objects.get(user=user)

        response = {
            'username': user.username,
            'wins': user_stats.wins,
            'losses': user_stats.losses,
            'games_played': user_stats.games,
            'win_rate': user_stats.wins / user_stats.games if user_stats.games > 0 else 0,
            'win_loss_difference': user_stats.wins - user_stats.losses,
            'points_scored': user_stats.points_scored,
            'points_conceded': user_stats.points_conceded,
            'rallies': user_stats.rallies,
            'time_played': user_stats.time_played,
            'tournaments_won': user_stats.tournaments_won
        }

        return Response(response)