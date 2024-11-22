from sqlalchemy.orm import Session
from fastapi import UploadFile
from typing import List, Optional, Dict, Any
from ..models.catalog import Catalog, Field, Product, ImportJob
from ..schemas.catalog import CatalogCreate, CatalogUpdate
from ..core.database import minio_client, redis_client, celery_app
from datetime import datetime
import pandas as pd
import json
import io

async def create_catalog(db: Session, catalog: CatalogCreate) -> Catalog:
    """
    Create a new catalog entry.
    """
    db_catalog = Catalog(
        name=catalog.name,
        supplier_id=catalog.supplier_id,
        import_type=catalog.import_type,
        status="pending"
    )
    
    try:
        db.add(db_catalog)
        db.commit()
        db.refresh(db_catalog)
        return db_catalog
    except Exception as e:
        db.rollback()
        raise Exception(f"Error creating catalog: {str(e)}")

async def process_catalog_upload(
    db: Session,
    supplier_id: int,
    file: UploadFile
) -> ImportJob:
    """
    Process an uploaded catalog file.
    """
    try:
        # Create catalog entry
        catalog = await create_catalog(db, CatalogCreate(
            name=file.filename,
            supplier_id=supplier_id,
            import_type=_determine_file_type(file.filename)
        ))
        
        # Store file in MinIO
        file_path = f"catalogs/{supplier_id}/{catalog.id}/{file.filename}"
        await _store_file_in_minio(file, file_path)
        
        # Create import job
        job = ImportJob(
            catalog_id=catalog.id,
            status="pending",
            total_rows=0,
            processed_rows=0
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        
        # Start async processing
        celery_app.send_task(
            'app.tasks.process_catalog_file',
            args=[catalog.id, job.id, file_path]
        )
        
        return job
    except Exception as e:
        db.rollback()
        raise Exception(f"Error processing catalog upload: {str(e)}")

async def get_catalogs(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    supplier_id: Optional[int] = None,
    status: Optional[str] = None
) -> List[Catalog]:
    """
    Retrieve a list of catalogs with optional filtering.
    """
    query = db.query(Catalog)
    
    if supplier_id:
        query = query.filter(Catalog.supplier_id == supplier_id)
    if status:
        query = query.filter(Catalog.status == status)
    
    return query.offset(skip).limit(limit).all()

async def get_catalog(db: Session, catalog_id: int) -> Optional[Catalog]:
    """
    Retrieve a specific catalog by ID.
    """
    return db.query(Catalog).filter(Catalog.id == catalog_id).first()

async def update_catalog(
    db: Session,
    catalog_id: int,
    catalog_update: CatalogUpdate
) -> Optional[Catalog]:
    """
    Update a catalog's details.
    """
    db_catalog = await get_catalog(db, catalog_id)
    if not db_catalog:
        return None
    
    update_data = catalog_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_catalog, field, value)
    
    try:
        db.commit()
        db.refresh(db_catalog)
        return db_catalog
    except Exception as e:
        db.rollback()
        raise Exception(f"Error updating catalog: {str(e)}")

async def delete_catalog(db: Session, catalog_id: int) -> bool:
    """
    Delete a catalog and its associated data.
    """
    db_catalog = await get_catalog(db, catalog_id)
    if not db_catalog:
        return False
    
    try:
        # Delete associated data
        db.query(Product).filter(Product.catalog_id == catalog_id).delete()
        db.query(ImportJob).filter(ImportJob.catalog_id == catalog_id).delete()
        
        # Delete catalog
        db.delete(db_catalog)
        db.commit()
        
        # Delete files from MinIO
        try:
            objects = minio_client.list_objects(
                settings.MINIO_BUCKET_NAME,
                prefix=f"catalogs/{db_catalog.supplier_id}/{catalog_id}/"
            )
            for obj in objects:
                minio_client.remove_object(settings.MINIO_BUCKET_NAME, obj.object_name)
        except Exception as e:
            print(f"Error deleting MinIO objects: {e}")
        
        return True
    except Exception as e:
        db.rollback()
        raise Exception(f"Error deleting catalog: {str(e)}")

async def map_catalog_fields(
    db: Session,
    catalog_id: int,
    field_mappings: Dict[str, str]
) -> Dict[str, str]:
    """
    Map fields from the source catalog to database columns.
    """
    db_catalog = await get_catalog(db, catalog_id)
    if not db_catalog:
        raise Exception("Catalog not found")
    
    try:
        # Update catalog with field mappings
        db_catalog.field_mappings = field_mappings
        db.commit()
        
        # Create or update field definitions
        for source_field, target_field in field_mappings.items():
            field = db.query(Field).filter(Field.name == target_field).first()
            if not field:
                field = Field(
                    name=target_field,
                    display_name=target_field,
                    field_type="string"  # Default type
                )
                db.add(field)
        
        db.commit()
        return field_mappings
    except Exception as e:
        db.rollback()
        raise Exception(f"Error mapping fields: {str(e)}")

async def process_catalog(db: Session, catalog_id: int) -> ImportJob:
    """
    Start processing a catalog after field mapping is complete.
    """
    db_catalog = await get_catalog(db, catalog_id)
    if not db_catalog:
        raise Exception("Catalog not found")
    
    if not db_catalog.field_mappings:
        raise Exception("Field mappings must be defined before processing")
    
    try:
        # Create new import job
        job = ImportJob(
            catalog_id=catalog_id,
            status="pending",
            total_rows=0,
            processed_rows=0
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        
        # Start async processing
        celery_app.send_task(
            'app.tasks.process_mapped_catalog',
            args=[catalog_id, job.id]
        )
        
        return job
    except Exception as e:
        db.rollback()
        raise Exception(f"Error starting catalog processing: {str(e)}")

async def get_catalog_status(db: Session, catalog_id: int) -> Dict[str, Any]:
    """
    Get the current status of a catalog and its processing job.
    """
    db_catalog = await get_catalog(db, catalog_id)
    if not db_catalog:
        raise Exception("Catalog not found")
    
    # Get latest import job
    job = db.query(ImportJob)\
        .filter(ImportJob.catalog_id == catalog_id)\
        .order_by(ImportJob.created_at.desc())\
        .first()
    
    return {
        "catalog_id": catalog_id,
        "catalog_status": db_catalog.status,
        "job_status": job.status if job else None,
        "processed_rows": job.processed_rows if job else 0,
        "total_rows": job.total_rows if job else 0,
        "error_count": job.error_count if job else 0,
        "last_updated": job.updated_at if job else db_catalog.updated_at
    }

def _determine_file_type(filename: str) -> str:
    """
    Determine the file type from the filename.
    """
    lower_filename = filename.lower()
    if lower_filename.endswith('.csv'):
        return "csv"
    elif lower_filename.endswith(('.xls', '.xlsx')):
        return "excel"
    elif lower_filename.endswith('.json'):
        return "json"
    else:
        raise Exception("Unsupported file type")

async def _store_file_in_minio(file: UploadFile, file_path: str) -> None:
    """
    Store an uploaded file in MinIO.
    """
    try:
        file_data = await file.read()
        file_obj = io.BytesIO(file_data)
        
        minio_client.put_object(
            bucket_name=settings.MINIO_BUCKET_NAME,
            object_name=file_path,
            data=file_obj,
            length=len(file_data),
            content_type=file.content_type
        )
    except Exception as e:
        raise Exception(f"Error storing file in MinIO: {str(e)}")
