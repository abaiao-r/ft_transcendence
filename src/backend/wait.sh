#!/bin/bash

sleep 5

if [ -s /vault/token/root_token.txt ]; then
	echo "Root token found"
	export VAULT_TOKEN=$(cat /vault/token/root_token.txt)
else
	echo "Root token not found"
	exit 1
fi

# Apply unapplied migrations (if any)
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Run the Django development server
python manage.py runserver 0.0.0.0:8000
