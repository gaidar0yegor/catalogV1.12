from celery import Task
from sqlalchemy.orm import Session
from typing import Dict, Any, List
import pandas as pd
import json
from ..core.database import SessionLocal, minio_client, celery_app
from ..models.catalog import Catalog, Product, ImportJob
from ..core.config import settings
import io
import traceback

class DatabaseTask(Task):
    _db = None

    @property
    def db(self) -> Session:
        if self._db is None:
            self._db = SessionLocal()
        return self._db

    def after_return(self, *args, **kwargs):
        if self._db is not None:
            self._db.close()
            self._db = None

@celery_app.task(base=DatabaseTask, bind=True)
def process_catalog_file(self, catalog_id: int, job_id: int, file_path: str):
    """
    Process an uploaded catalog file and detect columns.
    """
    try:
        # Update job status
        job = self.db.query(ImportJob).get(job_id)
        job.status = "processing"
        job.started_at = datetime.utcnow()
        self.db.commit()

        # Get file from MinIO
        try:
            obj = minio_client.get_object(settings.MINIO_BUCKET_NAME, file_path)
            file_data = obj.read()
        except Exception as e:
            raise Exception(f"Error reading file from MinIO: {str(e)}")

        # Process file based on type
        catalog = self.db.query(Catalog).get(catalog_id)
        if catalog.import_type == "csv":
            df = pd.read_csv(io.BytesIO(file_data))
        elif catalog.import_type == "excel":
            df = pd.read_excel(io.BytesIO(file_data))
        elif catalog.import_type == "json":
            data = json.loads(file_data)
            df = pd.DataFrame(data)
        else:
            raise Exception(f"Unsupported file type: {catalog.import_type}")

        # Update job with total rows
        job.total_rows = len(df)
        self.db.commit()

        # Detect and store columns
        columns = list(df.columns)
        catalog.detected_columns = columns
        self.db.commit()

        # Update job status
        job.status = "completed"
        job.completed_at = datetime.utcnow()
        self.db.commit()

        return {
            "status": "success",
            "columns": columns,
            "row_count": len(df)
        }

    except Exception as e:
        # Log error and update job status
        error_details = {
            "error": str(e),
            "traceback": traceback.format_exc()
        }
        
        job = self.db.query(ImportJob).get(job_id)
        job.status = "failed"
        job.error_log = error_details
        job.completed_at = datetime.utcnow()
        self.db.commit()

        raise

@celery_app.task(base=DatabaseTask, bind=True)
def process_mapped_catalog(self, catalog_id: int, job_id: int):
    """
    Process a catalog after field mapping is complete.
    """
    try:
        # Get catalog and job
        catalog = self.db.query(Catalog).get(catalog_id)
        job = self.db.query(ImportJob).get(job_id)

        # Update status
        job.status = "processing"
        job.started_at = datetime.utcnow()
        self.db.commit()

        # Get file from MinIO
        file_path = catalog.file_path
        try:
            obj = minio_client.get_object(settings.MINIO_BUCKET_NAME, file_path)
            file_data = obj.read()
        except Exception as e:
            raise Exception(f"Error reading file from MinIO: {str(e)}")

        # Process file based on type
        if catalog.import_type == "csv":
            df = pd.read_csv(io.BytesIO(file_data))
        elif catalog.import_type == "excel":
            df = pd.read_excel(io.BytesIO(file_data))
        elif catalog.import_type == "json":
            data = json.loads(file_data)
            df = pd.DataFrame(data)
        else:
            raise Exception(f"Unsupported file type: {catalog.import_type}")

        # Update total rows
        job.total_rows = len(df)
        self.db.commit()

        # Process rows in batches
        batch_size = 1000
        error_count = 0
        processed_count = 0

        for i in range(0, len(df), batch_size):
            batch_df = df.iloc[i:i+batch_size]
            
            try:
                # Process batch
                products = []
                for _, row in batch_df.iterrows():
                    try:
                        # Map fields according to catalog.field_mappings
                        product_data = {}
                        for source_field, target_field in catalog.field_mappings.items():
                            if source_field in row:
                                product_data[target_field] = row[source_field]

                        # Create product
                        product = Product(
                            catalog_id=catalog_id,
                            sku=product_data.get('sku', f"SKU_{processed_count}"),
                            data=product_data
                        )
                        products.append(product)
                        processed_count += 1

                    except Exception as e:
                        error_count += 1
                        if not job.error_log:
                            job.error_log = []
                        job.error_log.append({
                            "row": processed_count,
                            "error": str(e)
                        })

                # Bulk insert products
                if products:
                    self.db.bulk_save_objects(products)
                    self.db.commit()

                # Update job progress
                job.processed_rows = processed_count
                job.error_count = error_count
                self.db.commit()

            except Exception as e:
                self.db.rollback()
                raise Exception(f"Error processing batch: {str(e)}")

        # Update final status
        job.status = "completed"
        job.completed_at = datetime.utcnow()
        catalog.status = "completed"
        catalog.processed_at = datetime.utcnow()
        self.db.commit()

        return {
            "status": "success",
            "processed_rows": processed_count,
            "error_count": error_count
        }

    except Exception as e:
        # Log error and update status
        error_details = {
            "error": str(e),
            "traceback": traceback.format_exc()
        }
        
        job.status = "failed"
        job.error_log = error_details
        job.completed_at = datetime.utcnow()
        catalog.status = "failed"
        self.db.commit()

        raise

@celery_app.task(base=DatabaseTask, bind=True)
def cleanup_old_catalogs(self):
    """
    Cleanup old catalog files and data.
    """
    try:
        # Find old catalogs (e.g., older than 30 days)
        threshold_date = datetime.utcnow() - timedelta(days=30)
        old_catalogs = self.db.query(Catalog)\
            .filter(Catalog.created_at < threshold_date)\
            .all()

        for catalog in old_catalogs:
            try:
                # Delete associated files from MinIO
                prefix = f"catalogs/{catalog.supplier_id}/{catalog.id}/"
                objects = minio_client.list_objects(
                    settings.MINIO_BUCKET_NAME,
                    prefix=prefix
                )
                for obj in objects:
                    minio_client.remove_object(
                        settings.MINIO_BUCKET_NAME,
                        obj.object_name
                    )

                # Delete database records
                self.db.query(Product)\
                    .filter(Product.catalog_id == catalog.id)\
                    .delete()
                self.db.query(ImportJob)\
                    .filter(ImportJob.catalog_id == catalog.id)\
                    .delete()
                self.db.delete(catalog)
                self.db.commit()

            except Exception as e:
                self.db.rollback()
                print(f"Error cleaning up catalog {catalog.id}: {str(e)}")

        return {"status": "success", "cleaned_catalogs": len(old_catalogs)}

    except Exception as e:
        print(f"Error in cleanup task: {str(e)}")
        raise
