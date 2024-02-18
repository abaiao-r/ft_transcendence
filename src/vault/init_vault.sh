#!/bin/bash

# Wait for Vault to start
while ! nc -z localhost 8200; do
    sleep 1
done

# Initialize Vault (if not already initialized)
if [ ! -f /vault/data/.initialized ]; then
    # Initialize Vault and get the seal wrap token
    seal_wrap_token=$(vault operator init -key-shares=1 -key-threshold=1 -format=json | jq -r '.wrap_info.token')

    # Unwrap the sealed unseal keys
    unseal_keys=$(vault unwrap -format=json $seal_wrap_token | jq -r '.keys_b64[]')

    # Unseal Vault with the retrieved unseal keys
    for key in $unseal_keys; do
        vault operator unseal $key
    done

    # Create a token with desired policies
    vault token create -policy=default -ttl=24h > /vault/token.txt

    # Create .initialized file
    mkdir -p /vault/data
    touch /vault/data/.initialized
fi

# Start Vault server
vault server -config=/vault/config
