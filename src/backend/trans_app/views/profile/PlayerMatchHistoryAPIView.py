from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from trans_app.models import Match, UserSetting
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.timezone import now

class PlayerMatchHistoryAPIView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user:
            return Response({'error': 'User not found'}, status=400)
        
        user_match_history = Match.objects.filter(player1=user)
        response = []

        for match in user_match_history:
            match_data = {
                'player1': match.player1.username,
                'player2': match.player2,
                'player3': match.player3 if match.player3 else '',
                'player4': match.player4 if match.player4 else '',
                'winner': match.winner if match.winner else '',
                'player1_score': match.player1_score,
                'player2_score': match.player2_score,
                'player3_score': match.player3_score,
                'player4_score': match.player4_score,
                'match_date': match.match_date.isoformat(),
                'match_type': match.match_type,
            }
            response.append(match_data)
        return Response(response)

    def post(self, request):
        data = request.data
        player1 = User.objects.filter(username=data.get('player1')).first()

        if not player1:
            return Response({'error': 'Player1 not found'}, status=400)

        player2_username = data.get('player2', '')
        player3_username = data.get('player3', '')
        player4_username = data.get('player4', '')
        winner_username = data.get('winner')
        match_date = data.get('match_date', now().isoformat())
        match_type = data.get('match_type', 'normal')
        player1_score = data.get('player1_score')
        player2_score = data.get('player2_score')
        player3_score = data.get('player3_score')
        player4_score = data.get('player4_score')

        # check if player 1 and 2 are not empty
        if not player2_username:
            return Response({'error': 'Player2 is required'}, status=400)
        
        players = [player1.username, player2_username, player3_username, player4_username]
        # Remove empty players
        players = [player for player in players if player]

        # Check if winner is one of the players
        if winner_username not in players:
            return Response({'error': 'Winner must be one of the players'}, status=400)
        
        # Check if players are unique
        if len(set(players)) != len(players):
            return Response({'error': 'Players must be unique'}, status=400)
        
        # Check if theres scores of players that are playing
        if not player1_score or not player2_score:
            return Response({'error': 'Player scores are required'}, status=400)

        # Check for valid scores
        scores = [player1_score, player2_score, player3_score, player4_score]
        scores = [score for score in scores if score] # Remove empty scores
        # check if integer and >= 0
        if not all([score.isdigit() and int(score) >= 0 for score in scores]):
            return Response({'error': 'Invalid score'}, status=400)

        # Check for valid match type
        if match_type not in ['normal', 'tournament', 'ranked']:
            return Response({'error': 'Invalid match type'}, status=400)

        match = Match(
            player1=player1,
            player2=player2_username,
            player3=player3_username,
            player4=player4_username,
            winner=winner_username,
            player1_score=int(data.get('player1_score', 0)),
            player2_score=int(data.get('player2_score', 0)),
            player3_score=int(data.get('player3_score', 0)),
            player4_score=int(data.get('player4_score', 0)),
            match_date=match_date,
            match_type=match_type
        )
        match.save()

        # Update win and loss count
        user_setting = UserSetting.objects.get(user=player1)
        if winner_username == player1.username:
            user_setting.wins += 1
        else:
            user_setting.losses += 1
        user_setting.save()

        return Response({'message': 'Match saved successfully'})

