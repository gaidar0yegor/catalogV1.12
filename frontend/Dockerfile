# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install \
    axios@1.6.2 \
    @types/axios@0.14.0 \
    @emotion/react@11.11.1 \
    @emotion/styled@11.11.0 \
    @mui/icons-material@5.14.18 \
    @mui/material@5.14.18 \
    @tanstack/react-query@5.8.4 \
    react@18.2.0 \
    react-dom@18.2.0 \
    react-router-dom@6.20.0 \
    zustand@4.4.6 \
    @types/react@18.2.37 \
    @types/react-dom@18.2.15 \
    @typescript-eslint/eslint-plugin@6.10.0 \
    @typescript-eslint/parser@6.10.0 \
    @vitejs/plugin-react@4.2.0 \
    eslint@8.53.0 \
    eslint-plugin-react-hooks@4.6.0 \
    eslint-plugin-react-refresh@0.4.4 \
    typescript@5.2.2 \
    vite@5.0.0

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
