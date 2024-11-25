from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class ColumnMappingBase(BaseModel):
    source_column: str
    target_column: str
    transformation_rule: Optional[Dict[str, Any]] = None

class ColumnMappingCreate(ColumnMappingBase):
    pass

class ColumnMapping(ColumnMappingBase):
    id: int
    catalog_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CatalogBase(BaseModel):
    name: str
    description: Optional[str] = None
    source_type: str
    column_schema: Dict[str, Any]

class CatalogCreate(CatalogBase):
    pass

class Catalog(CatalogBase):
    id: int
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CatalogData(BaseModel):
    id: int
    catalog_id: int
    data: Dict[str, Any]
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class CatalogResponse(BaseModel):
    data: Catalog
    message: Optional[str] = None

class CatalogList(BaseModel):
    data: List[Catalog]
    message: Optional[str] = None

class ImportSettings(BaseModel):
    source_type: str
    column_mappings: List[ColumnMappingCreate]
