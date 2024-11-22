# Catalog Management System v1.12

A comprehensive web application for managing, importing, exporting, and merging product catalogs from multiple sources.

## Project Structure

```
catalogV1.12/
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Dependencies and scripts
├── backend/           # FastAPI backend application
│   ├── app/          # Application code
│   ├── tests/        # Test suite
│   └── requirements.txt # Python dependencies
├── infrastructure/    # Docker and deployment configs
│   ├── docker/       # Docker configuration files
│   └── elestio/      # Elestio deployment configs
└── docs/             # Project documentation
```

## Technology Stack

### Frontend
- React.js with TypeScript
- Material-UI for components
- Redux Toolkit for state management
- React Query for API integration

### Backend
- FastAPI (Python 3.11+)
- SQLAlchemy ORM
- Celery for background tasks
- JWT authentication

### Infrastructure
- PostgreSQL database
- Redis for caching and message broker
- MinIO for object storage
- Docker & Docker Compose
- Elestio for deployment

## Development Setup

1. Clone the repository:
```bash
git clone https://github.com/gaidar0yegor/catalogV1.12.git
cd catalogV1.12
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Install frontend dependencies:
```bash
cd frontend
npm install
```

5. Start the development environment:
```bash
docker-compose up -d
```

## Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make changes and commit:
```bash
git add .
git commit -m "Description of changes"
```

3. Push changes:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub

## Features

### 1. Catalog Import
- Multiple file format support (CSV, Excel, JSON)
- Dynamic column mapping
- Data validation
- Background processing for large files

### 2. Field Mapping
- Interactive mapping interface
- Template support
- Custom field transformations

### 3. Catalog Export
- Multiple format export
- Custom field selection
- Filtered exports

### 4. Supplier Management
- Supplier profiles
- Connection credentials
- Import history

### 5. Dashboard
- Import/Export history
- Processing status
- Error reporting

## Deployment

The application is automatically deployed to Elestio when changes are merged to the main branch. The deployment process includes:

1. Automated testing
2. Docker image building
3. Database migrations
4. Zero-downtime deployment

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to your fork
5. Create a Pull Request

## License

This project is proprietary software. All rights reserved.
