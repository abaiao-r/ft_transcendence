from django.urls import path
from .views import register_view
from .views import CustomLoginView
from .views import profile_view
from .views import oauth_login
from .views import oauth_callback

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', CustomLoginView.as_view(), name='login'),
    path('profile/', profile_view, name='profile'),
    path('oauth/login/', oauth_login, name='oauth_login'),
    path('oauth/callback/', oauth_callback, name='oauth_callback'),
]
