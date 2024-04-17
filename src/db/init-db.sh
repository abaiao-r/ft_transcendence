#!/bin/bash

#wait 5 seconds for the vault server to start
sleep 5

if [ -s /vault/token/root_token.txt ]; then
	echo "Root token found"
else
	echo "Root token not found"
	exit 1
fi

# Load Vault secrets
export VAULT_ADDR='http://vault:8201'
export VAULT_TOKEN=$(cat /vault/token/root_token.txt)

# print the vault token
echo "Vault token: $VAULT_TOKEN"

# Fetch secrets from Vault and export them
export POSTGRES_USER=$(vault kv get -field=DB_USER secret/myapp/config)
export POSTGRES_PASSWORD=$(vault kv get -field=DB_PASSWORD secret/myapp/config)
# Export other environment variables if needed
export POSTGRES_DB="transcendence"

# Execute the original Docker entrypoint script
exec docker-entrypoint.sh postgres
