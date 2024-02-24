from django.conf import settings
from django.core.management import execute_from_command_line
import os
import hvac

# Function to authenticate with Vault
def authenticate_vault():
    # Initialize the Vault client
    vault_client = hvac.Client(url=os.environ.get('VAULT_ADDR'))

    # Perform authentication (e.g., using AppRole, Token, etc.)
    # Example with token-based authentication
    token = 'YOUR_VAULT_TOKEN'
    vault_client.token = token

    return vault_client

# Function to retrieve secrets from Vault
def get_secret_from_vault(vault_client, secret_path):
    # Read secret from Vault
    response = vault_client.secrets.kv.v2.read_secret_version(path=secret_path)

    # Extract the secret data
    secret_data = response['data']['data']

    return secret_data

def upsert_secret(path, value):
    settings.VAULT_CLIENT.secrets.kv.v2.create_or_update_secret(
        path=path,
        secret=value,
        mount_point=settings.VAULT_MOUNTPOINT
    )


def read_secret(path):
    return settings.VAULT_CLIENT.secrets.kv.v2.read_secret_version(
        path,
        mount_point=settings.VAULT_MOUNTPOINT
    )


def delete_secret(path):
    settings.VAULT_CLIENT.secrets.kv.v2.delete_metadata_and_all_versions(
        path=path,
        mount_point=settings.VAULT_MOUNTPOINT
    )


def list_secrets(path):
    return settings.VAULT_CLIENT.secrets.kv.v2.list_secrets(
        path=path,
        mount_point=settings.VAULT_MOUNTPOINT
    )