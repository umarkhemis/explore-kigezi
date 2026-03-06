

"""Review and rating models."""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings


class Review(models.Model):
    """Tourist review for a completed booking."""
    booking = models.OneToOneField(
        'bookings.Booking', on_delete=models.CASCADE, related_name='review'
    )
    tourist = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='reviews'
    )
    experience = models.ForeignKey(
        'experiences.Experience', on_delete=models.CASCADE,
        related_name='reviews'
    )

    # Ratings (1-5)
    overall_rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    authenticity_rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], default=5
    )
    value_rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], default=5
    )
    host_friendliness_rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], default=5
    )

    # Content
    comment = models.TextField()
    would_recommend = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=True)

    # Host response
    host_response = models.TextField(blank=True)
    host_response_date = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review by {self.tourist_name} — {self.experience.title} ({self.overall_rating}★)"

    @property
    def tourist_name(self):
        if self.tourist:
            return self.tourist.get_full_name() or self.tourist.email.split('@')[0]
        return self.booking.tourist_name

    @property
    def tourist_photo(self):
        if self.tourist:
            return self.tourist.profile_photo
        return None

    @property
    def average_sub_rating(self):
        return round(
            (self.authenticity_rating + self.value_rating + self.host_friendliness_rating) / 3, 1
        )