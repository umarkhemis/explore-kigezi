

"""Booking model for Explore Kigezi platform."""
import random
import string
from django.db import models
from django.conf import settings


def generate_booking_reference():
    """Generate unique booking reference like EK-2026-A3X9Z."""
    chars = string.ascii_uppercase + string.digits
    unique = ''.join(random.choices(chars, k=5))
    ref = f"EK-2026-{unique}"
    while Booking.objects.filter(booking_reference=ref).exists():
        unique = ''.join(random.choices(chars, k=5))
        ref = f"EK-2026-{unique}"
    return ref


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
        ('failed', 'Failed'),
    ]
    PAYMENT_METHOD_CHOICES = [
        ('mtn', 'MTN Mobile Money'),
        ('airtel', 'Airtel Money'),
        ('card', 'Card'),
        ('pay_on_arrival', 'Pay on Arrival'),
    ]
    PAYOUT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
    ]

    # Core relations
    tourist = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='bookings'
    )
    experience = models.ForeignKey(
        'experiences.Experience', on_delete=models.CASCADE,
        related_name='bookings'
    )

    # Booking details
    booking_reference = models.CharField(
        max_length=20, unique=True, blank=True
    )
    booking_date = models.DateField()
    group_size = models.PositiveIntegerField(default=1)
    special_requests = models.TextField(blank=True)

    # Tourist info (for non-registered tourists)
    tourist_name = models.CharField(max_length=200)
    tourist_email = models.EmailField()
    tourist_phone = models.CharField(max_length=20)
    tourist_nationality = models.CharField(max_length=100, blank=True)

    # Financials
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    platform_commission = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )
    host_payout_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0
    )

    # Status
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )
    payment_status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending'
    )
    payment_method = models.CharField(
        max_length=20, choices=PAYMENT_METHOD_CHOICES, default='pay_on_arrival'
    )
    host_payout_status = models.CharField(
        max_length=20, choices=PAYOUT_STATUS_CHOICES, default='pending'
    )

    # Payment tracking
    flutterwave_tx_ref = models.CharField(max_length=100, blank=True)
    flutterwave_tx_id = models.CharField(max_length=100, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.booking_reference} — {self.tourist_name}"

    def save(self, *args, **kwargs):
        # Auto-generate booking reference
        if not self.booking_reference:
            self.booking_reference = generate_booking_reference()

        # Calculate financials on first save
        if not self.pk:
            commission_rate = getattr(
                settings, 'PLATFORM_COMMISSION_RATE', 0.15
            )
            self.platform_commission = round(
                self.total_price * commission_rate, 2
            )
            self.host_payout_amount = round(
                self.total_price - self.platform_commission, 2
            )

        super().save(*args, **kwargs)

    def can_be_cancelled(self):
        """Only pending/confirmed bookings can be cancelled."""
        return self.status in ['pending', 'confirmed']

    @property
    def price_formatted(self):
        return f"UGX {int(self.total_price):,}"