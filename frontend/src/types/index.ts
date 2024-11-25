export interface ApiResponse<T> {
  data: T;
  message: string | null;
}

export interface User {
  id: number;
  email: string;
}

export interface Catalog {
  id: number;
  name: string;
  description: string | null;
  source_type: string;
  schema: Record<string, string>;
  created_by: number | null;
  created_at: string;
  updated_at: string | null;
  column_mappings: ColumnMapping[];
}

export interface ColumnMapping {
  id?: number;
  catalog_id?: number;
  source_column: string;
  target_column: string;
  transformation_rule: TransformationRule | null;
  created_at?: string;
  updated_at?: string | null;
}

export interface TransformationRule {
  type: 'uppercase' | 'lowercase' | 'number' | 'boolean' | 'replace';
  find?: string;
  replace?: string;
}

export interface CatalogData {
  id: number;
  catalog_id: number;
  data: Record<string, any>;
  created_at: string;
  updated_at: string | null;
}
