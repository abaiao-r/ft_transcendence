from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from chat.models import UserSetting
from datetime import timedelta
from django.utils.timezone import now
from unittest.mock import patch


class TestEndpoints(TestCase):
    def setUp(self):
        self.client = Client()
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')  # Creating UserSetting object
        self.client.force_login(self.user)

    def test_signup_view(self):
        response = self.client.post(reverse('signup_view'), {'email': 'test@example.com', 'username': 'testuser', 'password': '12345'})
        self.assertEqual(response.status_code, 302)  # Assuming successful signup redirects to homepage
        self.assertTrue(User.objects.filter(username='test@example.com').exists())
        print("Test signup view passed")

    def test_login_view(self):
        response = self.client.post(reverse('login_view'), {'email': 'testuser', 'password': '12345'})
        self.assertEqual(response.status_code, 302)  # Assuming successful login redirects to homepage
        print("Test login view passed")

    def test_settings_view_get(self):
        response = self.client.get(reverse('settings_view'))
        self.assertEqual(response.status_code, 200)
        print("Test settings view passed")

    def test_settings_view_post(self):
        response = self.client.post(reverse('settings_view'), {'username': 'newusername'})
        self.assertEqual(response.status_code, 200)  # Assuming settings are updated successfully
        print("Test settings view passed")

    @patch('requests.post')
    @patch('requests.get')
    def test_oauth_callback(self, mock_get, mock_post):
        mock_post.return_value.json.return_value = {'access_token': 'mock_token'}
        mock_get.return_value.json.return_value = {'login': 'testuser', 'email': 'test@example.com', 'image': {'versions': {'small': 'image_url'}}}
        response = self.client.get(reverse('oauth_callback'), {'code': 'test_code'})
        self.assertEqual(response.status_code, 302)  # Assuming successful oauth redirects to homepage
        self.assertTrue(User.objects.filter(username='test@example.com').exists())
        print("Test oauth callback passed")

    def test_add_friend(self):
        friend_user = User.objects.create_user(username='friend', password='12345')
        friend_user_setting = UserSetting.objects.create(user=friend_user, username='friend')  # Creating UserSetting object
        self.user_setting.friends.add(friend_user_setting)  # Adding friend_user directly to the friends field
        response = self.client.post(reverse('add_friend'), {'friend_username': 'friend'})
        self.assertEqual(response.status_code, 200)  # Assuming friend added successfully
        print("Test add friend passed")

    #def test_list_friends(self):
    #    friend_user = User.objects.create_user(username='friend', password='12345')
    #    friend_user_setting = UserSetting.objects.create(user=friend_user, username='friend')  # Creating UserSetting object
    #    self.user_setting.friends.add(friend_user_setting)  # Adding friend_user directly to the friends field
    #    response = self.client.get(reverse('list_friends'))
    #    self.assertEqual(response.status_code, 200)
    #    print("Test list friends passed")
