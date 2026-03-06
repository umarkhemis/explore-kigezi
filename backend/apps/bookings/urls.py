

from django.urls import path
from . import views

urlpatterns = [
    # Tourist
    path('', views.create_booking, name='create_booking'),
    path('my/', views.my_bookings, name='my_bookings'),
    path('<int:pk>/', views.booking_detail, name='booking_detail'),
    path('<int:pk>/cancel/', views.cancel_booking, name='cancel_booking'),
    path('reference/<str:reference>/', views.booking_by_reference, name='booking_by_reference'),
    # Host
    path('host/', views.host_bookings, name='host_bookings'),
    path('host/<int:pk>/confirm/', views.confirm_booking, name='confirm_booking'),
    path('host/<int:pk>/complete/', views.complete_booking, name='complete_booking'),
    # Admin
    path('admin/all/', views.admin_all_bookings, name='admin_all_bookings'),
]