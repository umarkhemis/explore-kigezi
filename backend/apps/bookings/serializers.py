

"""Serializers for bookings app."""
from rest_framework import serializers
from django.utils import timezone
from .models import Booking
from apps.experiences.serializers import ExperienceListSerializer


class BookingSerializer(serializers.ModelSerializer):
    """Full booking serializer with nested experience info."""
    experience_detail = ExperienceListSerializer(
        source='experience', read_only=True
    )
    price_formatted = serializers.ReadOnlyField()
    has_review = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_reference', 'experience', 'experience_detail',
            'booking_date', 'group_size', 'special_requests',
            'tourist_name', 'tourist_email', 'tourist_phone',
            'tourist_nationality', 'total_price', 'price_formatted',
            'platform_commission', 'host_payout_amount',
            'status', 'payment_status', 'payment_method',
            'host_payout_status', 'flutterwave_tx_ref',
            'has_review', 'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'booking_reference', 'total_price',
            'platform_commission', 'host_payout_amount',
            'status', 'payment_status', 'host_payout_status',
            'created_at', 'updated_at',
        ]

    def get_has_review(self, obj):
        return hasattr(obj, 'review')


class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new booking."""

    class Meta:
        model = Booking
        fields = [
            'experience', 'booking_date', 'group_size',
            'special_requests', 'tourist_name', 'tourist_email',
            'tourist_phone', 'tourist_nationality', 'payment_method',
        ]

    def validate_booking_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError(
                'Booking date cannot be in the past.'
            )
        return value

    def validate_group_size(self, value):
        if value < 1:
            raise serializers.ValidationError(
                'Group size must be at least 1.'
            )
        return value

    def validate(self, data):
        experience = data.get('experience')
        group_size = data.get('group_size', 1)

        if experience:
            if group_size < experience.min_group_size:
                raise serializers.ValidationError({
                    'group_size': (
                        f'Minimum group size for this experience '
                        f'is {experience.min_group_size}.'
                    )
                })
            if group_size > experience.max_group_size:
                raise serializers.ValidationError({
                    'group_size': (
                        f'Maximum group size for this experience '
                        f'is {experience.max_group_size}.'
                    )
                })
            if not experience.is_active or not experience.is_approved:
                raise serializers.ValidationError(
                    'This experience is not currently available.'
                )
        return data

    def create(self, validated_data):
        experience = validated_data['experience']
        group_size = validated_data['group_size']
        total_price = experience.price_per_person * group_size

        booking = Booking(
            total_price=total_price,
            **validated_data
        )
        # Set tourist if authenticated
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            booking.tourist = request.user
            # Pre-fill tourist info if not provided
            if not booking.tourist_name:
                booking.tourist_name = request.user.get_full_name()
            if not booking.tourist_email:
                booking.tourist_email = request.user.email
            if not booking.tourist_phone:
                booking.tourist_phone = request.user.phone

        # Pay on arrival → auto-confirm
        if validated_data.get('payment_method') == 'pay_on_arrival':
            booking.status = 'confirmed'

        booking.save()

        # Update experience booking count
        experience.total_bookings += 1
        experience.save(update_fields=['total_bookings'])

        return booking