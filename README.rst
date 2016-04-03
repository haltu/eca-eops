
eOPS
****

Shows the finnish curriculum as a living document.

Infra requirements
==================

* Does not need a database :)
* Sentry
* NewRelic

Deployment to Heroku
====================

This app uses Buildout based buildpack. With commands below you should be able to deploy your own copy.

::

  heroku create eca-eops
  git init .
  heroku git:remote -a eca-eops
  heroku buildpacks:add heroku/python
  heroku buildpacks:add https://github.com/derega/heroku-buildpack-buildout.git
  heroku config:add DJANGO_SECRET_KEY=foo
  heroku config:add DJANGO_SENTRY_DSN=https://123:123@sentry.local/123
  heroku config:add DJANGO_SENTRY_SITE=app
  heroku config:add VERSION_SETUPTOOLS=20.3
  heroku config:add BUILDOUT_CFG=heroku.cfg
  heroku config:add DJANGO_SETTINGS_MODULE=project.heroku

