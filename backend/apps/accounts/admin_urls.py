

from django.urls import path
from . import views

urlpatterns = [
    path('hosts/', views.admin_all_hosts, name='admin_all_hosts'),
    path('hosts/pending/', views.admin_pending_hosts, name='admin_pending_hosts'),
    path('hosts/<int:host_id>/approve/', views.admin_approve_host, name='admin_approve_host'),
    path('hosts/<int:host_id>/reject/', views.admin_reject_host, name='admin_reject_host'),
    path('stats/', views.admin_stats, name='admin_stats'),
]