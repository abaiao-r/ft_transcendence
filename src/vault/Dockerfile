# Use Debian as the base image
FROM debian:bullseye-slim

# Install dependencies (such as curl and gnupg)
RUN apt-get update && apt-get install -y && apt-get upgrade -y \
    curl \
    gnupg \
    jq \
    netcat \
    procps \
    && rm -rf /var/lib/apt/lists/*

# Download and install Vault
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com bullseye main" | tee /etc/apt/sources.list.d/vault.list \
    && apt-get update && apt-get install -y \
    vault \
    && rm -rf /var/lib/apt/lists/*

# generate tls certs
RUN mkdir -p /vault/tls
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /vault/tls/server.key -out /vault/tls/server.crt -subj "/C=US/ST=CA/L=San Francisco/O=Vault/OU=IT Department/CN=vault"

RUN mkdir -p /vault/token

# Expose Vault port
EXPOSE 8200

# Copy your Vault configuration files
COPY config.hcl /vault/config/config.hcl

# Copy your initialization script
COPY init_vault.sh /vault/init_vault.sh

# Make the initialization script executable
RUN chmod +x /vault/init_vault.sh

# Set the entrypoint to run the initialization script
ENTRYPOINT ["/vault/init_vault.sh"]

# set the command to copy the file inside the container (/vault/token) to host folder (./vault)
#CMD ["cp", "-r", "/vault/token", "./vault"]