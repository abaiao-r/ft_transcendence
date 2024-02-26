from transcendence.vault_client import VaultClient
import os

vault_client = VaultClient(os.environ['VAULT_ADDR'], os.environ['VAULT_TOKEN'])
