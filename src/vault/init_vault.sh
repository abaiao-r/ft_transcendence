#!/bin/bash

# Start Vault in background
##vault server -dev &

# start vault in the background, redirecting the output to a file
echo "Starting Vault server in the background"
vault server -dev > /tmp/vault.log 2>&1 &
echo "Vault server started"

# Sleep to ensure Vault has started
sleep 5

# Retrieve root token and store it
root_token=$(grep -oP 'Root Token: \K.*' /tmp/vault.log)
echo -n "$root_token" > /vault/token/root_token.txt
echo "Root token: $root_token"
export VAULT_TOKEN="$root_token"

# Securely stop Vault
#vault operator seal

tail -f /dev/null
