

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'get_full_name', 'role', 'phone', 'is_verified', 'is_active', 'created_at']
    list_filter = ['role', 'is_verified', 'is_active']
    search_fields = ['email', 'first_name', 'last_name', 'phone']
    ordering = ['-created_at']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Explore Kigezi', {
            'fields': (
                'role', 'phone', 'bio', 'location', 'is_verified',
                'profile_photo', 'national_id_document',
                'mobile_money_number', 'mobile_money_provider', 'nationality',
            )
        }),
    )