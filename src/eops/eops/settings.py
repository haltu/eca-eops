
# -*- coding: utf-8 -*-

from django.conf import settings
from os.path import join

SAUCELABS_USERNAME = getattr(settings, 'SAUCELABS_USERNAME', '')
SAUCELABS_ACCESS_KEY = getattr(settings, 'SAUCELABS_ACCESS_KEY', '')

DATADIR = join(getattr(settings, 'BASEDIR'), '..', 'data')

# vim: tabstop=2 expandtab shiftwidth=2 softtabstop=2

