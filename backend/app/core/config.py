from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # API Settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Catalog Management API"
    
    # Environment
    ENVIRONMENT: str = "development"
    
    # Database
    POSTGRES_USER: str = os.getenv("POSTGRES_USER") or os.getenv("PGUSER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD") or os.getenv("PGPASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB") or os.getenv("PGDATABASE", "postgres")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST") or os.getenv("PGHOST", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT") or os.getenv("PGPORT", "5432")
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Redis
    REDIS_HOST: str = os.getenv("REDIS_HOST") or os.getenv("REDISHOST", "localhost")
    REDIS_PORT: str = os.getenv("REDIS_PORT") or os.getenv("REDISPORT", "6379")
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD") or os.getenv("REDISPASSWORD")
    
    @property
    def REDIS_URL(self) -> str:
        if self.REDIS_PASSWORD:
            return f"redis://:{self.REDIS_PASSWORD}@{self.REDIS_HOST}:{self.REDIS_PORT}"
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}"
    
    # MinIO
    MINIO_ROOT_USER: str = os.getenv("MINIO_ROOT_USER", "minioadmin")
    MINIO_ROOT_PASSWORD: str = os.getenv("MINIO_ROOT_PASSWORD", "minioadmin")
    MINIO_HOST: str = os.getenv("MINIO_HOST", "localhost")
    MINIO_PORT: int = int(os.getenv("MINIO_PORT", "9000"))
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")  # Change in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
