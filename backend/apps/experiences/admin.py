

from django.contrib import admin
from .models import Category, Experience, ExperienceImage


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['icon', 'name', 'slug', 'experience_count']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


class ExperienceImageInline(admin.TabularInline):
    model = ExperienceImage
    extra = 1
    fields = ['image_url', 'caption', 'order']


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'host', 'category', 'district', 'price_per_person',
        'average_rating', 'total_bookings', 'is_active', 'is_approved', 'is_featured',
    ]
    list_filter = ['is_active', 'is_approved', 'is_featured', 'category', 'district']
    search_fields = ['title', 'host__email', 'location']
    list_editable = ['is_active', 'is_approved', 'is_featured']
    ordering = ['-created_at']
    inlines = [ExperienceImageInline]
    actions = ['approve_experiences']

    def approve_experiences(self, request, queryset):
        queryset.update(is_approved=True)
        self.message_user(request, f'{queryset.count()} experiences approved.')
    approve_experiences.short_description = 'Approve selected experiences'


@admin.register(ExperienceImage)
class ExperienceImageAdmin(admin.ModelAdmin):
    list_display = ['experience', 'caption', 'order']
    list_filter = ['experience__category']