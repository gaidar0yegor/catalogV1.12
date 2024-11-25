# Railway.app Deployment Guide

This guide explains how to deploy the Catalog Management Application on Railway.app.

## Quick Start

1. Create a new project in Railway.app
2. Add required services:
   - PostgreSQL
   - Redis
   - Backend service
   - Frontend service

## Step-by-Step Deployment

### 1. Database Services

#### PostgreSQL:
1. Click "New Service" → "Database" → "PostgreSQL"
2. Railway automatically provisions the database
3. Save connection details for backend configuration

#### Redis:
1. Click "New Service" → "Database" → "Redis"
2. Railway automatically provisions Redis
3. Save connection details for backend configuration

### 2. Backend Service

1. Create service:
   ```
   New Service → GitHub Repo → Select Repository
   ```

2. Connect databases:
   - Go to "Variables" tab
   - Click "Variable Reference"
   - Select PostgreSQL variables:
     * PGDATABASE
     * PGHOST
     * PGPASSWORD
     * PGPORT
     * PGUSER
   - Select Redis variables:
     * REDISHOST
     * REDISPORT

3. Add environment variable:
   ```
   ENVIRONMENT=production
   ```

4. Generate domain:
   - Go to "Networking" tab
   - Click "Generate Domain"
   - Note the internal URL (e.g., catalogv112.railway.internal)

### 3. Frontend Service

1. Create service:
   ```
   New Service → GitHub Repo → Select Repository
   ```

2. Set environment variable:
   ```
   VITE_API_URL=http://catalogv112.railway.internal/api/v1
   ```

3. Generate domain:
   - Go to "Networking" tab
   - Click "Generate Domain"

## Configuration Files

### railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "nixpacks",
    "buildCommand": "curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt-get install -y nodejs && cd frontend && npm install && npm run build"
  },
  "deploy": {
    "numReplicas": 1,
    "startCommand": "cd frontend && npx vite preview --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/",
    "healthcheckTimeout": 100
  }
}
```

## Common Issues & Solutions

### Backend Issues

1. Database Connection Errors:
   - Verify database variables are connected
   - Check service logs for connection errors

2. Missing Environment Variables:
   - Ensure all required variables are set
   - Check variable references are properly linked

### Frontend Issues

1. API Connection:
   - Verify VITE_API_URL is correct
   - Check browser console for CORS errors

2. Build Failures:
   - Check Node.js version compatibility
   - Verify all dependencies are installed

## Deployment Checklist

### Backend
- [ ] PostgreSQL service created
- [ ] Redis service created
- [ ] Database variables connected
- [ ] Environment variables set
- [ ] Domain generated
- [ ] Service deployed successfully
- [ ] Logs show no errors

### Frontend
- [ ] VITE_API_URL configured
- [ ] Domain generated
- [ ] Build completes successfully
- [ ] Site loads without errors
- [ ] API calls working

## Monitoring

1. Check service health:
   - View deployment logs
   - Monitor error rates
   - Check resource usage

2. Performance monitoring:
   - Response times
   - Database queries
   - Redis cache hits/misses

## Useful Commands

### View Logs
- Click on service
- Go to "Deployments" tab
- Click on deployment to view logs

### Restart Service
- Go to service settings
- Click "Redeploy" button

### Update Variables
- Go to "Variables" tab
- Click variable to edit
- Service automatically redeploys

## Best Practices

1. Always test locally before deploying
2. Use internal URLs for service communication
3. Monitor deployment logs for issues
4. Keep dependencies updated
5. Use health checks for monitoring
6. Set up automatic deployments
