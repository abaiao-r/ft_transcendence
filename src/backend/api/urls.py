from django.urls import path
from django.contrib.auth.views import LogoutView
from .views import CustomLoginView
from .views import register_view, profile_view, oauth_login, oauth_callback, update_profile
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(next_page='/api/login'), name='logout'),
    path('register/', register_view, name='register'),
    path('profile/', profile_view, name='profile'),
    path('update_profile/', update_profile, name='update_profile'),
    path('oauth/login/', oauth_login, name='oauth_login'),
    path('oauth/callback/', oauth_callback, name='oauth_callback'),
    path('add_friend/', views.add_friend, name='add_friend'),
    path('list_friends/', views.list_friends, name='list_friends'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
