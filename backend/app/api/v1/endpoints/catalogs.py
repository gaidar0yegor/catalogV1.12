from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from ....core.database import get_db
from ....schemas.catalog import (
    Catalog,
    CatalogCreate,
    CatalogUpdate,
    CatalogResponse,
    ImportJobResponse,
    FieldMappingResponse
)
from ....services import catalog_service

router = APIRouter()

@router.post("/", response_model=CatalogResponse)
async def create_catalog(
    catalog: CatalogCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new catalog entry.
    """
    try:
        db_catalog = await catalog_service.create_catalog(db, catalog)
        return CatalogResponse(
            catalog=db_catalog,
            message="Catalog created successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error creating catalog: {str(e)}"
        )

@router.post("/upload", response_model=ImportJobResponse)
async def upload_catalog_file(
    supplier_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload a catalog file and start the import process.
    """
    try:
        import_job = await catalog_service.process_catalog_upload(
            db,
            supplier_id,
            file
        )
        return ImportJobResponse(
            job=import_job,
            message="Catalog upload started successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing catalog upload: {str(e)}"
        )

@router.get("/", response_model=List[Catalog])
async def list_catalogs(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    supplier_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve a list of catalogs with optional filtering.
    """
    try:
        catalogs = await catalog_service.get_catalogs(
            db,
            skip=skip,
            limit=limit,
            supplier_id=supplier_id,
            status=status
        )
        return catalogs
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error retrieving catalogs: {str(e)}"
        )

@router.get("/{catalog_id}", response_model=CatalogResponse)
async def get_catalog(
    catalog_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific catalog by ID.
    """
    catalog = await catalog_service.get_catalog(db, catalog_id)
    if not catalog:
        raise HTTPException(
            status_code=404,
            detail="Catalog not found"
        )
    return CatalogResponse(
        catalog=catalog,
        message="Catalog retrieved successfully"
    )

@router.put("/{catalog_id}", response_model=CatalogResponse)
async def update_catalog(
    catalog_id: int,
    catalog_update: CatalogUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a specific catalog's details.
    """
    try:
        updated_catalog = await catalog_service.update_catalog(
            db,
            catalog_id,
            catalog_update
        )
        if not updated_catalog:
            raise HTTPException(
                status_code=404,
                detail="Catalog not found"
            )
        return CatalogResponse(
            catalog=updated_catalog,
            message="Catalog updated successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error updating catalog: {str(e)}"
        )

@router.delete("/{catalog_id}")
async def delete_catalog(
    catalog_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a specific catalog and its associated data.
    """
    try:
        success = await catalog_service.delete_catalog(db, catalog_id)
        if not success:
            raise HTTPException(
                status_code=404,
                detail="Catalog not found"
            )
        return {"message": "Catalog deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error deleting catalog: {str(e)}"
        )

@router.post("/{catalog_id}/map-fields", response_model=FieldMappingResponse)
async def map_catalog_fields(
    catalog_id: int,
    field_mappings: dict,
    db: Session = Depends(get_db)
):
    """
    Map fields from the source catalog to database columns.
    """
    try:
        mappings = await catalog_service.map_catalog_fields(
            db,
            catalog_id,
            field_mappings
        )
        return FieldMappingResponse(
            catalog_id=catalog_id,
            mappings=mappings,
            message="Field mapping completed successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error mapping fields: {str(e)}"
        )

@router.post("/{catalog_id}/process")
async def process_catalog(
    catalog_id: int,
    db: Session = Depends(get_db)
):
    """
    Start processing a catalog after field mapping is complete.
    """
    try:
        job = await catalog_service.process_catalog(db, catalog_id)
        return {
            "message": "Catalog processing started",
            "job_id": job.id,
            "status": job.status
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error starting catalog processing: {str(e)}"
        )

@router.get("/{catalog_id}/status")
async def get_catalog_status(
    catalog_id: int,
    db: Session = Depends(get_db)
):
    """
    Get the current status of a catalog and its processing job.
    """
    try:
        status = await catalog_service.get_catalog_status(db, catalog_id)
        return status
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error retrieving catalog status: {str(e)}"
        )
