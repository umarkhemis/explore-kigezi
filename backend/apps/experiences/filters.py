"""Filters for experiences app."""
import django_filters
from .models import Experience


class ExperienceFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug')
    district = django_filters.CharFilter(field_name='district')
    min_price = django_filters.NumberFilter(
        field_name='price_per_person', lookup_expr='gte'
    )
    max_price = django_filters.NumberFilter(
        field_name='price_per_person', lookup_expr='lte'
    )
    duration = django_filters.NumberFilter(field_name='duration_hours')
    min_rating = django_filters.NumberFilter(
        field_name='average_rating', lookup_expr='gte'
    )

    class Meta:
        model = Experience
        fields = ['category', 'district', 'min_price', 'max_price', 'duration']