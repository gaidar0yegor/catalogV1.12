from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .api.v1 import catalogs
from .db.base import engine, Base, SessionLocal
from .db.init_db import init_db

app = FastAPI(title="Catalog Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://catalogv112-frontend-production.up.railway.app",
        "https://catalog-manage.up.railway.app",
        "https://magnificent-love.railway.internal",
        "http://localhost:3000",  # For local development
        "http://localhost:5173"   # For Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize database with default data
db = SessionLocal()
try:
    init_db(db)
finally:
    db.close()

# Include routers
app.include_router(catalogs.router, prefix="/api/v1/catalogs", tags=["catalogs"])

@app.get("/")
async def root():
    return {
        "message": "Catalog Management API",
        "status": "running",
        "version": "0.1.0"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "api": "up",
            "database": "up"
        }
    }
