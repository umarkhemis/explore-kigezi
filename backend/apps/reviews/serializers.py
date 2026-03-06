

"""Serializers for reviews app."""
from rest_framework import serializers
from django.utils import timezone
from .models import Review
from apps.bookings.models import Booking


class ReviewSerializer(serializers.ModelSerializer):
    """Read serializer for reviews."""
    tourist_name = serializers.ReadOnlyField()
    tourist_photo = serializers.ReadOnlyField()
    experience_title = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'booking', 'tourist_name', 'tourist_photo',
            'experience', 'experience_title',
            'overall_rating', 'authenticity_rating',
            'value_rating', 'host_friendliness_rating',
            'comment', 'would_recommend', 'is_verified',
            'host_response', 'host_response_date',
            'created_at',
        ]

    def get_experience_title(self, obj):
        return obj.experience.title


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a review."""
    booking_reference = serializers.CharField(write_only=True)

    class Meta:
        model = Review
        fields = [
            'booking_reference',
            'overall_rating', 'authenticity_rating',
            'value_rating', 'host_friendliness_rating',
            'comment', 'would_recommend',
        ]

    def validate_overall_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    def validate(self, data):
        booking_reference = data.pop('booking_reference')
        try:
            booking = Booking.objects.select_related(
                'experience'
            ).get(booking_reference=booking_reference)
        except Booking.DoesNotExist:
            raise serializers.ValidationError(
                {'booking_reference': 'Booking not found.'}
            )

        if booking.status != 'completed':
            raise serializers.ValidationError(
                'You can only review completed bookings.'
            )

        if hasattr(booking, 'review'):
            raise serializers.ValidationError(
                'You have already reviewed this booking.'
            )

        # Check tourist owns the booking
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if booking.tourist and booking.tourist != request.user:
                raise serializers.ValidationError(
                    'You can only review your own bookings.'
                )

        data['booking'] = booking
        data['experience'] = booking.experience
        data['tourist'] = request.user if (
            request and request.user.is_authenticated
        ) else None
        return data

    def create(self, validated_data):
        return Review.objects.create(**validated_data)


class HostResponseSerializer(serializers.ModelSerializer):
    """Serializer for host responding to a review."""
    class Meta:
        model = Review
        fields = ['host_response']

    def update(self, instance, validated_data):
        instance.host_response = validated_data.get('host_response', '')
        instance.host_response_date = timezone.now()
        instance.save()
        return instance