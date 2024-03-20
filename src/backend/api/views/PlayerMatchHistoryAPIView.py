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
                'player3': match.player3.username if match.player3 else '',
                'player4': match.player4.username if match.player4 else '',
                'winner': match.winner.username,
                'player1_score': match.player1_score,
                'player2_score': match.player2_score,
                'player3_score': match.player3_score if match.player3_score else '',
                'player4_score': match.player4_score if match.player4_score else '',
                'match_date': match.match_date.isoformat(),
                'match_type': match.match_type,
            }
            response.append(match_data)
        return Response(response)
    
    def post(self, request):

        player1 = request.data.get('player1')
        player2 = request.data.get('player2')
        player3 = request.data.get('player3')
        player4 = request.data.get('player4')
        winner = request.data.get('winner')
        player1_score = request.data.get('player1_score')
        player2_score = request.data.get('player2_score')
        player3_score = request.data.get('player3_score')
        player4_score = request.data.get('player4_score')
        match_date = request.data.get('match_date')
        match_type = request.data.get('match_type')

        if not player1 or not player2 or not winner or not player1_score or not player2_score or not match_date or not match_type:
            return Response({'error': 'Invalid request'}, status=400)
        
        players = [player1, player2, player3, player4]
        scores = [player1_score, player2_score, player3_score, player4_score]

        # Check if players exist
        for player in players:
            if player and not UserSetting.objects.filter(username=player).exists():
                return Response({'error': 'User not found'}, status=400)

        # Check for invalid player/score combinations
        for i in range(len(players)):
            if players[i] and not scores[i]:
                return Response({'error': 'Invalid score'}, status=400)
            if not players[i] and scores[i]:
                return Response({'error': 'Invalid player'}, status=400)

        # Remove empty players
        players = [player for player in players if player]

        # Remove empty scores
        scores = [score for score in scores if score]

        # Check for repeated players
        if len(players) != len(set(players)):
            return Response({'error': 'Repeated players'}, status=400)

        if winner not in players:
            return Response({'error': 'Winner must be one of the players'}, status=400)
        
        if match_type not in ['normal', 'ranked', 'ai']:
            return Response({'error': 'Invalid match type'}, status=400)
        
        # Check for non-numeric or negative scores
        for score in scores:
            if not (score.isdigit() and int(score) >= 0):
                return Response({'error': 'Invalid score'}, status=400)
            
        match = Match(
            player1=User.objects.get(username=player1),
            player2=User.objects.get(username=player2),
            player3=User.objects.get(username=player3) if player3 else None,
            player4=User.objects.get(username=player4) if player4 else None,
            winner=User.objects.get(username=winner),
            player1_score=player1_score,
            player2_score=player2_score,
            match_date=match_date,
            match_type=match_type
        )
        match.save()


        # Update player statistics
        for player in players:
            player_setting = UserSetting.objects.get(username=player)
            player_setting.number_of_matches += 1
            if player == winner:
                player_setting.wins += 1
            else:
                player_setting.losses += 1
            player_setting.save()
            
        return Response({'message': 'Match saved successfully'})