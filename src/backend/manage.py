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
    # Create the Vault client
    #vault_client_instance = vault_client
    client = vault_client
    # is initialized?
    #print(f"Vault client initialized: {client}")

    # is vault healthy?
    #print(f"Vault is healthy: {client.client.sys.is_initialized()}")
    # create test secret
    #print(f"Vault secret created: {client.create_secret ('42KEY', {'key': 'ufgsdf3478terriogd'})}")


    # Read the secret back
    #print(f"Vault secret read: {client.read_secret ('42KEY')}")

    #print(f"Vault secret read: {client.read_secret ('SECRET_KEY')}")
    #print(f"Vault secret read: {client.read_secret ('OAUTH_CLIENT_ID')}")
    #print(f"Vault secret read: {client.read_secret ('OAUTH_CLIENT_SECRET')}")
    #print(f"Vault secret read: {client.read_secret ('DB_NAME')}")
    #print(f"Vault secret read: {client.read_secret ('DB_USER')}")
    #print(f"Vault secret read: {client.read_secret ('DB_PASSWORD')}")
    
    try:
        secret_path = ''
        secret = { 'key': 'value'}
        #client.create_secret(secret_path, secret)
    except Exception as e:
        print(f"Error creating Vault secret: {e}")
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
    
