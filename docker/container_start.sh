#!/bin/sh

# Navigate to the app and start gunicorn
cd backend

# We should migrate on startup in case there's been any db changes
python manage.py migrate

exec gunicorn backend.wsgi:application --bind unix:/tmp/gunicorn.sock --access-logfile '/src/logs/access.log' --error-logfile '/src/logs/error.log' --workers 6
