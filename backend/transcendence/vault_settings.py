import hvac
import os

ROOT_TOKEN_PATH = os.environ['VAULT_TOKEN_FILE']
VAULT_HOSTNAME = 'http://vault'
VAULT_PORT = 8200
VAULT_SECRET_PATH = 'secret'
VAULT_ADDR = os.environ['VAULT_ADDR']
VAULT_MOUNTPOINT = 'kv'



