from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from trans_app.models import Match, UserSetting, UserStats, UserMatchStats
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.timezone import now
import json
import ast
from datetime import date

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
        print(json.dumps(data, indent=4))
        #player1 = User.objects.filter(username=data[1].get("Avatar")).first()
        #if not player1:
            #return Response({'error': 'Player1 not found'}, status=400)

        def get_username_and_stats(data, index):
            if index < len(data):
                username = data[index].get("Name")
                stats = [data[index].get("Side"), data[index].get("Score"), data[index].get("Bounces"), data[0].get("Match Time")]
            else:
                username = None
                stats = [None, None, None, None]
            return username, stats

        player1_username, player1_stats = get_username_and_stats(data, 1)
        player2_username, player2_stats = get_username_and_stats(data, 2)
        player3_username, player3_stats = get_username_and_stats(data, 3)
        player4_username, player4_stats = get_username_and_stats(data, 4)

        winner_username = None
        for username, stats in [(player1_username, player1_stats), (player2_username, player2_stats), 
                                (player3_username, player3_stats), (player4_username, player4_stats)]:
            if stats[1] == 10:
                winner_username = username
                break


        match_date = date.today()
        if (data[0].get("Tournament") == "Yes"):
            match_type = "Tournament" 
        else:
            match_type = data[0].get("Game Type")
        match_duration = data[0].get("Match Time")
        if (data[0].get("Round")) == "Final":
            tournament_final = True
        else:
            tournament_final = False

        print("player1 stats: ", player1_stats)
        print("player2 stats: ", player2_stats)
        print("player3 stats: ", player3_stats)
        print("player4 stats: ", player4_stats)

        # check if player 1 and 2 are not empty
        #if not player2_username:
            #return Response({'error': 'Player2 is required'}, status=400)
        
        players = [player1_username, player2_username, player3_username, player4_username]
        # Remove empty players
        players = [player for player in players if player]

        print("Player usernames: ",players)

        # Validate and convert stats
        player_stats = [player1_stats, player2_stats, player3_stats, player4_stats]
        player_stats = [self.validate_and_convert_stats(player_stat) for player_stat in player_stats if player_stat and any(player_stat)]

        print("Player stats: ", player_stats)

        # Check for valid scores
        if any([not player_stat for player_stat in player_stats]):
            print("Error1")
            return Response({'error': 'Invalid stats'}, status=400)
        
        scores = [stat[1] for stat in player_stats]
        # check if integer and >= 0
        if not all([isinstance(score, int) and score >= 0 for score in scores]):
            print("Error2")
            return Response({'error': 'Invalid score'}, status=400)
        print("Match saved successfully:0 ")

        # Check for valid match type
        if match_type not in ['Simple', 'Tournament']:
            print("Error3")
            return Response({'error': 'Invalid match type'}, status=400)
                
        player1_stats = self.validate_and_convert_stats(player1_stats)
        player2_stats = self.validate_and_convert_stats(player2_stats)
        points_conceeded = 0
        points_conceeded += player2_stats[1]
        if len(player_stats) == 4:
            player3_stats = self.validate_and_convert_stats(player3_stats)
            player4_stats = self.validate_and_convert_stats(player4_stats)
            points_conceeded += player3_stats[1]
            points_conceeded += player4_stats[1]
        
        player1_stats_instance = self.create_player_stats_instance(player1_stats, player1_username, points_conceeded)
        player2_stats_instance = self.create_player_stats_instance(player2_stats, player2_username, points_conceeded)
        
        if len(player_stats) == 4:
            player3_stats_instance = self.create_player_stats_instance(player3_stats, player3_username, points_conceeded)
            player4_stats_instance = self.create_player_stats_instance(player4_stats, player4_username, points_conceeded)
            
        print("Player1 username: ", player1_username)
        print("Player2 username: ", player2_username)

        # Fetch the User instances for player1(always USER) and player2
        try:
            player1 = User.objects.get(username=player1_username)
        except User.DoesNotExist:
            return Response({'error': 'User with username {} does not exist'.format(player1_username)}, status=404)
        player2 = player2_username

        # Initialize the Match object with player1 and player2
        match = Match(
            player1=player1,
            player2=player2,
            winner=winner_username,
            player1_stats=player1_stats_instance,
            player2_stats=player2_stats_instance,
            match_date=match_date,
            match_type=match_type,
            match_duration=match_duration,
        )

        # If there are 4 players, fetch the User instances for player3 and player4 and update the Match object
        if len(player_stats) == 4:
            player3 = player3_username
            player4 = player4_username
            match.player3 = player3
            match.player4 = player4
            match.player3_stats = player3_stats_instance
            match.player4_stats = player4_stats_instance

        # Save the Match object
        match.save()

        print("Match saved successfully: ", match)

        if len(player_stats) == 2:
            player_stats_instances = [player1_stats_instance, player2_stats_instance]
        else:
            player_stats_instances = [player1_stats_instance, player2_stats_instance, player3_stats_instance, player4_stats_instance]

        print("Player stats instances: ", player_stats_instances)
        self.update_user_stats_and_settings(player1, player1_stats_instance, winner_username, match_duration, tournament_final)
        
        return Response({'message': 'Match saved successfully'})
    
    def validate_and_convert_stats(self, stats):
        # Check if stats is a string
        stats = ast.literal_eval(stats) if isinstance(stats, str) else stats
        # Check if stats is a dict
        if not isinstance(stats, list):
            return None
        return stats

    def create_player_stats_instance(self, stats, username, pts_conceded):
        if not stats:
            print("Stats is empty")
            return None
        if stats[1] == 10:
            win_temp = True
        else:
            win_temp = False
        player_stats_instance = UserMatchStats(
            user_name= username,
            points_scored=stats[1],
            points_conceded=pts_conceded,
            rallies=stats[2],
            time_played=stats[3],
            win = win_temp
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
                'rallies_per_point': player_stats.rallies / (player_stats.points_scored + player_stats.points_conceded) if player_stats.points_scored > 0 else 'N/A',
            }
        return {
            'points_scored': 0,
            'points_conceded': 0,
            'rallies': 0,
            'points_per_rally': 'N/A',
        }

    def update_user_stats_and_settings(self, player, player_stats_instance, winner_username, match_duration, tournament_final):
        user_stats, created = UserStats.objects.get_or_create(user=player)
        if winner_username == player.username:
            user_stats.wins += 1
            if tournament_final:
                user_stats.tournaments_won += 1
        else:
            user_stats.losses += 1
        self.update_player_stats(user_stats, player_stats_instance, match_duration)        
        user_stats.save()
        #method to print user stats variables
        print("User Stats: ", user_stats, "Points Scored: ", user_stats.points_scored, "Rallies: ", user_stats.rallies, "Time Played: ", user_stats.time_played, "Wins: ", user_stats.wins, "Losses: ", user_stats.losses, "Games: ", user_stats.games, "Tournaments Won: ", user_stats.tournaments_won)
