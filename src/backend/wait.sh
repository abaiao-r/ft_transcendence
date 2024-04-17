#!/bin/bash

sleep 10

if [ -s /vault/token/root_token.txt ]; then
	echo "Root token found"
else
	echo "Root token not found"
	exit 1
fi

# Apply unapplied migrations (if any)
python manage.py makemigrations --merge
python manage.py makemigrations trans_app --noinput
python manage.py migrate --noinput

cp /code/dist/* /code/trans_app/static/js/

# Run the Django development server
python manage.py runserver 0.0.0.0:8000
