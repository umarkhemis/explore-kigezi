

from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_review, name='create_review'),
    path('my/', views.my_reviews, name='my_reviews'),
    path('experience/<int:experience_id>/', views.experience_reviews, name='experience_reviews'),
    path('<int:pk>/respond/', views.respond_to_review, name='respond_to_review'),
    path('<int:pk>/delete/', views.delete_review, name='delete_review'),
]