# Catalog Management System

A web application for managing, importing, exporting, and merging product catalogs from multiple sources.

## Features

- Dynamic column handling for imports
- Multiple import sources (CSV, Excel, JSON)
- Column mapping and validation
- Catalog merging
- Export functionality
- User authentication and authorization

## Tech Stack

- **Frontend**:
  - React with TypeScript
  - Material-UI
  - React Query
  - Zustand for state management
  - Vite for build tooling

- **Backend**:
  - FastAPI (Python)
  - PostgreSQL
  - Redis for caching
  - MinIO for file storage
  - Celery for background tasks

- **Infrastructure**:
  - Docker & Docker Compose
  - Railway.app for deployment
  - Nginx for frontend serving

## Development Setup

1. **Prerequisites**:
   - Docker and Docker Compose
   - Git

2. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd catalog-management
   ```

3. **Environment Setup**:
   ```bash
   # Copy environment files
   cp .env.example .env
   cp frontend/.env.example frontend/.env
   ```

4. **Start Development Environment**:
   ```bash
   docker-compose up -d
   ```

   The application will be available at:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Railway.app Deployment

1. **Prerequisites**:
   - Railway.app account
   - Railway CLI installed

2. **Initial Setup**:
   ```bash
   # Login to Railway
   railway login

   # Link project
   railway link
   ```

3. **Configure Variables**:
   Set up the following variables in Railway.app dashboard:
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`
   - `PGHOST`
   - `PGPORT`
   - `REDISHOST`
   - `REDISPORT`
   - `MINIO_ROOT_USER`
   - `MINIO_ROOT_PASSWORD`
   - `SECRET_KEY`
   - `ENVIRONMENT=production`

4. **Deploy**:
   ```bash
   railway up
   ```

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   └── models/
│   ├── alembic/
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   └── utils/
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── railway.json
└── README.md
```

## Development Guidelines

1. **Code Style**:
   - Frontend: ESLint & Prettier
   - Backend: Black & isort
   - Use TypeScript for frontend development
   - Write comprehensive tests

2. **Git Workflow**:
   - Create feature branches from `main`
   - Use conventional commits
   - Submit PRs for review

3. **API Development**:
   - Follow RESTful principles
   - Document all endpoints
   - Include request/response examples

## Available Scripts

- **Frontend**:
  ```bash
  # Development
  npm run dev

  # Build
  npm run build

  # Type checking
  npm run type-check
  ```

- **Backend**:
  ```bash
  # Start server
  uvicorn app.main:app --reload

  # Run migrations
  alembic upgrade head

  # Create migration
  alembic revision --autogenerate -m "description"
  ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
