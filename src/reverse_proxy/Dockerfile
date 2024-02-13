FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

# Install ModSecurity and OWASP ModSecurity Core Rule Set (CRS)
RUN apt-get update && \
    apt-get install -y libnginx-mod-http-modsecurity && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY modsecurity.conf /etc/nginx/modsec/modsecurity.conf
COPY modsecurity.d/ /etc/nginx/modsec/modsecurity.d/

EXPOSE 80
