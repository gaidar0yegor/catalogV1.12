from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# Create SQLAlchemy engine
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # Enable connection pool "pre-ping" feature
    pool_size=5,  # Set initial pool size
    max_overflow=10  # Allow up to 10 connections beyond pool_size
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class for models
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize MinIO client
from minio import Minio
minio_client = Minio(
    settings.MINIO_URL,
    access_key=settings.MINIO_ROOT_USER,
    secret_key=settings.MINIO_ROOT_PASSWORD,
    secure=settings.MINIO_SECURE
)

# Ensure MinIO bucket exists
def init_minio():
    try:
        if not minio_client.bucket_exists(settings.MINIO_BUCKET_NAME):
            minio_client.make_bucket(settings.MINIO_BUCKET_NAME)
    except Exception as e:
        print(f"Error initializing MinIO bucket: {e}")

# Initialize Redis client
from redis import Redis
redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)

# Initialize Celery
from celery import Celery
celery_app = Celery(
    'catalog_management',
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL
)

# Configure Celery
celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

# Initialize database tables
def init_db():
    # Import all models here to ensure they are registered with SQLAlchemy
    from app.models import catalog, supplier  # These will be created next
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Error initializing database: {e}")

# Initialize all components
def init_app():
    init_db()
    init_minio()
