

from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        'booking_reference', 'tourist_name', 'experience',
        'booking_date', 'group_size', 'total_price',
        'status', 'payment_status', 'created_at',
    ]
    list_filter = ['status', 'payment_status', 'payment_method']
    search_fields = [
        'booking_reference', 'tourist_name',
        'tourist_email', 'experience__title',
    ]
    ordering = ['-created_at']
    readonly_fields = [
        'booking_reference', 'total_price',
        'platform_commission', 'host_payout_amount', 'created_at',
    ]
    list_editable = ['status']

    fieldsets = (
        ('Booking Info', {
            'fields': (
                'booking_reference', 'experience', 'tourist',
                'booking_date', 'group_size', 'special_requests',
            )
        }),
        ('Tourist Details', {
            'fields': (
                'tourist_name', 'tourist_email',
                'tourist_phone', 'tourist_nationality',
            )
        }),
        ('Financials', {
            'fields': (
                'total_price', 'platform_commission',
                'host_payout_amount', 'host_payout_status',
            )
        }),
        ('Status & Payment', {
            'fields': (
                'status', 'payment_status', 'payment_method',
                'flutterwave_tx_ref', 'flutterwave_tx_id',
            )
        }),
    )