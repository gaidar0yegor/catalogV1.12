#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Initializing development environment...${NC}"

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Create necessary directories
echo -e "${YELLOW}Creating necessary directories...${NC}"
mkdir -p frontend/public/icons
mkdir -p frontend/public/screenshots

# Copy environment files if they don't exist
echo -e "${YELLOW}Setting up environment files...${NC}"
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}Created backend/.env${NC}"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    echo -e "${GREEN}Created frontend/.env${NC}"
fi

# Build and start containers
echo -e "${YELLOW}Building and starting containers...${NC}"
docker-compose -f infrastructure/docker/docker-compose.yml up --build -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose -f infrastructure/docker/docker-compose.yml exec backend alembic upgrade head

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
docker-compose -f infrastructure/docker/docker-compose.yml exec frontend npm install

echo -e "${GREEN}Development environment is ready!${NC}"
echo -e "Frontend: http://localhost:3000"
echo -e "Backend API: http://localhost:8000"
echo -e "MinIO Console: http://localhost:9001"

# Print additional information
echo -e "\n${YELLOW}Additional Information:${NC}"
echo -e "- Frontend development server: npm run dev"
echo -e "- Backend development server: uvicorn app.main:app --reload"
echo -e "- API Documentation: http://localhost:8000/docs"
echo -e "- Database: PostgreSQL on port 5432"
echo -e "- Redis: port 6379"
echo -e "- MinIO: ports 9000 (API) and 9001 (Console)"

echo -e "\n${YELLOW}Default Credentials:${NC}"
echo -e "MinIO:"
echo -e "  Username: minioadmin"
echo -e "  Password: minioadmin"
echo -e "PostgreSQL:"
echo -e "  Username: catalog_user"
echo -e "  Password: catalog_password"
echo -e "  Database: catalog_db"

echo -e "\n${GREEN}Setup complete! Happy coding!${NC}"
