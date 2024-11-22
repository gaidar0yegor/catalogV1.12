import axios from 'axios';
import type { ApiResponse, Catalog, ColumnMapping } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Catalog API endpoints
export const catalogApi = {
  // Get all catalogs
  getAll: async (): Promise<ApiResponse<Catalog[]>> => {
    const response = await api.get('/catalogs');
    return response.data;
  },

  // Get a single catalog by ID
  getById: async (id: number): Promise<ApiResponse<Catalog>> => {
    const response = await api.get(`/catalogs/${id}`);
    return response.data;
  },

  // Create a new catalog
  create: async (data: FormData): Promise<ApiResponse<Catalog>> => {
    const response = await api.post('/catalogs', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update catalog mapping
  updateMapping: async (
    id: number,
    mappings: ColumnMapping[]
  ): Promise<ApiResponse<Catalog>> => {
    const response = await api.put(`/catalogs/${id}/mapping`, { mappings });
    return response.data;
  },

  // Delete a catalog
  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/catalogs/${id}`);
    return response.data;
  },

  // Import catalog data
  import: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.post(`/catalogs/${id}/import`);
    return response.data;
  },

  // Export catalog data
  export: async (id: number, format: string): Promise<Blob> => {
    const response = await api.get(`/catalogs/${id}/export`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

// Auth API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export default api;
