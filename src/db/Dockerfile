# Start with the official PostgreSQL image
FROM postgres:13

# Add the Vault binary (if Vault interactions are needed directly in the script)
RUN apt-get update && \
    apt-get install -y wget unzip && \
    wget https://releases.hashicorp.com/vault/1.5.3/vault_1.5.3_linux_amd64.zip && \
    unzip -o vault_1.5.3_linux_amd64.zip -d /usr/local/bin/ && \
    rm vault_1.5.3_linux_amd64.zip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Add your entrypoint script
ADD init-db.sh /usr/local/bin/init-db.sh
RUN chmod +x /usr/local/bin/init-db.sh

# Set your custom script to be the entrypoint
ENTRYPOINT ["init-db.sh"]
