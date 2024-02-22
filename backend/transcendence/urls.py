
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from chat import views as chat_views
from api import views as api_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', chat_views.index, name='index'),
    path('<int:id>', chat_views.index, name='index'),
    path('login/', api_views.login_view, name='login_view'),
    path('signup/', api_views.signup_view, name='signup_view'),
    path('settings/', api_views.settings_view, name='settings_view'),

    path('online-friends/', chat_views.api_online_friends, name='online-friends'),
    path('online-friends/<int:id>', chat_views.api_online_friends, name='online-friends'),
    path('online-users/', chat_views.api_online_users, name='online-users'),
    path('online-users/<int:id>', chat_views.api_online_users, name='online-users'),
    path('chat-messages/<int:id>', chat_views.api_chat_messages, name='chat_messages'),
    path('unread/', chat_views.api_unread, name='api_unread'),
    path('add_friend/', api_views.add_friend, name='add_friend'),
    path('list_friends/', api_views.list_friends, name='list_friends'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


