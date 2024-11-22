from sqlalchemy import Column, Integer, String, DateTime, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String, nullable=True)
    
    # Connection details
    connection_type = Column(String)  # ftp, sftp, api, email
    connection_details = Column(JSON)  # Encrypted connection credentials
    
    # Import settings
    import_schedule = Column(String, nullable=True)  # Cron expression for scheduled imports
    auto_import = Column(Boolean, default=False)
    file_pattern = Column(String, nullable=True)  # Pattern to match files for import
    
    # Field mappings
    field_mappings = Column(JSON, nullable=True)  # Custom field mappings for this supplier
    
    # Status and metadata
    is_active = Column(Boolean, default=True)
    last_import_at = Column(DateTime, nullable=True)
    last_import_status = Column(String, nullable=True)
    error_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    catalogs = relationship("Catalog", back_populates="supplier")

class SupplierCredential(Base):
    __tablename__ = "supplier_credentials"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey('suppliers.id'))
    credential_type = Column(String)  # api_key, username_password, ssh_key, etc.
    credentials = Column(JSON)  # Encrypted credentials
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    # Relationships
    supplier = relationship("Supplier", back_populates="credentials")

Supplier.credentials = relationship("SupplierCredential", back_populates="supplier")

class SupplierActivity(Base):
    __tablename__ = "supplier_activities"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey('suppliers.id'))
    activity_type = Column(String)  # import, export, update, error
    description = Column(String)
    metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    supplier = relationship("Supplier")

class SupplierTemplate(Base):
    __tablename__ = "supplier_templates"

    id = Column(Integer, primary_key=True, index=True)
    supplier_id = Column(Integer, ForeignKey('suppliers.id'))
    name = Column(String)
    description = Column(String, nullable=True)
    field_mappings = Column(JSON)  # Template for field mappings
    validation_rules = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    supplier = relationship("Supplier")
