"""transcendence URL Configuration
The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
"""
from django.urls import path, include
from django.contrib import admin  # Import the admin module
from .views import home_view
from .views import login_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view, name='home'),  # Adiciona a URL para a página inicial.
    path('api/', include('api.urls')),  # Inclui as URLs da app 'api'.
]