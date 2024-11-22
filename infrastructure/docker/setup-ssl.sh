#!/bin/sh

# Domain name from environment variable or default
DOMAIN=${DOMAIN:-catalogv1-12-u23037.vm.elestio.app}
EMAIL=${SSL_EMAIL:-admin@catalogv1-12-u23037.vm.elestio.app}

# Check if certificates already exist
if [ ! -f "/etc/nginx/ssl/live/$DOMAIN/fullchain.pem" ]; then
    echo "SSL certificates not found. Setting up SSL..."
    
    # Create directory for certificates
    mkdir -p /etc/nginx/ssl/live/$DOMAIN

    # Check if we're running in Elestio
    if [ -f "/etc/ssl/certs/elestio.pem" ]; then
        echo "Running in Elestio environment, using provided certificates..."
        
        # Copy Elestio certificates
        cp /etc/ssl/certs/elestio.pem /etc/nginx/ssl/live/$DOMAIN/fullchain.pem
        cp /etc/ssl/private/elestio.key /etc/nginx/ssl/live/$DOMAIN/privkey.pem
    else
        echo "Generating self-signed certificates for development..."
        
        # Generate self-signed certificate
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout /etc/nginx/ssl/live/$DOMAIN/privkey.pem \
            -out /etc/nginx/ssl/live/$DOMAIN/fullchain.pem \
            -subj "/CN=$DOMAIN/O=Catalog Management/C=US"
    fi

    # Set proper permissions
    chmod 600 /etc/nginx/ssl/live/$DOMAIN/privkey.pem
    chmod 644 /etc/nginx/ssl/live/$DOMAIN/fullchain.pem
fi

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

# Start nginx in background
echo "Starting nginx..."
nginx -g "daemon off;"
