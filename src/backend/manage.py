#!/usr/bin/env python3
import os
import sys
import hvac
from transcendence.vault_instance import vault_client


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendence.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    client = vault_client
    try:
        secret_path = ''
        secret = { 'key': 'value'}
        #client.create_secret(secret_path, secret)
    except Exception as e:
        print(f"Error creating Vault secret: {e}")
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
    
