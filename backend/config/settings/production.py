

from .base import *
from decouple import config
import dj_database_url

DEBUG = False

ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='').split(',')

DATABASES = {
    'default': dj_database_url.parse(config('DATABASE_URL'))
}

CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='').split(',')

SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'









# """Production settings."""
# from .base import *
# import dj_database_url

# DEBUG = False

# DATABASES = {
#     'default': dj_database_url.config(
#         default=config('DATABASE_URL'),
#         conn_max_age=600,
#     )
# }

# SECURE_BROWSER_XSS_FILTER = True
# SECURE_CONTENT_TYPE_NOSNIFF = True
# X_FRAME_OPTIONS = 'DENY'