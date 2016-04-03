
# -*- coding: utf-8 -*-

from project.settings import *

SECRET_KEY = 'foo'

DEBUG = True
TEMPLATES[0]['OPTIONS']['debug'] = DEBUG

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'normal': {
            'format': '%(levelname)s %(name)s %(lineno)s %(message)s %(data)s'
        },
    },
    'filters': {
      'default': {
        '()': 'project.logging_helpers.Filter',
      },
    },
    'handlers': {
        'null': {
            'level':'ERROR',
            'class':'django.utils.log.NullHandler',
        },
        'console':{
            'class':'logging.StreamHandler',
            'formatter': 'normal',
            'filters': ['default'],
        },
    },
    'loggers': {
        'django.db.backends': {
            'handlers': ['console'],
            'propagate': False,
            'level': 'ERROR',
        },
        'django': {
            'handlers': ['console'],
            'propagate': False,
            'level': 'ERROR',
        },
        'foo': {
            'handlers': ['console'],
            'propagate': False,
            'level': 'DEBUG',
        },
        '': {
            'handlers': ['console'],
            'propagate': False,
            'level': 'WARNING',
            },
    }
}

# Compress
COMPRESS_REBUILD_TIMEOUT = 0

# Testing
TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'
SAUCELABS_USERNAME = ''
SAUCELABS_ACCESS_KEY = ''

try:
  from local_settings import *
except ImportError:
  pass


# vim: tabstop=2 expandtab shiftwidth=2 softtabstop=2

