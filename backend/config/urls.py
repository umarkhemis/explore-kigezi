"""
Explore Kigezi - Main URL Configuration
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # API Routes
    path('api/auth/', include('apps.accounts.urls')), 
    path('api/experiences/', include('apps.experiences.urls')), 
    path('api/bookings/', include('apps.bookings.urls')), 
    path('api/reviews/', include('apps.reviews.urls')), 
    path('api/payments/', include('apps.payments.urls')), 
    path('api/hosts/', include('apps.accounts.host_urls')), 
    path('api/admin/', include('apps.accounts.admin_urls')), 
]

# Customize admin site
admin.site.site_header = "Explore Kigezi Admin"
admin.site.site_title = "Explore Kigezi"
admin.site.index_title = "Platform Administration"
