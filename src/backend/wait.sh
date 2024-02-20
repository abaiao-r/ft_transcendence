#!/bin/bash

# Sleep for 5 seconds
sleep 5

# Apply unapplied migrations (if any)
python manage.py migrate --noinput

# Run the Django development server
python manage.py runserver 0.0.0.0:8000
