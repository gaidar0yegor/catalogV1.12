// Catalog Types
export interface Catalog {
  id: number;
  name: string;
  description: string;
  sourceType: string;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogColumn {
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

export interface ColumnMapping {
  sourceColumn: string;
  targetColumn: string;
  transformationRule?: string;
}

// User Types
export interface User {
  id: number;
  email: string;
  fullName: string;
  isActive: boolean;
  isSuperuser: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Theme Types
export interface ThemeMode {
  mode: 'light' | 'dark';
}

// Form Types
export interface ImportSettings {
  sourceType: string;
  file: File | null;
  columnMappings: ColumnMapping[];
}
