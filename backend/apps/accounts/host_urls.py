

from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.host_register, name='host_register'),
    path('dashboard/', views.host_dashboard, name='host_dashboard'),
    path('earnings/', views.host_earnings, name='host_earnings'),
    path('<int:host_id>/profile/', views.host_public_profile, name='host_public_profile'),
]