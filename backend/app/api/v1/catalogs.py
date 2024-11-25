from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from ...db.base import get_db
from ...models.catalog import Catalog, CatalogData, ColumnMapping
from ...schemas.catalog import (
    CatalogCreate,
    CatalogResponse,
    CatalogList,
    ColumnMappingCreate,
)

router = APIRouter()

@router.get("/", response_model=CatalogList)
async def list_catalogs(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all catalogs"""
    catalogs = db.query(Catalog).offset(skip).limit(limit).all()
    return {"data": catalogs}

@router.post("/", response_model=CatalogResponse)
async def create_catalog(
    file: UploadFile = File(...),
    name: str = None,
    description: str = None,
    source_type: str = None,
    db: Session = Depends(get_db)
):
    """Create a new catalog from file"""
    if not name:
        name = file.filename

    catalog = Catalog(
        name=name,
        description=description or "",
        source_type=source_type or file.content_type,
        schema={"columns": []}  # Will be updated during column mapping
    )
    
    db.add(catalog)
    db.commit()
    db.refresh(catalog)
    
    return {"data": catalog, "message": "Catalog created successfully"}

@router.get("/{catalog_id}", response_model=CatalogResponse)
async def get_catalog(
    catalog_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific catalog by ID"""
    catalog = db.query(Catalog).filter(Catalog.id == catalog_id).first()
    if not catalog:
        raise HTTPException(status_code=404, detail="Catalog not found")
    return {"data": catalog}

@router.put("/{catalog_id}/mapping", response_model=CatalogResponse)
async def update_column_mapping(
    catalog_id: int,
    mappings: List[ColumnMappingCreate],
    db: Session = Depends(get_db)
):
    """Update column mappings for a catalog"""
    catalog = db.query(Catalog).filter(Catalog.id == catalog_id).first()
    if not catalog:
        raise HTTPException(status_code=404, detail="Catalog not found")

    # Clear existing mappings
    db.query(ColumnMapping).filter(ColumnMapping.catalog_id == catalog_id).delete()

    # Create new mappings
    for mapping in mappings:
        db_mapping = ColumnMapping(
            catalog_id=catalog_id,
            source_column=mapping.source_column,
            target_column=mapping.target_column,
            transformation_rule=mapping.transformation_rule
        )
        db.add(db_mapping)

    db.commit()
    db.refresh(catalog)
    
    return {"data": catalog, "message": "Column mappings updated successfully"}

@router.post("/{catalog_id}/import")
async def import_catalog_data(
    catalog_id: int,
    db: Session = Depends(get_db)
):
    """Import data for a catalog"""
    catalog = db.query(Catalog).filter(Catalog.id == catalog_id).first()
    if not catalog:
        raise HTTPException(status_code=404, detail="Catalog not found")

    # TODO: Implement actual data import logic
    # This will be handled by a background task

    return {"message": "Import started"}

@router.delete("/{catalog_id}")
async def delete_catalog(
    catalog_id: int,
    db: Session = Depends(get_db)
):
    """Delete a catalog"""
    catalog = db.query(Catalog).filter(Catalog.id == catalog_id).first()
    if not catalog:
        raise HTTPException(status_code=404, detail="Catalog not found")

    db.delete(catalog)
    db.commit()
    
    return {"message": "Catalog deleted successfully"}
