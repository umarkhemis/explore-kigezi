

from django.urls import path
from . import views

urlpatterns = [
    # Public
    path('', views.experience_list, name='experience_list'),
    path('categories/', views.category_list, name='category_list'),
    path('featured/', views.featured_experiences, name='featured_experiences'),
    path('<int:pk>/', views.experience_detail, name='experience_detail'),
    path('<int:pk>/similar/', views.similar_experiences, name='similar_experiences'),
    # Host
    path('my/', views.host_experience_list_create, name='host_experience_list_create'),
    path('my/<int:pk>/', views.host_experience_detail, name='host_experience_detail'),
    path('my/<int:pk>/images/', views.upload_experience_images, name='upload_experience_images'),
    # Admin
    path('admin/all/', views.admin_experience_list, name='admin_experience_list'),
    path('admin/<int:pk>/approve/', views.admin_approve_experience, name='admin_approve_experience'),
]