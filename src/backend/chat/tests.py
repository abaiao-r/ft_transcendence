from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from chat.models import Message, UserSetting, Thread
from datetime import datetime, timedelta
import random
import json

class ChatTesterSmokeHappyPath(TestCase):
    def setUp(self):
        # Create user
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.user.is_active, 1, "User is not active")

        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        self.assertTrue(response.json()['access'])
        self.access_token = response.json()['access']

    # auxiliary function to add friend
    def create_and_add_friend(self, friend_username):
        # create friend user
        friend = User.objects.create_user(username=friend_username, password='12345')
        friend_setting = UserSetting.objects.create(user=friend)

        # add friend to user's friends
        self.user_setting.friends.add(friend_setting)
        
        return friend, friend_setting
    
    """ def test_add_friend(self):
        friend_user = User.objects.create_user(username='friend', password='12345')
        UserSetting.objects.create(user=friend_user, username='friend')  # Creating UserSetting object
        
        response = self.client.post(reverse('add_friend'), {'friend_username': 'friend'})
        self.assertEqual(response.status_code, 200)  # Assuming friend added successfully
    """
    def test_smoke_online_users(self):
        response = self.client.get(reverse('online-users'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.status_code, 200)

    def test_smoke_online_users_with_id(self):
        friend_data = self.create_and_add_friend('friend')
        added_friend, added_friend_setting = friend_data[0], friend_data[1]

        friend_id = added_friend_setting.id

        response = self.client.get(reverse('online-users', args=[friend_id]), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.status_code, 200)

    def test_smoke_online_friends(self):
        response = self.client.get(reverse('online-friends'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.status_code, 200)

    def test_smoke_online_friends_with_id(self):
        #Create friend
        friend_data = self.create_and_add_friend('friend')
        added_friend_setting = friend_data[1]

        friend_id = added_friend_setting.id

        response = self.client.get(reverse('online-friends', args=[friend_id]), HTTP_AUTHORIZATION='Bearer ' + self.access_token)  # Replace 1 with an existing user ID
        self.assertEqual(response.status_code, 200)

    def test_smoke_chat_messages(self):
        response = self.client.get(reverse('chat_messages', args=[1]), HTTP_AUTHORIZATION='Bearer ' + self.access_token)  # Replace 1 with an existing thread ID
        self.assertEqual(response.status_code, 200)

    def test_smoke_unread(self):
        response = self.client.get(reverse('api_unread'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.status_code, 200)
    
    def test_smoke_list_friends(self):
        pass


    """def test_one_online_friend(self):
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

class ChatTesterSmokeNonHappyPath(TestCase):
    def setUp(self):
        # Create user
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')

    # auxiliary function to add friend
    def create_and_add_friend(self, friend_username):
        # create friend user
        friend = User.objects.create_user(username=friend_username, password='12345')
        friend_setting = UserSetting.objects.create(user=friend)

        # add friend to user's friends
        self.user_setting.friends.add(friend_setting)
        
        return friend, friend_setting
    
    """ def test_add_friend(self):
        friend_user = User.objects.create_user(username='friend', password='12345')
        UserSetting.objects.create(user=friend_user, username='friend')  # Creating UserSetting object
        
        response = self.client.post(reverse('add_friend'), {'friend_username': 'friend'})
        self.assertEqual(response.status_code, 200)  # Assuming friend added successfully
    """
    def test_smoke_online_users(self):
        response = self.client.get(reverse('online-users'))
        self.assertEqual(response.status_code, 401)

    def test_smoke_online_users_with_id(self):
        friend_data = self.create_and_add_friend('friend')
        added_friend, added_friend_setting = friend_data[0], friend_data[1]

        friend_id = added_friend_setting.id

        response = self.client.get(reverse('online-users', args=[friend_id]))
        self.assertEqual(response.status_code, 401)

    def test_smoke_online_friends(self):
        response = self.client.get(reverse('online-friends'))
        self.assertEqual(response.status_code, 401)

    def test_smoke_online_friends_with_id(self):
        #Create friend
        friend_data = self.create_and_add_friend('friend')
        added_friend_setting = friend_data[1]

        friend_id = added_friend_setting.id

        response = self.client.get(reverse('online-friends', args=[friend_id]))  # Replace 1 with an existing user ID
        self.assertEqual(response.status_code, 401)

    def test_smoke_chat_messages(self):
        response = self.client.get(reverse('chat_messages', args=[1]))  # Replace 1 with an existing thread ID
        self.assertEqual(response.status_code, 401)

    def test_smoke_unread(self):
        response = self.client.get(reverse('api_unread'))
        self.assertEqual(response.status_code, 401)
    
    def test_smoke_list_friends(self):
        pass


class ChatTesterScenarioHappyPath(TestCase):
    def setUp(self):
        # Create user
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.user.is_active, 1, "User is not active")

        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        self.assertTrue(response.json()['access'])
        self.access_token = response.json()['access']

    # auxiliary function to add friend
    def create_and_add_friend(self, friend_username):
        # create friend user
        friend = User.objects.create_user(username=friend_username, password='12345')
        friend_setting = UserSetting.objects.create(user=friend, username=friend_username)

        # add friend to user's friends
        self.user_setting.friends.add(friend_setting)

        assert friend_setting in self.user_setting.friends.all()
        
        return friend, friend_setting
    
    def test_list_friends(self):
        created_friends = []
        num_friends = random.randint(1, 10)
        for i in range(num_friends):
            friend_data = self.create_and_add_friend(f'friend{i}')
            added_friend_setting = friend_data[1]
            added_friend_setting.save()
            created_friends.append(friend_data)

        response = self.client.get(reverse('list_friends'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), num_friends)

        for friend_data in created_friends:
            friend_setting = friend_data[1]
            friend_id = str(friend_setting.id)
            self.assertTrue(friend_id in response.json())
            friend_json = response.json()[friend_id]
            self.assertTrue(friend_json['username'] in [f'friend{i}' for i in range(num_friends)])

    
    def test_zero_online_friends(self):
        response = self.client.get(reverse('online-friends'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertJSONEqual(response.content, {})

    def test_non_zero_online_friends(self):
        # Create friends
        created_friends = []
        num_friends = random.randint(1, 10)
        for i in range(num_friends):
            friend_data = self.create_and_add_friend(f'friend{i}')
            added_friend_setting = friend_data[1]
            added_friend_setting.is_online = True
            added_friend_setting.save()
            created_friends.append(friend_data)

        response = self.client.get(reverse('online-friends'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(len(response.json()), num_friends)

        # Check if all friends are online
        for friend_data in created_friends:
            friend_setting = friend_data[1]
            friend_id = str(friend_setting.id)
            self.assertTrue(friend_id in response.json())
            friend_json = response.json()[friend_id]
            self.assertTrue(friend_json['username'] in [f'friend{i}' for i in range(num_friends)])
            self.assertTrue(friend_json['is-online'] == True)

    def test_offline_friends(self):
        # Create friends
        created_friends = []
        num_friends = random.randint(1, 10)
        for i in range(num_friends):
            friend_data = self.create_and_add_friend(f'friend{i}')
            added_friend, added_friend_setting = friend_data[0], friend_data[1]
            added_friend_setting.is_online = False
            added_friend_setting.save()
            created_friends.append(friend_data)

        response = self.client.get(reverse('online-friends'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.json(), {})

    def test_add_new_friend(self):
        # Create user
        friend_username = 'friend'
        friend = User.objects.create_user(username=friend_username, password='12345')
        UserSetting.objects.create(user=friend, username=friend_username)

        response = self.client.post(reverse('add_friend'), {'friend_username': friend_username}, HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], f'{friend_username} added successfully as a friend.')
        self.assertTrue(UserSetting.objects.filter(username=friend_username).exists())

    def test_add_existing_friend(self):
        self.create_and_add_friend('friend')
        response = self.client.post(reverse('add_friend'), {'friend_username': 'friend'}, HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'friend is already a friend.')

    def test_add_self_as_friend(self):
        response = self.client.post(reverse('add_friend'), {'friend_username': self.user_setting.username}, HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'You cannot add yourself as a friend.')

    def test_add_non_existing_friend(self):
        response = self.client.post(reverse('add_friend'), {'friend_username': 'friend'}, HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'User not found.')