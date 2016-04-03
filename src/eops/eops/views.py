
# -*- coding: utf-8 -*-

import logging
import json
from os.path import join
from django.views.generic import TemplateView
from django.http import JsonResponse
from eops.settings import DATADIR

LOG = logging.getLogger(__name__)


def get_data(i):
  choices = [
    'elavaOPSv3.json',
    'elavaOPSv4.json',
    ]
  try:
    fn = choices[int(i)]
  except (IndexError, ValueError):
    fn = choices[0]
  with open(join(DATADIR, fn)) as data_file:    
    data = json.load(data_file)
  return data


class IndexView(TemplateView):
  template_name = 'eops/views/index.html'

  def get_context_data(self):
    context = {
      'data': json.dumps(get_data(self.request.GET.get('d', 0)))
    }
    return context


def data(request):
  return JsonResponse(get_data(request.GET.get('d', 0)))


# vim: tabstop=2 expandtab shiftwidth=2 softtabstop=2
