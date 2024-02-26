from django.conf import settings
from django.core.management import execute_from_command_line
from transcendence.vault_settings import VAULT_ADDR, ROOT_TOKEN_PATH
import os
import hvac


class VaultClient:
    def __init__(self, vault_addr, token_file):
        token = ''
        if os.path.exists(token_file):
            with open(token_file, 'r') as file:
                token = file.read().strip()
        if token == '':
            raise ValueError('Vault root token not found')
        print(f"Vault address: {vault_addr}")
        print(f"Vault token: {token}")
        print("Authenticated to Vault")
        self.client = hvac.Client(url=vault_addr, token=token)

    def create_secret(self, path, data):
        """
        Create a secret in Vault.
        :param path: Path where the secret will be stored.
        :param data: Data to be stored as the secret.
        :return: True if successful, False otherwise.
        """
        try:
            self.client.secrets.kv.v2.create_or_update_secret(
                path=path,
                secret=data
            )
            return True
        except hvac.exceptions.VaultError as e:
            print(f"Error creating secret: {e}")
            return False

    def read_secret(self, path):
        """
        Read a secret from Vault.
        :param path: Path of the secret to read.
        :return: Secret data if successful, None otherwise.
        """
        try:
            response = self.client.secrets.kv.v2.read_secret_version(path=path)
            return response['data']['data']
        except hvac.exceptions.VaultError as e:
            print(f"Error reading secret: {e}")
            return None

    def delete_secret(self, path):
        """
        Delete a secret from Vault.
        :param path: Path of the secret to delete.
        :return: True if successful, False otherwise.
        """
        try:
            self.client.secrets.kv.v2.delete_metadata_and_all_versions(path=path)
            return True
        except hvac.exceptions.VaultError as e:
            print(f"Error deleting secret: {e}")
            return False
