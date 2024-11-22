from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional, Tuple, Dict, Any
from ..models.supplier import Supplier, SupplierCredential, SupplierActivity
from ..schemas.supplier import SupplierCreate, SupplierUpdate
from datetime import datetime

async def create_supplier(db: Session, supplier: SupplierCreate) -> Supplier:
    """
    Create a new supplier in the database.
    """
    db_supplier = Supplier(
        name=supplier.name,
        description=supplier.description,
        connection_type=supplier.connection_type,
        connection_details=supplier.connection_details,
        auto_import=supplier.auto_import,
        import_schedule=supplier.import_schedule,
        file_pattern=supplier.file_pattern,
        field_mappings=supplier.field_mappings
    )
    
    try:
        db.add(db_supplier)
        db.commit()
        db.refresh(db_supplier)
        
        # Create activity log
        activity = SupplierActivity(
            supplier_id=db_supplier.id,
            activity_type="create",
            description=f"Supplier {db_supplier.name} created"
        )
        db.add(activity)
        db.commit()
        
        return db_supplier
    except Exception as e:
        db.rollback()
        raise Exception(f"Error creating supplier: {str(e)}")

async def get_suppliers(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    search: Optional[str] = None,
    is_active: Optional[bool] = None
) -> Tuple[List[Supplier], int]:
    """
    Retrieve a list of suppliers with optional filtering and pagination.
    """
    query = db.query(Supplier)
    
    # Apply filters
    if search:
        query = query.filter(
            or_(
                Supplier.name.ilike(f"%{search}%"),
                Supplier.description.ilike(f"%{search}%")
            )
        )
    
    if is_active is not None:
        query = query.filter(Supplier.is_active == is_active)
    
    # Get total count for pagination
    total = query.count()
    
    # Apply pagination
    suppliers = query.offset(skip).limit(limit).all()
    
    return suppliers, total

async def get_supplier(db: Session, supplier_id: int) -> Optional[Supplier]:
    """
    Retrieve a specific supplier by ID.
    """
    return db.query(Supplier).filter(Supplier.id == supplier_id).first()

async def update_supplier(
    db: Session,
    supplier_id: int,
    supplier_update: SupplierUpdate
) -> Optional[Supplier]:
    """
    Update a supplier's details.
    """
    db_supplier = await get_supplier(db, supplier_id)
    if not db_supplier:
        return None
    
    # Update supplier fields
    update_data = supplier_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_supplier, field, value)
    
    try:
        # Create activity log
        activity = SupplierActivity(
            supplier_id=supplier_id,
            activity_type="update",
            description=f"Supplier {db_supplier.name} updated",
            metadata={"updated_fields": list(update_data.keys())}
        )
        db.add(activity)
        
        db.commit()
        db.refresh(db_supplier)
        return db_supplier
    except Exception as e:
        db.rollback()
        raise Exception(f"Error updating supplier: {str(e)}")

async def delete_supplier(db: Session, supplier_id: int) -> Optional[Supplier]:
    """
    Delete a supplier (soft delete by setting is_active to False).
    """
    db_supplier = await get_supplier(db, supplier_id)
    if not db_supplier:
        return None
    
    try:
        # Soft delete
        db_supplier.is_active = False
        db_supplier.updated_at = datetime.utcnow()
        
        # Create activity log
        activity = SupplierActivity(
            supplier_id=supplier_id,
            activity_type="delete",
            description=f"Supplier {db_supplier.name} deleted"
        )
        db.add(activity)
        
        db.commit()
        db.refresh(db_supplier)
        return db_supplier
    except Exception as e:
        db.rollback()
        raise Exception(f"Error deleting supplier: {str(e)}")

async def test_connection(db: Session, supplier_id: int) -> Dict[str, Any]:
    """
    Test the connection to a supplier's data source.
    """
    db_supplier = await get_supplier(db, supplier_id)
    if not db_supplier:
        raise Exception("Supplier not found")
    
    try:
        # Implement connection testing based on connection_type
        if db_supplier.connection_type == "ftp":
            return await test_ftp_connection(db_supplier.connection_details)
        elif db_supplier.connection_type == "sftp":
            return await test_sftp_connection(db_supplier.connection_details)
        elif db_supplier.connection_type == "api":
            return await test_api_connection(db_supplier.connection_details)
        elif db_supplier.connection_type == "email":
            return await test_email_connection(db_supplier.connection_details)
        else:
            raise Exception(f"Unsupported connection type: {db_supplier.connection_type}")
    except Exception as e:
        # Log connection test failure
        activity = SupplierActivity(
            supplier_id=supplier_id,
            activity_type="connection_test",
            description=f"Connection test failed: {str(e)}",
            metadata={"error": str(e)}
        )
        db.add(activity)
        db.commit()
        raise

async def test_ftp_connection(connection_details: Dict[str, Any]) -> Dict[str, Any]:
    """
    Test FTP connection.
    """
    # Implement FTP connection test
    raise NotImplementedError("FTP connection testing not implemented")

async def test_sftp_connection(connection_details: Dict[str, Any]) -> Dict[str, Any]:
    """
    Test SFTP connection.
    """
    # Implement SFTP connection test
    raise NotImplementedError("SFTP connection testing not implemented")

async def test_api_connection(connection_details: Dict[str, Any]) -> Dict[str, Any]:
    """
    Test API connection.
    """
    # Implement API connection test
    raise NotImplementedError("API connection testing not implemented")

async def test_email_connection(connection_details: Dict[str, Any]) -> Dict[str, Any]:
    """
    Test email connection.
    """
    # Implement email connection test
    raise NotImplementedError("Email connection testing not implemented")
