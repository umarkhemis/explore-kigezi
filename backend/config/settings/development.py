
"""Development settings."""
from .base import *

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Use local file storage in development if Cloudinary not configured
if not CLOUDINARY_STORAGE.get('CLOUD_NAME'):
    DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

CORS_ALLOW_ALL_ORIGINS = True