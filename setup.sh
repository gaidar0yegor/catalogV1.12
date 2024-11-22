#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up Catalog Management System...${NC}"

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

# Create .env file from template
echo -e "${YELLOW}Creating environment file...${NC}"
cp infrastructure/elestio/.env.template .env

# Set up Docker volumes
echo -e "${YELLOW}Setting up Docker volumes...${NC}"
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p data/minio

# Set correct permissions
echo -e "${YELLOW}Setting permissions...${NC}"
chown -R 1000:1000 data

# Install dependencies and build
echo -e "${YELLOW}Installing dependencies and building...${NC}"

# Frontend
cd frontend
if command -v npm &> /dev/null; then
    npm ci
    npm run build
else
    echo -e "${RED}npm not found. Skipping frontend build.${NC}"
fi

# Backend
cd ../backend
if command -v pip &> /dev/null; then
    pip install -r requirements.txt
else
    echo -e "${RED}pip not found. Skipping backend dependencies.${NC}"
fi

# Start services
echo -e "${YELLOW}Starting services...${NC}"
cd ..
if command -v docker-compose &> /dev/null; then
    docker-compose -f docker-compose.elestio.yml up -d
    
    # Wait for services to be ready
    echo -e "${YELLOW}Waiting for services to be ready...${NC}"
    sleep 10
    
    # Run migrations
    echo -e "${YELLOW}Running database migrations...${NC}"
    docker-compose -f docker-compose.elestio.yml exec -T backend alembic upgrade head
    
    # Initialize MinIO
    echo -e "${YELLOW}Initializing MinIO...${NC}"
    docker-compose -f docker-compose.elestio.yml exec -T backend python -c "
    from app.core.database import init_minio
    init_minio()
    "
else
    echo -e "${RED}Docker Compose not found. Cannot start services.${NC}"
fi

echo -e "${GREEN}Setup completed!${NC}"
echo -e "Access the application at: https://catalogv1-12-u23037.vm.elestio.app"
echo -e "API Documentation: https://catalogv1-12-u23037.vm.elestio.app/api/docs"
echo -e "MinIO Console: https://catalogv1-12-u23037.vm.elestio.app:9001"

echo -e "\n${YELLOW}Credentials:${NC}"
echo -e "Database:"
echo -e "  Username: catalog_admin_u23037"
echo -e "  Password: Qw5eHd9pKm2nVx4j"
echo -e "MinIO:"
echo -e "  Username: minio_admin_u23037"
echo -e "  Password: Jk7mNp3qRt8vLx2y"
echo -e "Admin Account:"
echo -e "  Username: admin_u23037"
echo -e "  Password: Zt9xHm5kWp3nVj7q"
