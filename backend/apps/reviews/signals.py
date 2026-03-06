

"""Signals to update experience rating when a review is saved/deleted."""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Review


@receiver(post_save, sender=Review)
def update_experience_rating_on_save(sender, instance, **kwargs):
    """Recalculate experience average rating after review save."""
    instance.experience.update_rating()


@receiver(post_delete, sender=Review)
def update_experience_rating_on_delete(sender, instance, **kwargs):
    """Recalculate experience average rating after review delete."""
    instance.experience.update_rating()