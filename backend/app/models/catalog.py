from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from ..core.database import Base

# Association table for catalog fields
catalog_fields = Table(
    'catalog_fields',
    Base.metadata,
    Column('catalog_id', Integer, ForeignKey('catalogs.id'), primary_key=True),
    Column('field_id', Integer, ForeignKey('fields.id'), primary_key=True)
)

class Catalog(Base):
    __tablename__ = "catalogs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    supplier_id = Column(Integer, ForeignKey('suppliers.id'))
    file_path = Column(String)  # Path in MinIO
    status = Column(String)  # pending, processing, completed, failed
    import_type = Column(String)  # csv, excel, json
    row_count = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    error_log = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)

    # Relationships
    supplier = relationship("Supplier", back_populates="catalogs")
    fields = relationship("Field", secondary=catalog_fields, back_populates="catalogs")
    products = relationship("Product", back_populates="catalog")

class Field(Base):
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    display_name = Column(String)
    field_type = Column(String)  # string, number, date, etc.
    is_required = Column(Boolean, default=False)
    validation_rules = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    catalogs = relationship("Catalog", secondary=catalog_fields, back_populates="fields")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    catalog_id = Column(Integer, ForeignKey('catalogs.id'))
    sku = Column(String, index=True)
    data = Column(JSON)  # Stores all product fields dynamically
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    catalog = relationship("Catalog", back_populates="products")

class ImportJob(Base):
    __tablename__ = "import_jobs"

    id = Column(Integer, primary_key=True, index=True)
    catalog_id = Column(Integer, ForeignKey('catalogs.id'))
    status = Column(String)  # pending, processing, completed, failed
    total_rows = Column(Integer, default=0)
    processed_rows = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    error_log = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    catalog = relationship("Catalog")
