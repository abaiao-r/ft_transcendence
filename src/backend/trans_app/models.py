from concurrent.futures import thread
from trans_app.managers import ThreadManager
from django.db import models
from django.contrib.auth.models import User
#from django_otp.plugins.otp_totp.models import TOTPDevice
import os, uuid


# Create your models here.
def random_file_name(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return os.path.join('profile-pics', filename)

class UserSetting(models.Model):
    user = models.OneToOneField(User, null=True, on_delete=models.CASCADE)
    username = models.CharField(max_length=100, default="")
    name = models.CharField(max_length=100, default="NoobMaster69")
    surname = models.CharField(max_length=100, default="NoobMaster69")
    profile_image = models.ImageField(upload_to=random_file_name, blank=True, null=True, default='\\profile-pics\\default.png')
    is_online = models.BooleanField(default=False)
    last_online = models.DateTimeField(null=True, blank=True)
    friends = models.ManyToManyField('self', blank=True, symmetrical=True)
    type_of_2fa = models.CharField(max_length=30, blank=True, null=True)
    phone = models.CharField(max_length=15, default="", blank=True, null=True)
    google_authenticator_secret_key = models.CharField(max_length=64, default="", blank=True, null=True)

    def __str__(self):
        return str(self.user)


class TrackingModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Match(TrackingModel):
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player1')
    player2 = models.CharField(max_length=255, blank=True, null=True)
    player3 = models.CharField(max_length=255, blank=True, null=True)
    player4 = models.CharField(max_length=255, blank=True, null=True)
    winner = models.CharField(max_length=255, blank=True, null=True)
    player1_stats = models.ForeignKey('UserMatchStats', on_delete=models.CASCADE, related_name='player1_stats', blank=True, null=True)
    player2_stats = models.ForeignKey('UserMatchStats', on_delete=models.CASCADE, related_name='player2_stats', blank=True, null=True)
    player3_stats = models.ForeignKey('UserMatchStats', on_delete=models.CASCADE, related_name='player3_stats', blank=True, null=True)
    player4_stats = models.ForeignKey('UserMatchStats', on_delete=models.CASCADE, related_name='player4_stats', blank=True, null=True)
    match_date = models.DateTimeField(auto_now_add=True)
    match_type = models.CharField(max_length=10, default="normal")
    match_duration = models.IntegerField(default=0) # seconds
    

    def __str__(self):
        return f'{self.player1} vs {self.player2} with scores {self.player1_stats.points_scored} - {self.player2_stats.points_scored}'

"""
Stats model for following user stats
- Points Scored
- Points Conceded
- Rallies
- Time Played
- Rallies Per Point
- Form
- Wins
- Losses
- Games
- Win rate (%)
- Tournaments Won
"""
class UserStats(TrackingModel):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    points_scored = models.IntegerField(default=0)
    points_conceded = models.IntegerField(default=0)
    rallies = models.IntegerField(default=0)
    time_played = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    games = models.IntegerField(default=0)
    tournaments_won = models.IntegerField(default=0)

    def get_ranking(self):
        # Get all UserStats objects, ordered by wins in descending order
        all_stats = UserStats.objects.order_by('-wins')

        # Find the index of the current UserStats object in the ordered list
        ranking = 1 + list(all_stats).index(self)

        return ranking

    def __str__(self):
        return f'{self.user.username} stats'
    
# User stats in a single match
class UserMatchStats(models.Model):
    id = models.AutoField(primary_key=True)
    user_name = models.CharField(max_length=255, blank=True, null=True)
    points_scored = models.IntegerField(default=0)
    points_conceded = models.IntegerField(default=0)
    rallies = models.IntegerField(default=0)
    time_played = models.IntegerField(default=0)
    win = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user_name} stats'
