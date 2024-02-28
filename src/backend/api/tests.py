from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from chat.models import UserSetting
from datetime import timedelta
from django.utils.timezone import now
from unittest.mock import patch
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.authtoken.models import Token


class ApiTester(TestCase):
    def setUp(self):
        self.client = Client()

    def test_token_obtain(self):
        # Create user
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.user.is_active, 1, "User is not active")

    def test_token_refresh(self):
        # Create user
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        
        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        self.assertTrue(response.json()['access'])
        self.refresh_token = response.json()['refresh']
        
        # Refresh token
        response = self.client.post(reverse('token_refresh'), {'refresh': str(self.refresh_token)})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['access'])

    def test_signup_view(self):
        response = self.client.post(reverse('signup_view'), {'email': 'test@example.com', 'username': 'testuser', 'password': '12345'})
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(User.objects.filter(username='testuser').exists())
        self.assertTrue(response.json()['message'] == 'Signup successful')
        self.assertTrue(response.json()['access'])
        self.assertTrue(response.json()['refresh'])

    def test_settings_view_get(self):
        # Create user
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        
        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        self.assertTrue(response.json()['access'])
        self.access_token = response.json()['access']
        
        response = self.client.get(reverse('settings_view'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        #print("Response: ", response)
        #print("Content: ", response.content)
        self.assertEqual(response.status_code, 200)

    def test_settings_view_post(self):
        # Create user
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        
        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        self.assertTrue(response.json()['access'])
        self.access_token = response.json()['access']
        
        response = self.client.post(reverse('settings_view'), {'username': 'newusername'}, HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        #print("Response: ", response.content)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(UserSetting.objects.filter(username='newusername').exists())
        self.assertTrue(UserSetting.objects.filter(username='testuser').exists() == False)


    def test_login_view(self):
        # Create user
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        
        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        self.assertTrue(response.json()['access'])
        self.access_token = response.json()['access']

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
        self.user = User.objects.create_user(username='testuser', password='12345')
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        
        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        self.assertTrue(response.json()['access'])
        self.access_token = response.json()['access']

        # Logout
        response = self.client.post(reverse('logout_view'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        #print("Response LOGOUT: ", response.content)
        self.assertTrue(response.status_code, 200)
        self.assertTrue(response.json()['message'] == 'Logout successful')

        # check if user is logged out
        response = self.client.get(reverse('settings_view'), HTTP_AUTHORIZATION='Bearer ' + self.access_token)
        self.assertEqual(response.status_code, 401)
