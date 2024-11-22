#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Catalog Management System on Elestio...${NC}"

# Create application directory
echo -e "${YELLOW}Creating application directory...${NC}"
mkdir -p /opt/app/catalogv1.12
cd /opt/app/catalogv1.12

# Clone repository if not exists
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Cloning repository...${NC}"
    git clone https://github.com/gaidar0yegor/catalogV1.12.git .
    git checkout develop
fi

# Create necessary directories
echo -e "${YELLOW}Creating necessary directories...${NC}"
mkdir -p backend frontend

# Copy files to correct locations
echo -e "${YELLOW}Copying files to correct locations...${NC}"
cp -r backend/* /opt/app/catalogv1.12/backend/
cp -r frontend/* /opt/app/catalogv1.12/frontend/

# Create .env file from template
echo -e "${YELLOW}Creating environment file...${NC}"
cp infrastructure/elestio/.env.template .env

# Set up Docker volumes
echo -e "${YELLOW}Setting up Docker volumes...${NC}"
mkdir -p /opt/app/catalogv1.12/data/postgres
mkdir -p /opt/app/catalogv1.12/data/redis
mkdir -p /opt/app/catalogv1.12/data/minio

# Set correct permissions
echo -e "${YELLOW}Setting permissions...${NC}"
chown -R 1000:1000 /opt/app/catalogv1.12/data

# Verify Docker installation
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "Next steps:"
echo -e "1. Review and modify .env file if needed"
echo -e "2. Run 'docker-compose up -d' to start the services"
echo -e "3. Run 'docker-compose exec backend alembic upgrade head' to apply database migrations"
echo -e "4. Access the application at https://catalogv1-12-u23037.vm.elestio.app"
