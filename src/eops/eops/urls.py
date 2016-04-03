
# -*- coding: utf-8 -*-

from django.conf.urls import url
from django.contrib.auth.decorators import login_required
from eops.views import IndexView

urlpatterns = [
  url(r'^$', IndexView.as_view(),
    name='eops_index'),
  url(r'^data.json$', 'eops.views.data',
    name='eops_data'),
]


# vim: tabstop=2 expandtab shiftwidth=2 softtabstop=2
