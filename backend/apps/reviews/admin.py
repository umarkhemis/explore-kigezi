

from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = [
        'tourist_name', 'experience', 'overall_rating',
        'would_recommend', 'is_verified', 'created_at',
    ]
    list_filter = ['overall_rating', 'would_recommend', 'is_verified']
    search_fields = ['booking__tourist_name', 'experience__title', 'comment']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'host_response_date']