

"""Payment models."""
from django.db import models


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    booking = models.ForeignKey(
        'bookings.Booking', on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='UGX')
    payment_method = models.CharField(max_length=20)
    tx_ref = models.CharField(max_length=100, unique=True)
    provider_tx_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )
    phone_number = models.CharField(max_length=20, blank=True)
    flutterwave_response = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.tx_ref} — {self.status} — UGX {self.amount}"