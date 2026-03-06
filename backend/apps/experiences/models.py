

"""Models for cultural experiences."""
from django.db import models
from django.conf import settings
from django.utils.text import slugify


class Category(models.Model):
    """Experience category (Dance, Food, Crafts, etc.)."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    icon = models.CharField(max_length=10, default='🌍')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.icon} {self.name}"

    @property
    def experience_count(self):
        return self.experiences.filter(is_active=True, is_approved=True).count()


class Experience(models.Model):
    """A cultural experience listing."""

    DISTRICT_CHOICES = [
        ('kabale', 'Kabale'),
        ('kisoro', 'Kisoro'),
        ('rubanda', 'Rubanda'),
        ('rukungiri', 'Rukungiri'),
        ('kanungu', 'Kanungu'),
        ('rukiga', 'Rukiga'),
    ]

    DURATION_CHOICES = [
        (1.0, '1 hour'),
        (1.5, '1.5 hours'),
        (2.0, '2 hours'),
        (3.0, '3 hours'),
        (4.0, 'Half day (4 hrs)'),
        (6.0, '6 hours'),
        (8.0, 'Full day (8 hrs)'),
    ]

    host = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='experiences',
        limit_choices_to={'role': 'host'},
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL,
        null=True, related_name='experiences'
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    description = models.TextField()
    location = models.CharField(max_length=200)
    district = models.CharField(max_length=50, choices=DISTRICT_CHOICES, default='kabale')
    duration_hours = models.FloatField(choices=DURATION_CHOICES, default=2.0)
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2)
    min_group_size = models.PositiveIntegerField(default=1)
    max_group_size = models.PositiveIntegerField(default=15)
    meeting_point = models.TextField()
    whats_included = models.JSONField(default=list, blank=True)
    what_to_bring = models.JSONField(default=list, blank=True)
    available_days = models.JSONField(
        default=list,
        blank=True,
        help_text='List of days: monday, tuesday, etc.'
    )
    cover_image = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    average_rating = models.DecimalField(
        max_digits=3, decimal_places=1, default=0.0
    )
    total_reviews = models.PositiveIntegerField(default=0)
    total_bookings = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Experience.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def update_rating(self):
        """Recalculate average rating from all reviews."""
        from apps.reviews.models import Review
        reviews = Review.objects.filter(experience=self)
        count = reviews.count()
        if count > 0:
            total = sum(r.overall_rating for r in reviews)
            self.average_rating = round(total / count, 1)
            self.total_reviews = count
        else:
            self.average_rating = 0.0
            self.total_reviews = 0
        self.save(update_fields=['average_rating', 'total_reviews'])

    @property
    def duration_display(self):
        for val, label in self.DURATION_CHOICES:
            if self.duration_hours == val:
                return label
        return f"{self.duration_hours} hours"


class ExperienceImage(models.Model):
    """Additional images for an experience."""
    experience = models.ForeignKey(
        Experience, on_delete=models.CASCADE, related_name='images'
    )
    image_url = models.URLField()
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.experience.title} (#{self.order})"