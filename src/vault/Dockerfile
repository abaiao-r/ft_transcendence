FROM vault:1.13.3

EXPOSE 8200

COPY config /vault/config

HEALTHCHECK --interval=5s --timeout=3s CMD vault status || exit 1

