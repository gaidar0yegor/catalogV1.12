from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1 import catalogs

app = FastAPI(title="Catalog Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            # Database and other service checks will be added here
        }
    }
