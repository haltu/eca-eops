
# -*- coding: utf-8 -*-

from django.conf.urls import include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from django.conf import settings

app_urls = [
  url(r'^', include('eops.urls')),
]

static_urls = static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
static_urls += staticfiles_urlpatterns()

urlpatterns = app_urls# + static_urls


# vim: tabstop=2 expandtab shiftwidth=2 softtabstop=2

