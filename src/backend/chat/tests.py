from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from chat.models import Message, UserSetting, Thread
from datetime import datetime, timedelta
import random
import json

class ChatTester(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user_setting = UserSetting.objects.create(user=self.user)
        self.client.force_login(self.user)

    # auxiliary function to add friend
    def create_and_add_friend(self, friend_username):
        # create friend user
        friend = User.objects.create_user(username=friend_username, password='12345')
        friend_setting = UserSetting.objects.create(user=friend)

        # add friend to user's friends
        self.user_setting.friends.add(friend_setting)
        
        return friend, friend_setting
    
    def test_add_friend(self):
        friend_user = User.objects.create_user(username='friend', password='12345')
        UserSetting.objects.create(user=friend_user, username='friend')  # Creating UserSetting object
        
        response = self.client.post(reverse('add_friend'), {'friend_username': 'friend'})
        self.assertEqual(response.status_code, 200)  # Assuming friend added successfully

    def test_smoke_online_users(self):
        response = self.client.get(reverse('online-users'))
        self.assertEqual(response.status_code, 200)

    def test_smoke_online_users_with_id(self):
        friend_data = self.create_and_add_friend('friend')
        added_friend, added_friend_setting = friend_data[0], friend_data[1]

        friend_id = added_friend_setting.id

        response = self.client.get(reverse('online-users', args=[friend_id]))
        self.assertEqual(response.status_code, 200)

    def test_smoke_online_friends(self):
        response = self.client.get(reverse('online-friends'))
        self.assertEqual(response.status_code, 200)

    def test_smoke_online_friends_with_id(self):
        response = self.client.get(reverse('online-friends', args=[1]))  # Replace 1 with an existing user ID
        self.assertEqual(response.status_code, 200)

    def test_smoke_chat_messages(self):
        response = self.client.get(reverse('chat_messages', args=[1]))  # Replace 1 with an existing thread ID
        self.assertEqual(response.status_code, 200)

    def test_smoke_unread(self):
        response = self.client.get(reverse('api_unread'))
        self.assertEqual(response.status_code, 200)
    
    def test_smoke_list_friends(self):
        pass

    """ def test_zero_online_friends(self):
        response = self.client.get(reverse('online-friends'))
        self.assertJSONEqual(response.content, [])

    def test_one_online_friend(self):
        friend_data = self.create_and_add_friend('friend')
        added_friend, added_friend_setting = friend_data[0], friend_data[1]
        added_friend_setting.is_online = True
        added_friend_setting.save()

        response = self.client.get(reverse('online-friends'))
        self.assertJSONEqual(response.content, [{'id': added_friend_setting.id, 'username': 'friend'}])

    def test_two_online_friends(self):

        i = 0
        # using math libraries generate random number of friends between 1 and 10
        num_friends = random.randint(1, 10)
        friends = {}
        while i < num_friends:
            friend = User.objects.create_user(username=f'friend{i}', password='12345')
            friend_setting = UserSetting.objects.create(user=friend)
            friend_setting.is_online = True
            self.user_setting.friends.add(friend_setting)
            friends[friend_setting.id] = friend
            i += 1

        response = self.client.get(reverse('online-friends'))
        self.assertJSONEqual(response.content, [{'id': friend.id, 'username': friend_setting.username} for friend_setting, friend in friends.items()]) """

