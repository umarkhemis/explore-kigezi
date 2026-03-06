
from django.urls import path
from . import views

urlpatterns = [
    path('initiate/', views.initiate_payment, name='initiate_payment'),
    path('verify/', views.verify_payment_view, name='verify_payment'),
    path('webhook/', views.flutterwave_webhook, name='flutterwave_webhook'),
]