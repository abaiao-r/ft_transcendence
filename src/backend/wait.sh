#!/bin/bash

sleep 5

if [ -s /vault/token/root_token.txt ]; then
	echo "Root token found"
	#cp /vault/token/root_token.txt /code/root_token.txt
	#export VAULT_TOKEN=$(cat /vault/token/root_token.txt)
else
	echo "Root token not found"
	exit 1
fi

# Apply unapplied migrations (if any)
python manage.py makemigrations chat --noinput
python manage.py makemigrations api --noinput
python manage.py migrate --noinput

# Run the Django development server
python manage.py runserver 0.0.0.0:8000
