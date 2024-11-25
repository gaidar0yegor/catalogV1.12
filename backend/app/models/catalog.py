from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.base import Base

class Catalog(Base):
    __tablename__ = "catalogs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    source_type = Column(String, nullable=False)  # file, api, ftp, etc.
    column_schema = Column(JSON, nullable=False)  # Stores column definitions
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="catalogs")
    data = relationship("CatalogData", back_populates="catalog")
    column_mappings = relationship("ColumnMapping", back_populates="catalog")

class CatalogData(Base):
    __tablename__ = "catalog_data"

    id = Column(Integer, primary_key=True, index=True)
    catalog_id = Column(Integer, ForeignKey("catalogs.id"), nullable=False)
    data = Column(JSON, nullable=False)  # Stores the actual product data
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    catalog = relationship("Catalog", back_populates="data")

class ColumnMapping(Base):
    __tablename__ = "column_mappings"

    id = Column(Integer, primary_key=True, index=True)
    catalog_id = Column(Integer, ForeignKey("catalogs.id"), nullable=False)
    source_column = Column(String, nullable=False)
    target_column = Column(String, nullable=False)
    transformation_rule = Column(JSON)  # Optional transformation rules
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    catalog = relationship("Catalog", back_populates="column_mappings")
