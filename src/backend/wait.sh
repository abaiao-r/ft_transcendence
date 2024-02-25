#!/bin/bash

# Sleep for 5 seconds
sleep 5

cp -r /vault/token/. /code/

# Apply unapplied migrations (if any)
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Run the Django development server
python manage.py runserver 0.0.0.0:8000
