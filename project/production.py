
# -*- coding: utf-8 -*-

from project.settings import *

#- Infrastructure specific settings come from local_settings.py which is managed with Salt

# REMEMBER TO MAKE SURE SECRET_KEY IS IN local_settings.py
#SECRET_KEY = 'very secret key'

DEBUG = False
TEMPLATE_DEBUG = False

# Compress
COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
COMPRESS_HTML = True
# Address celery problems (task #5540)
BROKER_HEARTBEAT = 0

# Sentry
SENTRY_DSN = ''
SENTRY_SITE = ''

# vim: tabstop=2 expandtab shiftwidth=2 softtabstop=2

