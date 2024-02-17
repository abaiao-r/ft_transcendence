from django.urls import path
from django.contrib.auth.views import LogoutView
from .views import CustomLoginView
from .views import register_view, profile_view, oauth_login, oauth_callback, update_profile

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='/api/login'), name='logout'),
    path('register/', register_view, name='register'),
    path('profile/', profile_view, name='profile'),
    path('update_profile/', update_profile, name='update_profile'),
    path('oauth/login/', oauth_login, name='oauth_login'),
    path('oauth/callback/', oauth_callback, name='oauth_callback'),
]
