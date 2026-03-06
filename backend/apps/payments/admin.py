

from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'tx_ref', 'booking', 'amount', 'payment_method',
        'status', 'created_at',
    ]
    list_filter = ['status', 'payment_method']
    search_fields = ['tx_ref', 'booking__booking_reference']
    readonly_fields = ['created_at', 'updated_at']