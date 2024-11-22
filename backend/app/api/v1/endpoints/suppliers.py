from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ....core.database import get_db
from ....schemas.supplier import (
    Supplier,
    SupplierCreate,
    SupplierUpdate,
    SupplierResponse,
    SupplierListResponse
)
from ....services import supplier_service

router = APIRouter()

@router.post("/", response_model=SupplierResponse)
async def create_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new supplier with the provided details.
    """
    try:
        db_supplier = await supplier_service.create_supplier(db, supplier)
        return SupplierResponse(
            supplier=db_supplier,
            message="Supplier created successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error creating supplier: {str(e)}"
        )

@router.get("/", response_model=SupplierListResponse)
async def list_suppliers(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    is_active: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve a list of suppliers with optional filtering and pagination.
    """
    try:
        suppliers, total = await supplier_service.get_suppliers(
            db,
            skip=skip,
            limit=limit,
            search=search,
            is_active=is_active
        )
        return SupplierListResponse(
            suppliers=suppliers,
            total=total,
            page=skip // limit + 1,
            page_size=limit,
            message="Suppliers retrieved successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error retrieving suppliers: {str(e)}"
        )

@router.get("/{supplier_id}", response_model=SupplierResponse)
async def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific supplier by ID.
    """
    supplier = await supplier_service.get_supplier(db, supplier_id)
    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )
    return SupplierResponse(
        supplier=supplier,
        message="Supplier retrieved successfully"
    )

@router.put("/{supplier_id}", response_model=SupplierResponse)
async def update_supplier(
    supplier_id: int,
    supplier_update: SupplierUpdate,
    db: Session = Depends(get_db)
):
    """
    Update a specific supplier's details.
    """
    try:
        updated_supplier = await supplier_service.update_supplier(
            db,
            supplier_id,
            supplier_update
        )
        if not updated_supplier:
            raise HTTPException(
                status_code=404,
                detail="Supplier not found"
            )
        return SupplierResponse(
            supplier=updated_supplier,
            message="Supplier updated successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error updating supplier: {str(e)}"
        )

@router.delete("/{supplier_id}", response_model=SupplierResponse)
async def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a specific supplier.
    """
    try:
        supplier = await supplier_service.delete_supplier(db, supplier_id)
        if not supplier:
            raise HTTPException(
                status_code=404,
                detail="Supplier not found"
            )
        return SupplierResponse(
            supplier=supplier,
            message="Supplier deleted successfully"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error deleting supplier: {str(e)}"
        )

@router.post("/{supplier_id}/test-connection", response_model=dict)
async def test_supplier_connection(
    supplier_id: int,
    db: Session = Depends(get_db)
):
    """
    Test the connection to a supplier's data source.
    """
    try:
        result = await supplier_service.test_connection(db, supplier_id)
        return {
            "status": "success",
            "message": "Connection test successful",
            "details": result
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Connection test failed: {str(e)}"
        )
