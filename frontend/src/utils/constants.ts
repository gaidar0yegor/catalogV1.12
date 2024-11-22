// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY_KEY: 'token_expiry',
};

// File Upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: {
    CSV: '.csv',
    EXCEL: '.xlsx,.xls',
    JSON: '.json',
  },
  CHUNK_SIZE: 1024 * 1024, // 1MB for chunked uploads
};

// Pagination
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  DATETIME_DISPLAY: 'MMM DD, YYYY HH:mm',
  DATETIME_API: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
};

// Validation Rules
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 50,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  UNAUTHORIZED: 'Your session has expired. Please log in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  FILE_TOO_LARGE: 'The selected file is too large.',
  INVALID_FILE_TYPE: 'The selected file type is not supported.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CATALOG_CREATED: 'Catalog created successfully.',
  CATALOG_UPDATED: 'Catalog updated successfully.',
  CATALOG_DELETED: 'Catalog deleted successfully.',
  IMPORT_COMPLETE: 'Import completed successfully.',
  EXPORT_COMPLETE: 'Export completed successfully.',
  SETTINGS_SAVED: 'Settings saved successfully.',
};

// Feature Flags
export const FEATURES = {
  ENABLE_AUTH: import.meta.env.VITE_ENABLE_AUTH === 'true',
  ENABLE_DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CATALOGS: '/catalogs',
  CATALOG_IMPORT: '/import',
  SETTINGS: '/settings',
  PROFILE: '/profile',
};
