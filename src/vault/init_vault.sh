#!/bin/bash

# shutdown any instance of vault
pkill vault
rm -rf /vault/data/*

# Start Vault in the background, redirecting the output to a file
echo "Starting Vault server in the background"
vault server -dev -config=/vault/config/config.hcl > /tmp/vault.log 2>&1 &
echo "Vault server started"

# Sleep to ensure Vault has started
sleep 5

# Retrieve root token and store it
cat /tmp/vault.log
root_token=$(grep -oP 'Root Token: \K.*' /tmp/vault.log)
echo -n "$root_token" > /vault/token/root_token.txt
echo "Root token: $root_token"
export VAULT_TOKEN="$root_token"

vault kv put secret/myapp/config SECRET_KEY="$SECRET_KEY" \
                                OAUTH_CLIENT_ID="$OAUTH_CLIENT_ID" \
                                OAUTH_CLIENT_SECRET="$OAUTH_CLIENT_SECRET" \
                                DB_NAME="$DB_NAME" \
                                DB_USER="$DB_USER" \
                                DB_PASSWORD="$DB_PASSWORD" \
                                DB_HOST="$DB_HOST" \
                                DB_PORT="$DB_PORT"

echo "Secrets loaded into Vault"

# list all secrets
vault kv get secret/myapp/config

# Keep the script running or exit
tail -f /dev/null
