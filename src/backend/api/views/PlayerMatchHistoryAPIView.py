from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from chat.models import UserSetting
from chat.models import Match
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication


class PlayerMatchHistoryAPIView(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not UserSetting.objects.filter(user=user).exists():
            return Response({'error': 'User not found'}, status=400)
        
        user_setting = UserSetting.objects.get(user=user)
        user_match_history = Match.objects.filter(player1=user)

        response = []

        for match in user_match_history:
            match_data = {
                'player1': match.player1.username,
                'player2': match.player2.username,
                'winner': match.winner.username,
                'loser': match.loser.username,
                'player1_score': match.player1_score,
                'player2_score': match.player2_score,
                'match_date': match.match_date.isoformat(),
                'match_type': match.match_type,
            }
            response.append(match_data)
        return Response(response)
    
    def post(self, request):

        player1 = request.data.get('player1')
        player2 = request.data.get('player2')
        winner = request.data.get('winner')
        loser = request.data.get('loser')
        player1_score = request.data.get('player1_score')
        player2_score = request.data.get('player2_score')
        match_date = request.data.get('match_date')
        match_type = request.data.get('match_type')

        if not player1 or not player2 or not winner or not loser or not player1_score or not player2_score or not match_date or not match_type:
            return Response({'error': 'Invalid request'}, status=400)
        
        if not UserSetting.objects.filter(username=player1).exists() \
            or not UserSetting.objects.filter(username=player2).exists():
            return Response({'error': 'User not found'}, status=400)
        
        if player1 == player2:
            return Response({'error': 'Player1 and Player2 cannot be the same'}, status=400)
        
        if winner != player1 and winner != player2:
            return Response({'error': 'Winner must be either Player1 or Player2'}, status=400)
        
        if loser != player1 and loser != player2:
            return Response({'error': 'Loser must be either Player1 or Player2'}, status=400)
        
        if match_type not in ['normal', 'ranked']:
            return Response({'error': 'Invalid match type'}, status=400)
        
        if not player1_score.isdigit() or not player2_score.isdigit():
            return Response({'error': 'Invalid score'}, status=400)

        if int(player1_score) < 0 or int(player2_score) < 0:
            return Response({'error': 'Invalid score'}, status=400)
        
        match = Match(
            player1=User.objects.get(username=player1),
            player2=User.objects.get(username=player2),
            winner=User.objects.get(username=winner),
            loser=User.objects.get(username=loser),
            player1_score=player1_score,
            player2_score=player2_score,
            match_date=match_date,
            match_type=match_type
        )
        match.save()

        # Update player statistics
        player1_setting = UserSetting.objects.get(username=player1)
        player2_setting = UserSetting.objects.get(username=player2)

        player1_setting.wins += 1 if winner == player1 else 0
        player1_setting.losses += 1 if winner == player2 else 0
        player1_setting.save()

        player2_setting.wins += 1 if winner == player2 else 0
        player2_setting.losses += 1 if winner == player1 else 0
        player2_setting.save()
        
        return Response({'message': 'Match saved successfully'})