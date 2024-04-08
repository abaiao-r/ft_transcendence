from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from trans_app.models import Message, UserSetting, Thread
from datetime import datetime, timedelta
import random
import json
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from trans_app.models import Match
from trans_app.models import UserSetting
from django.utils.timezone import now
import xml.etree.ElementTree as ET
import cairosvg

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
        self.refresh_token = response.json()['refresh']

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

class ApiTester(TestCase):
    def setUp(self):
        self.client = Client()

    def test_token_obtain(self):
        # Create user
        password = '12345'
        self.user = User.objects.create_user(username='testuser', password=password)
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': password})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.user.is_active, 1, "User is not active")

    def test_token_refresh(self):
        # Create user
        password = '12345'
        self.user = User.objects.create_user(username='testuser', password=password)
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        
        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': password})
        self.assertTrue(response.json()['access'])
        self.refresh_token = response.json()['refresh']
        
        # Refresh token
        response = self.client.post(reverse('token_refresh'), {'refresh': str(self.refresh_token)})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['access'])

    def test_signup_view(self):
        response = self.client.post(reverse('signup_view'), {'email': 'test@example.com', 'username': 'testuser', 'password': '12345', 'type_of_2fa': 'none'})
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(username='testuser').exists())
        self.assertTrue(response.json()['message'] == 'Signup successful')
        self.assertTrue(response.json()['access'])
        self.assertTrue(response.json()['refresh'])

    def test_settings_view_get(self):
        # Create user
        password = '12345'
        self.user = User.objects.create_user(username='testuser', password=password)
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        
        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': password})
        self.assertTrue(response.json()['access'])
        self.access_token = response.json()['access']
        
        response = self.client.get(reverse('settings_view'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        #print("Response: ", response)
        #print("Content: ", response.content)
        self.assertEqual(response.status_code, 200)

    def test_settings_view_post(self):
        # Create user
        password = '12345'
        self.user = User.objects.create_user(username='testuser', password=password)
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        
        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': password})
        self.assertTrue(response.json()['access'])
        self.access_token = response.json()['access']
        
        response = self.client.post(reverse('settings_view'), {'username': 'newusername'}, HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        #print("Response: ", response.content)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(UserSetting.objects.filter(username='newusername').exists())
        self.assertTrue(UserSetting.objects.filter(username='testuser').exists() == False)


    def test_login_view(self):
        # Create user
        password = '12345'
        self.user = User.objects.create_user(username='testuser', password=password)
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')

        # Login
        response = self.client.post(reverse('login_view'), {'username': 'testuser', 'password': '12345'})
        #print("Response LOGIN: ", response.content)
        self.assertTrue(response.status_code, 200)
        self.assertTrue(response.json()['message'] == 'Login successful')
        self.assertTrue(response.json()['access'])
        self.assertTrue(response.json()['refresh'])

        # check if user is logged in
        self.access_token = response.json()['access']
        response = self.client.get(reverse('settings_view'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.status_code, 200)
        
    def test_logout_view(self):
        # Create user
        password = '12345'
        self.user = User.objects.create_user(username='testuser', password=password)
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        
        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': password})
        self.assertTrue(response.json()['access'])
        self.access_token = response.json()['access']
        self.refresh_token = response.json()['refresh']

        # Logout
        response = self.client.post(reverse('logout_view'), HTTP_AUTHORIZATION='Bearer ' + self.access_token,
                                    HTTP_REFRESH_TOKEN='Bearer ' + self.refresh_token)
        self.assertTrue(response.status_code, 200)
        self.assertTrue(response.json()['message'] == 'Logout successful')

        # check if user is logged out
        response = self.client.get(reverse('settings_view'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.status_code, 401)


class TwoFactorTester(TestCase):
    def setUp(self):
        self.client = Client()
        # Create user
        password = '12345'
        self.user = User.objects.create_user(username='testuser', password=password)
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        
    def save_qr_code(self, encoded_qr_code):
        # Parse the SVG image string
        root = ET.fromstring(encoded_qr_code)

        # Extract the SVG data from the root element
        svg_data = ET.tostring(root).decode()

        # Convert SVG data to PNG binary data
        png_data = cairosvg.svg2png(bytestring=svg_data)

        # Save the PNG data to a file
        with open("google_qrcode.png", "wb") as f:
            f.write(png_data)

    def test_2FA_activation_type_invalid(self):
        self.user_setting.type_of_2fa = 'google_authenticator'
        self.user_setting.save()

        response = self.client.post(reverse('2fa_activation'), {'type_of_2fa': 'invalid', 'user_id': self.user.id})
        #print("Response 2FA: ", response.content)
        self.assertTrue(response.status_code, 400)
        self.assertTrue(response.json()['error'] == 'Failed to activate two-factor authentication')

    def test_2FA_activation_user_not_found(self):
        response = self.client.post(reverse('2fa_activation'), {'type_of_2fa': 'email', 'user_id': 100})
        #print("Response 2FA: ", response.content)
        self.assertTrue(response.status_code, 400)
        self.assertTrue(response.json()['error'] == 'User not found')

    def test_2FA_activation_turned_off(self):
        self.user_setting.type_of_2fa = 'none'
        self.user_setting.save()

        response = self.client.post(reverse('2fa_activation'), {'type_of_2fa': 'email', 'user_id': self.user.id})
        #print("Response 2FA: ", response.content)
        self.assertTrue(response.status_code, 400)
        self.assertTrue(response.json()['error'] == '2FA is turned off for this user')

    """ def test_2FA_verification_google_authenticator_success(self):
            self.user_setting.type_of_2fa = 'google_authenticator'
            self.user_setting.save()

            # Activate 2FA
            response = self.client.post(reverse('2fa_activation'), {'type_of_2fa': 'google_authenticator', 'user_id': self.user.id})
            print("Response 2FA: ", response.content)
            
            self.save_qr_code(response.json()['qr_code'])

            verification_code = input("Enter the verification code: ")

            response = self.client.post(reverse('2fa_verification'), {'type_of_2fa': 'google_authenticator', 'user_id': self.user.id, 'verification_code': verification_code})
            print("Response 2FA: ", response.content)
            self.assertTrue(response.status_code, 200)
            self.assertTrue(response.json()['message'] == 'Two-factor authentication verified successfully')
    """
    def test_2FA_verification_google_authenticator_failure(self):
        self.user_setting.type_of_2fa = 'google_authenticator'
        self.user_setting.save()

        # Activate 2FA
        response = self.client.post(reverse('2fa_activation'), {'type_of_2fa': 'google_authenticator', 'user_id': self.user.id})
        #print("Response 2FA: ", response.content)
        
        self.save_qr_code(response.json()['qr_code'])

        response = self.client.post(reverse('2fa_verification'), {'type_of_2fa': 'google_authenticator', 'user_id': self.user.id, 'verification_code': '123456'})
        #print("Response 2FA: ", response.content)
        self.assertTrue(response.status_code, 400)
        self.assertTrue(response.json()['error'] == 'Failed to verify two-factor authentication')


class MatchTester(TestCase):

    def setUp(self):
        self.client = Client()
        # Create user
        password = '12345'
        self.user1 = User.objects.create_user(username='testuser1', password=password)
        self.user2 = User.objects.create_user(username='testuser2', password=password)
        self.user3 = User.objects.create_user(username='testuser3', password=password)
        self.user4 = User.objects.create_user(username='testuser4', password=password)
        self.user_setting1 = UserSetting.objects.create(user=self.user1, username='testuser1')
        self.user_setting2 = UserSetting.objects.create(user=self.user2, username='testuser2')
        self.user_setting3 = UserSetting.objects.create(user=self.user3, username='testuser3')
        self.user_setting4 = UserSetting.objects.create(user=self.user4, username='testuser4')

        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser1', 'password': password})
        self.assertTrue(response.json()['access'])
        self.access_token1 = response.json()['access']

    def test_get_player_match_history(self):
        # Create new match between user1 and user2
        new_match1 = Match.objects.create(player1=self.user1, player2=self.user2, winner=self.user1, player1_score=2, player2_score=1, match_date=now(), match_type='ranked')
        new_match2 = Match.objects.create(player1=self.user1, player2=self.user2, winner=self.user1, player1_score=2, player2_score=1, match_date=now(), match_type='ranked')

        response = self.client.get(reverse('match-history'), HTTP_AUTHORIZATION='Bearer ' + self.access_token1)

        #print("Response: ", response.content)
        self.assertEqual(response.status_code, 200)

        self.assertTrue(len(response.json()) == 2)

        match_1 = response.json()[0]
        player1 = match_1['player1']
        player2 = match_1['player2']
        winner = match_1['winner']
        player1_score = match_1['player1_score']
        player2_score = match_1['player2_score']
        match_date = match_1['match_date']
        match_type = match_1['match_type']

        self.assertTrue(player1 == 'testuser1')
        self.assertTrue(player2 == 'testuser2')
        self.assertTrue(winner == 'testuser1')
        self.assertTrue(player1_score == 2)
        self.assertTrue(player2_score == 1)
        self.assertTrue(match_type == 'ranked')

    def test_get_player_match_history_empty(self):
        response = self.client.get(reverse('match-history'), HTTP_AUTHORIZATION='Bearer ' + self.access_token1)

        #print("Response: ", response.content)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(len(response.json()) == 0)

    def test_post_valid_player_match_two_players(self):
        response = self.client.post(reverse('match-history'), {'player1': self.user1, 'player2': self.user2, 'winner': self.user1, 'player1_score': 2, 'player2_score': 1, 'match_type': 'ranked', 'match_date': now()}, HTTP_AUTHORIZATION='Bearer ' + self.access_token1)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['message'] == 'Match saved successfully')
        self.assertTrue(Match.objects.filter(player1=self.user1, player2=self.user2, winner=self.user1, player1_score=2, player2_score=1, match_type='ranked').exists())

        # check for updated statistics
        self.assertTrue(UserSetting.objects.get(username='testuser1').wins == 1)
        self.assertTrue(UserSetting.objects.get(username='testuser1').losses == 0)
        self.assertTrue(UserSetting.objects.get(username='testuser2').wins == 0)
        self.assertTrue(UserSetting.objects.get(username='testuser2').losses == 1)

    def test_post_valid_player_match_three_players(self):
        response = self.client.post(reverse('match-history'), {'player1': self.user1, 'player2': self.user2, 'player3': self.user3, 'winner': self.user1, 'player1_score': 2, 'player2_score': 1, 'player3_score': 0, 'match_type': 'ranked', 'match_date': now()}, HTTP_AUTHORIZATION='Bearer ' + self.access_token1)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['message'] == 'Match saved successfully')
        self.assertTrue(Match.objects.filter(player1=self.user1, player2=self.user2, player3=self.user3, winner=self.user1, player1_score=2, player2_score=1, player3_score=0, match_type='ranked').exists())

        # check for updated statistics
        self.assertTrue(UserSetting.objects.get(username='testuser1').wins == 1)
        self.assertTrue(UserSetting.objects.get(username='testuser1').losses == 0)
        self.assertTrue(UserSetting.objects.get(username='testuser2').wins == 0)
        self.assertTrue(UserSetting.objects.get(username='testuser2').losses == 1)
        self.assertTrue(UserSetting.objects.get(username='testuser3').wins == 0)
        self.assertTrue(UserSetting.objects.get(username='testuser3').losses == 1)

    def test_post_valid_player_match_four_players(self):
        response = self.client.post(reverse('match-history'), {'player1': self.user1, 'player2': self.user2, 'player3': self.user3, 'player4': self.user4, 'winner': self.user1, 'player1_score': 2, 'player2_score': 1, 'player3_score': 0, 'player4_score': 0, 'match_type': 'ranked', 'match_date': now()}, HTTP_AUTHORIZATION='Bearer ' + self.access_token1)

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['message'] == 'Match saved successfully')
        self.assertTrue(Match.objects.filter(player1=self.user1, player2=self.user2, player3=self.user3, player4=self.user4, winner=self.user1, player1_score=2, player2_score=1, player3_score=0, player4_score=0, match_type='ranked').exists())

        # check for updated statistics
        self.assertTrue(UserSetting.objects.get(username='testuser1').wins == 1)
        self.assertTrue(UserSetting.objects.get(username='testuser1').losses == 0)
        self.assertTrue(UserSetting.objects.get(username='testuser2').wins == 0)
        self.assertTrue(UserSetting.objects.get(username='testuser2').losses == 1)
        self.assertTrue(UserSetting.objects.get(username='testuser3').wins == 0)
        self.assertTrue(UserSetting.objects.get(username='testuser3').losses == 1)
        self.assertTrue(UserSetting.objects.get(username='testuser4').wins == 0)
        self.assertTrue(UserSetting.objects.get(username='testuser4').losses == 1)