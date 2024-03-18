from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.models import User
from chat.models import UserSetting
from datetime import timedelta
from django.utils.timezone import now
from unittest.mock import patch
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
import base64
import xml.etree.ElementTree as ET
import io
import cairosvg


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
        
        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': '12345'})
        #print("Response: ", response.content)
        self.assertTrue(response.status_code, 200)
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
        password = '12345'
        self.user = User.objects.create_user(username='testuser', password=password)
        self.user_setting = UserSetting.objects.create(user=self.user, username='testuser')
        
        # Get access token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'testuser', 'password': password})
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