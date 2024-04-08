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
    username = models.CharField(max_length=32, default="")
    name = models.CharField(max_length=32, default="NoobMaster69")
    surname = models.CharField(max_length=32, default="NoobMaster69")
    profile_image = models.ImageField(upload_to=random_file_name, blank=True, null=True, default='\\profile-pics\\default.png')
    is_online = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', blank=True, symmetrical=True)
    number_of_matches = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    elo = models.IntegerField(default=1000)
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

class Thread(TrackingModel):
    name = models.CharField(max_length=50, null=True, blank=True)
    users = models.ManyToManyField('auth.User')
    unread_by_1 = models.PositiveIntegerField(default=0)
    unread_by_2 = models.PositiveIntegerField(default=0)

    objects = ThreadManager()


    def __str__(self):
        return f'{self.name} \t -> \t {self.users.first()} - {self.users.last()}'



class Message(TrackingModel):
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE)
    sender = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    text = models.TextField(blank=False, null=False)
    isread = models.BooleanField(default=False)
    
    
    def __str__(self):
        return f'From Thread - {self.thread.name}'
    
class Match(TrackingModel):
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player1')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player2')
    player3 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player3', blank=True, null=True)
    player4 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player4', blank=True, null=True)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='winner')
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    player3_score = models.IntegerField(default=0)
    player4_score = models.IntegerField(default=0)
    match_date = models.DateTimeField(auto_now_add=True)
    match_type = models.CharField(max_length=10, default="normal")

    def __str__(self):
        return f'Match between {self.player1} and {self.player2} with score {self.player1_score} - {self.player2_score}'
