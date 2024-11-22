from fastapi import APIRouter
from .endpoints import suppliers, catalogs, imports, fields

api_router = APIRouter()

api_router.include_router(
    suppliers.router,
    prefix="/suppliers",
    tags=["suppliers"]
)

api_router.include_router(
    catalogs.router,
    prefix="/catalogs",
    tags=["catalogs"]
)

api_router.include_router(
    imports.router,
    prefix="/imports",
    tags=["imports"]
)

api_router.include_router(
    fields.router,
    prefix="/fields",
    tags=["fields"]
)
