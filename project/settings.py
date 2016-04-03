
# -*- coding: utf-8 -*-

import os
import logging

BASEDIR = os.path.dirname(os.path.abspath(__file__))

ADMINS = (
    # ('Your Name', 'your_email@domain.com'),
)

MANAGERS = ADMINS

INTERNAL_IPS = ('127.0.0.1',)

ALLOWED_HOSTS = ['*']

DATABASES = {
  'default': {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': os.path.join(BASEDIR, 'database.db'),
  }
}

CACHES = {
  'default': {
    'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
  }
}

USE_TZ = True
TIME_ZONE = 'Europe/Helsinki'

LANGUAGE_CODE = 'fi'

LANGUAGES = (
  ('fi', 'FI'),
)

LOCALE_PATHS = (
  os.path.join(BASEDIR, 'locale'),
)

STATICFILES_DIRS = (
  os.path.join(BASEDIR, 'static'),
)

STATIC_ROOT = os.path.join(BASEDIR, '..', 'staticroot')
STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASEDIR, '..', 'mediaroot')

MEDIA_URL = '/media/'

MIDDLEWARE_CLASSES = (
    'django.middleware.locale.LocaleMiddleware',
)

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
  {
    'BACKEND':'django.template.backends.django.DjangoTemplates',
    'DIRS': [os.path.join(BASEDIR, 'templates')],
    'OPTIONS': {
      'loaders': (
        'apptemplates.Loader',
        'django.template.loaders.filesystem.Loader',
        'django.template.loaders.app_directories.Loader',
        'django.template.loaders.eggs.Loader',
      ),
      'context_processors': (
          'django.core.context_processors.debug',
          'django.core.context_processors.i18n',
          'django.core.context_processors.media',
          'django.core.context_processors.static',
      ),
    }
  },
]

STATICFILES_FINDERS = (
  'django.contrib.staticfiles.finders.FileSystemFinder',
  'django.contrib.staticfiles.finders.AppDirectoriesFinder',
  'compressor.finders.CompressorFinder',
)

INSTALLED_APPS = (
    'eops',

    'compressor',

    'django.contrib.staticfiles',
)


# Compress
COMPRESS_HTML = False
COMPRESS_PARSER = 'compressor.parser.HtmlParser'
COMPRESS_ENABLED = True
COMPRESS_OFFLINE = False
COMPRESS_CSS_FILTERS = [
  'compressor.filters.css_default.CssAbsoluteFilter',
  'hutils.compressor_filters.ScssFilter',
]

# Workaround for pyScss problems
# https://github.com/Kronuz/pyScss/issues/70
logging.getLogger('scss').addHandler(logging.StreamHandler())



# vim: tabstop=2 expandtab shiftwidth=2 softtabstop=2

