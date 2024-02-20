"""transcendence URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
"""
from django.urls import path, include, re_path
from django.contrib import admin  # Import the admin module
from .views import home_view
from django.views.generic.base import RedirectView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    re_path(r'^$', RedirectView.as_view(url='/api/login', permanent=False)),
    path('admin/', admin.site.urls),
    path('home/', home_view, name='home'),  # Adiciona a URL para a página inicial.
    path('api/', include('api.urls')),  # Inclui as URLs da app 'api'.
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)