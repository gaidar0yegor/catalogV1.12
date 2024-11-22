# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY frontend/ .

# Set production environment
ENV NODE_ENV=production

# Copy production environment file
COPY frontend/.env.production .env

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Install certbot for SSL
RUN apk add --no-cache certbot certbot-nginx

# Copy nginx configuration
COPY infrastructure/docker/nginx.prod.conf /etc/nginx/conf.d/default.conf

# Create directory for SSL certificates
RUN mkdir -p /etc/nginx/ssl/live/catalogv1-12-u23037.vm.elestio.app

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy SSL certificate setup script
COPY infrastructure/docker/setup-ssl.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/setup-ssl.sh

# Expose ports
EXPOSE 80 443

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
