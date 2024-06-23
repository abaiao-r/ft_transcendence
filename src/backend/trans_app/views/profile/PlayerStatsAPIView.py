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
        username = request.query_params.get('username')
        user = request.user

        # Check if user to be searched exists
        if username and not User.objects.filter(username=username).exists():
            return Response({'error': 'User not found'}, status=404)
        # Check if request user is valid
        if not user:
            return Response({'error': 'Request user not found'}, status=404)
        if username:
            user = User.objects.get(username=username)

        userStats = None
        if not UserStats.objects.filter(user=user).exists():
            # create user stats if not exists
            userStats = UserStats.objects.create(user=user)
    
        userStats = UserStats.objects.get(user=user)

        response = {
            'username': user.username,
            'wins': userStats.wins,
            'losses': userStats.losses,
            'games_played': userStats.games,
            'win_rate': userStats.wins / userStats.games if userStats.games > 0 else 0,
            'win_loss_difference': userStats.wins - userStats.losses,
            'points_scored': userStats.points_scored,
            'points_conceded': userStats.points_conceded,
            'rallies': userStats.rallies,
            'time_played': userStats.time_played,
            'tournaments_won': userStats.tournaments_won,
            'rallies_per_point': userStats.rallies / userStats.points_scored if userStats.points_scored > 0 else 0,
            'ranking' : userStats.get_ranking(),
        }

        return Response(response)