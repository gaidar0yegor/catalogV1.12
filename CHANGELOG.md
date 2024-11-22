# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.12.0] - 2023-11-22

### Added
- Initial release of the Catalog Management System

#### Backend
- FastAPI application setup with PostgreSQL database
- Redis integration for caching and message broker
- Celery worker for background task processing
- MinIO integration for file storage
- SQLAlchemy models for catalogs and suppliers
- Alembic migrations system
- CRUD operations for catalogs and suppliers
- File processing and validation system
- Background import processing
- API documentation with OpenAPI/Swagger

#### Frontend
- React application with TypeScript
- Material-UI component library integration
- Responsive layout with sidebar navigation
- Dashboard page with key metrics
- Suppliers management interface
- Catalogs listing and management
- Import wizard with field mapping
- Progressive Web App (PWA) support
- Service worker for offline capabilities
- Error handling and notifications

#### Infrastructure
- Docker and Docker Compose configuration
- Multi-stage Dockerfile builds
- Nginx configuration for frontend
- GitHub Actions CI/CD pipeline
- Elestio deployment configuration
- Development environment setup script

#### Documentation
- README with setup instructions
- Contributing guidelines
- Pull request template
- Code documentation
- API documentation
- Development setup guide

#### Testing
- Backend unit tests setup
- Frontend component tests
- CI pipeline with automated testing
- Test coverage reporting

### Security
- JWT authentication system
- Role-based access control
- Secure file handling
- Environment variable management
- CORS configuration
- Security headers in Nginx

### Dependencies
- Python 3.11
- Node.js 18
- PostgreSQL 15
- Redis 7
- MinIO
- FastAPI
- React 18
- Material-UI
- TypeScript
- And others as specified in requirements.txt and package.json

[1.12.0]: https://github.com/gaidar0yegor/catalogV1.12/releases/tag/v1.12.0
