
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt import views as jwt_views
#from two_factor.urls import urlpatterns as tf_urls
from trans_app.views.auth.LoginAPIView import *
from trans_app.views.auth.SignupAPIView import *
from trans_app.views.auth.OAuthLoginAPIView import *
from trans_app.views.auth.OAuthCallbackAPIView import *
from trans_app.views.auth.LogoutAPIView import *
from trans_app.views.auth.ActivateTwoFactorAPIView import *
from trans_app.views.auth.VerifyTwoFactorAPIView import *
from trans_app.views.profile.SettingsAPIView import *
from trans_app.views.profile.UserView import *
from trans_app.views.profile.PlayerMatchHistoryAPIView import *
from trans_app.views.IndexView import *
from trans_app.views.social.AddFriendView import *
from trans_app.views.social.ApiOnlineFriends import *
from trans_app.views.social.ApiOnlineUsers import *
from trans_app.views.social.ApiChatMessages import *
from trans_app.views.social.ApiUnread import *
from trans_app.views.social.ListFriendsView import *
from trans_app.views.social.RemoveFriendView import *
from trans_app.views.profile.UserSearchView import *
from trans_app.views.profile.PlayerStatsAPIView import *
from django.urls import re_path


urlpatterns = [
    path('', IndexView.as_view(), name='index_view'),
    path('admin/', admin.site.urls),
    #path('', chat_views.index, name='index'),
    #path('<int:id>', chat_views.index, name='index'),
    path('api/login/', LoginAPIView.as_view(), name='login_view'),
    path('api/signup/', SignupAPIView.as_view(), name='signup_view'),
    path('settings/', SettingsAPIView.as_view(), name='settings_view'),
    path('oauth/login/', OAuthLoginAPIView.as_view(), name='oauth_login'),
    path('oauth/callback/', OAuthCallbackAPIView.as_view(), name='oauth_callback'),
    path('oauth/callback/*', TemplateView.as_view(template_name='index.html'), name='oauth_callback'),
    path('logout/', LogoutAPIView.as_view(), name='logout_view'),
	path('2fa/activation/', ActivateTwoFactorAPIView.as_view(), name='2fa_activation'),
	path('2fa/verify/', VerifyTwoFactorAPIView.as_view(), name='2fa_verification'),

    path('online-friends/', ApiOnlineFriends.as_view(), name='online-friends'),
    path('online-friends/<int:id>', ApiOnlineFriends.as_view(), name='online-friends'),
    path('getuser/', UserView.as_view(), name='getuser'),
    path('online-users/', ApiOnlineUsers.as_view(), name='online-users'),
    path('online-users/<int:id>', ApiOnlineUsers.as_view(), name='online-users'),
    path('chat-messages/<int:id>', ApiChatMessages.as_view(), name='chat_messages'),
    path('unread/', ApiUnread.as_view(), name='api_unread'),
    path('add_friend/', AddFriendView.as_view(), name='add_friend'),
    path('list_friends/', ListFriendsView.as_view(), name='list_friends'),
	path('remove_friend/', RemoveFriendView.as_view(), name='remove_friend'),
	path('search-users/', UserSearchView.as_view(), name='search_users'),
    
    path('player-stats/', PlayerStatsAPIView.as_view(), name='player-stats'),
    path('match-history/', PlayerMatchHistoryAPIView.as_view(), name='match-history'),
    
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    
    path('login', TemplateView.as_view(template_name='index.html'), name='login'),
    path('signup', TemplateView.as_view(template_name='index.html'), name='signup'),
    path('home', TemplateView.as_view(template_name='index.html'), name='home'),
    path('settings', TemplateView.as_view(template_name='index.html'), name='settings'),
    path('faq', TemplateView.as_view(template_name='index.html'), name='faq'),
    path('friends', TemplateView.as_view(template_name='index.html'), name='friends'),
    path('history', TemplateView.as_view(template_name='index.html'), name='history'),
    path('about', TemplateView.as_view(template_name='index.html'), name='about'),
    path('my-profile', TemplateView.as_view(template_name='index.html'), name='my-profile'),
    #path('list_friends/', api_views.list_friends, name='list_friends'),
    #re_path(r'^.*$', TemplateView.as_view(template_name='index.html'), name='spa'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


