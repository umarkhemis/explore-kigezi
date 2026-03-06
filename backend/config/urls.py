"""Main URL configuration for Explore Kigezi."""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')), 
    path('api/experiences/', include('apps.experiences.urls')), 
    path('api/bookings/', include('apps.bookings.urls')), 
    path('api/reviews/', include('apps.reviews.urls')), 
    path('api/payments/', include('apps.payments.urls')), 
    path('api/hosts/', include('apps.accounts.host_urls')), 
    path('api/admin-panel/', include('apps.accounts.admin_urls')), 
]

# Admin site customization
admin.site.site_header = 'Explore Kigezi Admin'
admin.site.site_title = 'Explore Kigezi'
admin.site.index_title = 'Platform Administration'




# """Main URL configuration for Explore Kigezi."""
# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static

# urlpatterns = [
#     path('django-admin/', admin.site.urls),
#     path('api/auth/', include('apps.accounts.urls')),
#     path('api/experiences/', include('apps.experiences.urls')),
#     path('api/bookings/', include('apps.bookings.urls')),
#     path('api/reviews/', include('apps.reviews.urls')),
#     path('api/payments/', include('apps.payments.urls')),
#     path('api/hosts/', include('apps.accounts.host_urls')),
#     path('api/admin-panel/', include('apps.accounts.admin_urls')),
# ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# admin.site.site_header = 'Explore Kigezi Admin'
# admin.site.site_title = 'Explore Kigezi'
# admin.site.index_title = 'Platform Administration'