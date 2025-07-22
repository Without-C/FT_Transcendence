#!/bin/sh

set -e

SSL_DIR="/etc/nginx/ssl"
CERT="${SSL_DIR}/fullchain.pem"
KEY="${SSL_DIR}/privkey.pem"

mkdir -p $SSL_DIR

if [ ! -f "$CERT" ] || [ ! -f "$KEY" ]; then
    openssl req -x509 -nodes -days 365 \
        -subj "/CN=localhost" \
        -newkey rsa:2048 \
        -keyout "$KEY" \
        -out "$CERT"
fi

exec "$@"
