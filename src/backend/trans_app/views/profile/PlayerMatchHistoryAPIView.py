from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from trans_app.models import Match, UserSetting, UserStats, UserMatchStats
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.timezone import now
import json
import ast

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
            # print match stats
            print("MATCH: ", match)
            print("STATS 1: ", match.player1_stats)
            print("STATS 2: ", match.player2_stats)
            match_data = {
                'player1': match.player1.username,
                'player2': match.player2,
                'player3': match.player3 if match.player3 else '',
                'player4': match.player4 if match.player4 else '',
                'winner': match.winner if match.winner else '',
                'player1_stats': self.get_player_stats(match.player1_stats),
                'player2_stats': self.get_player_stats(match.player2_stats),
                'player3_stats': self.get_player_stats(match.player3_stats),
                'player4_stats': self.get_player_stats(match.player4_stats),
                'match_date': match.match_date.isoformat(),
                'match_type': match.match_type,
                'match_duration': match.match_duration,
            }
            response.append(match_data)
        return Response(response)

    def post(self, request):
        data = request.data
        player1 = User.objects.filter(username=data.get('player1')).first()

        if not player1:
            return Response({'error': 'Player1 not found'}, status=400)

        player1_username = player1.username
        player2_username = data.get('player2')
        player3_username = data.get('player3')
        player4_username = data.get('player4')
        winner_username = data.get('winner')
        player1_stats = data.get('player1_stats')
        player2_stats = data.get('player2_stats')
        player3_stats = data.get('player3_stats')
        player4_stats = data.get('player4_stats')
        match_date = data.get('match_date', now())
        match_type = data.get('match_type', 'normal')
        match_duration = data.get('match_duration', 0)

        print("player1 stats: ", player1_stats)
        print("player2 stats: ", player2_stats)
        print("player3 stats: ", player3_stats)
        print("player4 stats: ", player4_stats)

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
        if not player1_stats and not player2_stats:
            return Response({'error': 'Scores are required'}, status=400)

        # Validate and convert stats
        player_stats = [player1_stats, player2_stats, player3_stats, player4_stats]
        player_stats = [self.validate_and_convert_stats(player_stat) for player_stat in player_stats if player_stat]

        print("Player stats: ", player_stats)

        # Check for valid scores
        if any([not player_stat for player_stat in player_stats]):
            return Response({'error': 'Invalid stats'}, status=400)
        
        scores = [stat.get('points_scored') for stat in player_stats]
        # check if integer and >= 0
        if not all([isinstance(score, int) and score >= 0 for score in scores]):
            return Response({'error': 'Invalid score'}, status=400)

        # Check for valid match type
        if match_type not in ['normal', 'tournament', 'ranked']:
            return Response({'error': 'Invalid match type'}, status=400)
        
        player1_stats = self.validate_and_convert_stats(player1_stats)
        player2_stats = self.validate_and_convert_stats(player2_stats)
        player3_stats = self.validate_and_convert_stats(player3_stats)
        player4_stats = self.validate_and_convert_stats(player4_stats)
        
        player1_stats_instance = self.create_player_stats_instance(player1_stats)
        player2_stats_instance = self.create_player_stats_instance(player2_stats)
        player3_stats_instance = self.create_player_stats_instance(player3_stats)
        player4_stats_instance = self.create_player_stats_instance(player4_stats)

        match = Match(
            player1=player1,
            player2=player2_username,
            player3=player3_username,
            player4=player4_username,
            winner=winner_username,
            player1_stats=player1_stats_instance,
            player2_stats=player2_stats_instance,
            player3_stats=player3_stats_instance,
            player4_stats=player4_stats_instance,
            match_date=match_date,
            match_type=match_type,
            match_duration=match_duration,
        )
        match.save()

        print("Match saved successfully: ", match)

        # Update stats
        user_setting = UserSetting.objects.get(user=player1)
        user_stats = UserStats.objects.get(user=player1)
        if winner_username == player1.username:
            user_stats.wins += 1
        else:
            user_stats.losses += 1
        self.update_player_stats(user_stats, player1_stats_instance, match_duration)        
        user_setting.save()

        return Response({'message': 'Match saved successfully'})
    
    def validate_and_convert_stats(self, stats):
        # Check if stats is a string
        stats = ast.literal_eval(stats) if isinstance(stats, str) else stats
        # Check if stats is a dict
        if not isinstance(stats, dict):
            return None
        return stats

    def create_player_stats_instance(self, stats):
        if not stats:
            return None
        player_stats_instance = UserMatchStats(
            points_scored=stats.get('points_scored'),
            points_conceded=stats.get('points_conceded', 0),
            rallies=stats.get('rallies', 0),
            time_played=stats.get('time_played', 0),
        )
        player_stats_instance.save()
        return player_stats_instance
    
    def update_player_stats(self, user_stats, player_match_stats, match_duration=0):
        user_stats.points_scored += player_match_stats.points_scored
        user_stats.points_conceded += player_match_stats.points_conceded
        user_stats.rallies += player_match_stats.rallies
        user_stats.time_played += match_duration
        user_stats.games += 1
        user_stats.save()
    
    def get_player_stats(self, player_stats):
        if player_stats:
            return {
                'points_scored': player_stats.points_scored,
                'points_conceded': player_stats.points_conceded,
                'rallies': player_stats.rallies,
                'points_per_rally': player_stats.points_scored / player_stats.rallies if player_stats.rallies > 0 else 'N/A',
            }
        return {
            'points_scored': 0,
            'points_conceded': 0,
            'rallies': 0,
            'points_per_rally': 'N/A',
        }

