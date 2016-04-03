
# -*- coding: utf-8 -*-

import os
from project.settings import *

#- Infrastructure specific settings come from ENV vars set in Heroku Admin Panel

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

DEBUG = os.environ.get('DJANGO_DEBUG', False)
TEMPLATE_DEBUG = False

MIDDLEWARE_CLASSES = (
  'whitenoise.middleware.WhiteNoiseMiddleware',
  ) + MIDDLEWARE_CLASSES

# Compress
COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
COMPRESS_HTML = True
# Address celery problems (task #5540)
BROKER_HEARTBEAT = 0

# Sentry
SENTRY_DSN = os.environ.get('DJANGO_SENTRY_DSN', '')
SENTRY_SITE = os.environ.get('DJANGO_SENTRY_SITE', '')

# vim: tabstop=2 expandtab shiftwidth=2 softtabstop=2

