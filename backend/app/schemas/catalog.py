from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class ImportType(str, Enum):
    CSV = "csv"
    EXCEL = "excel"
    JSON = "json"

class Status(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

# Field Schemas
class FieldBase(BaseModel):
    name: str
    display_name: str
    field_type: str
    is_required: bool = False
    validation_rules: Optional[Dict[str, Any]] = None

class FieldCreate(FieldBase):
    pass

class Field(FieldBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    sku: str
    data: Dict[str, Any]

class ProductCreate(ProductBase):
    catalog_id: int

class Product(ProductBase):
    id: int
    catalog_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Catalog Schemas
class CatalogBase(BaseModel):
    name: str
    supplier_id: int
    import_type: ImportType

class CatalogCreate(CatalogBase):
    pass

class CatalogUpdate(BaseModel):
    name: Optional[str] = None
    status: Optional[Status] = None
    error_log: Optional[Dict[str, Any]] = None

class Catalog(CatalogBase):
    id: int
    file_path: str
    status: Status
    row_count: int = 0
    error_count: int = 0
    error_log: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    processed_at: Optional[datetime] = None
    fields: List[Field] = []
    products: List[Product] = []

    class Config:
        from_attributes = True

# Import Job Schemas
class ImportJobBase(BaseModel):
    catalog_id: int
    status: Status

class ImportJobCreate(ImportJobBase):
    pass

class ImportJobUpdate(BaseModel):
    status: Optional[Status] = None
    processed_rows: Optional[int] = None
    error_count: Optional[int] = None
    error_log: Optional[Dict[str, Any]] = None

class ImportJob(ImportJobBase):
    id: int
    total_rows: int = 0
    processed_rows: int = 0
    error_count: int = 0
    error_log: Optional[Dict[str, Any]] = None
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Response Schemas
class CatalogResponse(BaseModel):
    catalog: Catalog
    message: str = "Success"

class ImportJobResponse(BaseModel):
    job: ImportJob
    message: str = "Success"

class FieldMappingResponse(BaseModel):
    catalog_id: int
    mappings: Dict[str, str]
    message: str = "Success"
