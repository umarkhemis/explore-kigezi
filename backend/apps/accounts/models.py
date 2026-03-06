

"""User model for Explore Kigezi platform."""
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended user supporting tourists, hosts, and admins."""

    ROLE_CHOICES = [
        ('tourist', 'Tourist'),
        ('host', 'Host'),
        ('admin', 'Admin'),
    ]
    MOBILE_MONEY_PROVIDERS = [
        ('mtn', 'MTN Mobile Money'),
        ('airtel', 'Airtel Money'),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='tourist')
    phone = models.CharField(max_length=20, blank=True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    is_verified = models.BooleanField(default=False)
    profile_photo = models.URLField(blank=True, null=True)
    national_id_document = models.URLField(blank=True, null=True)
    mobile_money_number = models.CharField(max_length=20, blank=True)
    mobile_money_provider = models.CharField(
        max_length=10, choices=MOBILE_MONEY_PROVIDERS, blank=True
    )
    nationality = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.get_full_name() or self.email} ({self.role})"

    @property
    def is_host(self):
        return self.role == 'host'

    @property
    def is_tourist(self):
        return self.role == 'tourist'

    @property
    def is_platform_admin(self):
        return self.role == 'admin' or self.is_superuser