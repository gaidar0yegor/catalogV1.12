import json
import csv
import io
import pandas as pd
from typing import Dict, Any, Tuple, List
from fastapi import HTTPException

class FileProcessor:
    """Handles processing of different file formats for catalog import"""
    
    @staticmethod
    def detect_file_type(filename: str) -> str:
        """Detect file type from filename"""
        extension = filename.rsplit('.', 1)[1].lower()
        if extension in ['csv']:
            return 'csv'
        elif extension in ['xls', 'xlsx']:
            return 'excel'
        elif extension in ['json']:
            return 'json'
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {extension}"
            )

    @staticmethod
    def process_file(content: bytes, file_type: str) -> Tuple[List[Dict[str, Any]], Dict[str, str]]:
        """Process file content and return data and schema"""
        if file_type == 'csv':
            return FileProcessor._process_csv(content)
        elif file_type == 'excel':
            return FileProcessor._process_excel(content)
        elif file_type == 'json':
            return FileProcessor._process_json(content)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file_type}"
            )

    @staticmethod
    def _process_csv(content: bytes) -> Tuple[List[Dict[str, Any]], Dict[str, str]]:
        """Process CSV file content"""
        try:
            # Read CSV content
            text_content = content.decode('utf-8')
            csv_file = io.StringIO(text_content)
            csv_reader = csv.DictReader(csv_file)
            
            # Extract data
            data = list(csv_reader)
            
            # Detect schema from first row
            if not data:
                raise HTTPException(
                    status_code=400,
                    detail="CSV file is empty"
                )
            
            schema = {
                field: FileProcessor._detect_field_type(data[0].get(field, ''))
                for field in data[0].keys()
            }
            
            return data, schema
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error processing CSV file: {str(e)}"
            )

    @staticmethod
    def _process_excel(content: bytes) -> Tuple[List[Dict[str, Any]], Dict[str, str]]:
        """Process Excel file content"""
        try:
            # Read Excel content
            df = pd.read_excel(io.BytesIO(content))
            
            # Convert to list of dictionaries
            data = df.to_dict('records')
            
            # Detect schema from first row
            if not data:
                raise HTTPException(
                    status_code=400,
                    detail="Excel file is empty"
                )
            
            schema = {
                str(field): FileProcessor._detect_field_type(data[0].get(field, ''))
                for field in data[0].keys()
            }
            
            return data, schema
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error processing Excel file: {str(e)}"
            )

    @staticmethod
    def _process_json(content: bytes) -> Tuple[List[Dict[str, Any]], Dict[str, str]]:
        """Process JSON file content"""
        try:
            # Parse JSON content
            data = json.loads(content.decode('utf-8'))
            
            # Ensure data is a list of objects
            if not isinstance(data, list):
                data = [data]
            
            if not data:
                raise HTTPException(
                    status_code=400,
                    detail="JSON file is empty"
                )
            
            # Detect schema from first object
            schema = {
                field: FileProcessor._detect_field_type(data[0].get(field, ''))
                for field in data[0].keys()
            }
            
            return data, schema
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Error processing JSON file: {str(e)}"
            )

    @staticmethod
    def _detect_field_type(value: Any) -> str:
        """Detect the type of a field value"""
        if isinstance(value, bool):
            return "boolean"
        elif isinstance(value, int):
            return "integer"
        elif isinstance(value, float):
            return "number"
        elif isinstance(value, dict):
            return "object"
        elif isinstance(value, list):
            return "array"
        else:
            return "string"

    @staticmethod
    def apply_transformations(
        data: List[Dict[str, Any]],
        mappings: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Apply column mappings and transformations to data"""
        transformed_data = []
        
        for row in data:
            transformed_row = {}
            for mapping in mappings:
                source = mapping['source_column']
                target = mapping['target_column']
                rule = mapping.get('transformation_rule')
                
                # Get value using source column
                value = row.get(source)
                
                # Apply transformation if rule exists
                if rule and value is not None:
                    value = FileProcessor._apply_transformation(value, rule)
                
                transformed_row[target] = value
            
            transformed_data.append(transformed_row)
        
        return transformed_data

    @staticmethod
    def _apply_transformation(value: Any, rule: Dict[str, Any]) -> Any:
        """Apply a transformation rule to a value"""
        rule_type = rule.get('type')
        
        if rule_type == 'uppercase':
            return str(value).upper()
        elif rule_type == 'lowercase':
            return str(value).lower()
        elif rule_type == 'number':
            try:
                return float(value)
            except (ValueError, TypeError):
                return 0.0
        elif rule_type == 'boolean':
            return bool(value)
        elif rule_type == 'replace':
            return str(value).replace(
                rule.get('find', ''),
                rule.get('replace', '')
            )
        else:
            return value
