# Contributing to Catalog Management System

Thank you for your interest in contributing to the Catalog Management System! This document provides guidelines and instructions for contributing to the project.

## Table of Contents
1. [Development Setup](#development-setup)
2. [Branching Strategy](#branching-strategy)
3. [Commit Guidelines](#commit-guidelines)
4. [Pull Request Process](#pull-request-process)
5. [Code Style](#code-style)
6. [Testing](#testing)
7. [Documentation](#documentation)

## Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker and Docker Compose
- Git

### Setting Up Local Development Environment
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

## Branching Strategy

We follow a modified Git Flow branching strategy:

- `main`: Production releases
- `develop`: Main development branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Emergency fixes for production
- `release/*`: Release preparation

### Branch Naming Convention
- Feature branches: `feature/issue-number-brief-description`
- Bug fix branches: `bugfix/issue-number-brief-description`
- Hotfix branches: `hotfix/issue-number-brief-description`
- Release branches: `release/version-number`

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

Example:
```
feat(catalog): add field mapping validation

- Add validation for required fields
- Implement type checking
- Add error messages

Fixes #123
```

## Pull Request Process

1. Create a new branch from `develop`
2. Make your changes
3. Update documentation as needed
4. Add/update tests
5. Run tests locally
6. Push your changes
7. Create a Pull Request using the template
8. Wait for CI checks to pass
9. Address review comments
10. Squash and merge after approval

## Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Maximum line length: 88 characters (Black formatter)
- Use docstrings for functions and classes

### TypeScript/React (Frontend)
- Follow ESLint configuration
- Use functional components
- Use TypeScript types/interfaces
- Follow Material-UI best practices
- Maximum line length: 80 characters

## Testing

### Backend Testing
- Write unit tests using pytest
- Maintain test coverage above 80%
- Run tests:
  ```bash
  cd backend
  pytest
  ```

### Frontend Testing
- Write unit tests using Vitest
- Test React components using @testing-library/react
- Run tests:
  ```bash
  cd frontend
  npm test
  ```

## Documentation

- Update README.md for major changes
- Document new features in docs/
- Update API documentation (OpenAPI/Swagger)
- Include JSDoc comments for complex functions
- Update environment variable documentation

## Additional Guidelines

### Security
- Never commit sensitive data
- Use environment variables for secrets
- Follow OWASP security guidelines
- Report security issues privately

### Performance
- Consider performance implications
- Add performance tests for critical paths
- Document performance requirements

### Accessibility
- Follow WCAG 2.1 guidelines
- Test with screen readers
- Provide alternative text for images
- Ensure keyboard navigation

## Getting Help

- Create an issue for bugs or feature requests
- Join our community discussions
- Check existing documentation
- Contact maintainers for security issues

## License

By contributing, you agree that your contributions will be licensed under the project's license.
