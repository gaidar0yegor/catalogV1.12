# Catalog Management System v1.12

A comprehensive web application for managing, importing, exporting, and merging product catalogs from multiple sources.

## Features

- **Dynamic Catalog Import**
  - Support for CSV, Excel, and JSON formats
  - Automatic column detection and mapping
  - Data validation and error handling
  - Background processing for large files

- **Field Mapping**
  - Interactive mapping interface
  - Template support
  - Custom field transformations

- **Supplier Management**
  - Multiple connection types (FTP, SFTP, API, Email)
  - Automated import scheduling
  - Connection health monitoring

- **Dashboard & Reporting**
  - Real-time import status
  - Error tracking and reporting
  - Activity monitoring

## Technology Stack

### Backend
- FastAPI (Python 3.11+)
- SQLAlchemy ORM
- PostgreSQL
- Redis & Celery
- MinIO (S3-compatible storage)

### Frontend
- React 18 with TypeScript
- Material-UI
- React Query
- PWA Support

### Infrastructure
- Docker & Docker Compose
- GitHub Actions
- Elestio Deployment
- Nginx

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Git

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/gaidar0yegor/catalogV1.12.git
   cd catalogV1.12
   ```

2. Run the initialization script:
   ```bash
   ./scripts/init-dev.sh
   ```

3. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - MinIO Console: http://localhost:9001

### Manual Setup

1. Create environment files:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Start the services:
   ```bash
   docker-compose up -d
   ```

3. Run database migrations:
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

## Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Running Tests
Backend:
```bash
cd backend
pytest
```

Frontend:
```bash
cd frontend
npm test
```

## Deployment

The application is automatically deployed to Elestio when changes are merged into the main branch.

### Manual Deployment
1. Build the images:
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. Deploy:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Branching Strategy
- `main`: Production releases
- `develop`: Development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Emergency fixes
- `release/*`: Release preparation

## Documentation

- [API Documentation](http://localhost:8000/docs)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Frontend Documentation](frontend/README.md)
- [Backend Documentation](backend/README.md)

## License

This project is proprietary software. All rights reserved.

## Support

For support, please create an issue in the GitHub repository or contact the maintainers directly.
