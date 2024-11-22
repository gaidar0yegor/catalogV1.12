from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class ConnectionType(str, Enum):
    FTP = "ftp"
    SFTP = "sftp"
    API = "api"
    EMAIL = "email"

class CredentialType(str, Enum):
    API_KEY = "api_key"
    USERNAME_PASSWORD = "username_password"
    SSH_KEY = "ssh_key"
    OAUTH = "oauth"

# Supplier Schemas
class SupplierBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    connection_type: ConnectionType
    auto_import: bool = False
    import_schedule: Optional[str] = None
    file_pattern: Optional[str] = None

class SupplierCreate(SupplierBase):
    connection_details: Dict[str, Any]
    field_mappings: Optional[Dict[str, str]] = None

class SupplierUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None
    connection_type: Optional[ConnectionType] = None
    connection_details: Optional[Dict[str, Any]] = None
    auto_import: Optional[bool] = None
    import_schedule: Optional[str] = None
    file_pattern: Optional[str] = None
    field_mappings: Optional[Dict[str, str]] = None
    is_active: Optional[bool] = None

class Supplier(SupplierBase):
    id: int
    connection_details: Dict[str, Any]
    field_mappings: Optional[Dict[str, str]] = None
    is_active: bool
    last_import_at: Optional[datetime] = None
    last_import_status: Optional[str] = None
    error_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Supplier Credential Schemas
class CredentialBase(BaseModel):
    credential_type: CredentialType
    credentials: Dict[str, Any]
    expires_at: Optional[datetime] = None

class CredentialCreate(CredentialBase):
    supplier_id: int

class CredentialUpdate(BaseModel):
    credentials: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    expires_at: Optional[datetime] = None

class Credential(CredentialBase):
    id: int
    supplier_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Supplier Activity Schemas
class ActivityBase(BaseModel):
    activity_type: str
    description: str
    metadata: Optional[Dict[str, Any]] = None

class ActivityCreate(ActivityBase):
    supplier_id: int

class Activity(ActivityBase):
    id: int
    supplier_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Supplier Template Schemas
class TemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    field_mappings: Dict[str, str]
    validation_rules: Optional[Dict[str, Any]] = None

class TemplateCreate(TemplateBase):
    supplier_id: int

class TemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    field_mappings: Optional[Dict[str, str]] = None
    validation_rules: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None

class Template(TemplateBase):
    id: int
    supplier_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Response Schemas
class SupplierResponse(BaseModel):
    supplier: Supplier
    message: str = "Success"

class CredentialResponse(BaseModel):
    credential: Credential
    message: str = "Success"

class ActivityResponse(BaseModel):
    activity: Activity
    message: str = "Success"

class TemplateResponse(BaseModel):
    template: Template
    message: str = "Success"

class SupplierListResponse(BaseModel):
    suppliers: List[Supplier]
    total: int
    page: int
    page_size: int
    message: str = "Success"
