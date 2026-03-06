

"""Serializers for experiences app."""
from rest_framework import serializers
from .models import Category, Experience, ExperienceImage
from apps.accounts.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    experience_count = serializers.ReadOnlyField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon', 'description', 'experience_count']


class ExperienceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperienceImage
        fields = ['id', 'image_url', 'caption', 'order']


class ExperienceListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing experiences."""
    category = CategorySerializer(read_only=True)
    host_name = serializers.SerializerMethodField()
    host_photo = serializers.SerializerMethodField()
    host_id = serializers.SerializerMethodField()
    duration_display = serializers.ReadOnlyField()
    price_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = [
            'id', 'title', 'slug', 'category', 'location', 'district',
            'duration_hours', 'duration_display', 'price_per_person',
            'price_formatted', 'cover_image', 'average_rating',
            'total_reviews', 'total_bookings', 'is_featured',
            'host_name', 'host_photo', 'host_id', 'created_at',
        ]

    def get_host_name(self, obj):
        return obj.host.get_full_name() or obj.host.email.split('@')[0]

    def get_host_photo(self, obj):
        return obj.host.profile_photo

    def get_host_id(self, obj):
        return obj.host.id

    def get_price_formatted(self, obj):
        return f"UGX {int(obj.price_per_person):,}"


class ExperienceDetailSerializer(serializers.ModelSerializer):
    """Full serializer for experience detail page."""
    category = CategorySerializer(read_only=True)
    host = UserSerializer(read_only=True)
    images = ExperienceImageSerializer(many=True, read_only=True)
    duration_display = serializers.ReadOnlyField()
    price_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = [
            'id', 'title', 'slug', 'description', 'category', 'host',
            'location', 'district', 'duration_hours', 'duration_display',
            'price_per_person', 'price_formatted', 'min_group_size',
            'max_group_size', 'meeting_point', 'whats_included',
            'what_to_bring', 'available_days', 'cover_image', 'images',
            'average_rating', 'total_reviews', 'total_bookings',
            'is_active', 'is_approved', 'is_featured', 'created_at',
        ]

    def get_price_formatted(self, obj):
        return f"UGX {int(obj.price_per_person):,}"


class ExperienceCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating experiences."""
    class Meta:
        model = Experience
        fields = [
            'id', 'title', 'description', 'category', 'location', 'district',
            'duration_hours', 'price_per_person', 'min_group_size',
            'max_group_size', 'meeting_point', 'whats_included',
            'what_to_bring', 'available_days', 'cover_image', 'is_active',
        ]

    def validate_price_per_person(self, value):
        if value < 1000:
            raise serializers.ValidationError(
                'Price must be at least UGX 1,000.'
            )
        return value

    def validate(self, data):
        if data.get('min_group_size', 1) > data.get('max_group_size', 15):
            raise serializers.ValidationError(
                'Minimum group size cannot exceed maximum group size.'
            )
        return data