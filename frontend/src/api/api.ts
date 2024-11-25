import axios from 'axios';
import type { ApiResponse, Catalog, ColumnMapping } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // Add this for CORS with credentials
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add trailing slash to URLs
    if (config.url && !config.url.endsWith('/')) {
      config.url += '/';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 307 && error.response.headers?.location) {
      try {
        const response = await axiosInstance.get(error.response.headers.location);
        return response;
      } catch (redirectError) {
        return Promise.reject(redirectError);
      }
    }
    return Promise.reject(error);
  }
);

// Catalog API endpoints
export const catalogApi = {
  // Get all catalogs
  getAll: async () => {
    const response = await axiosInstance.get<ApiResponse<Catalog[]>>('/catalogs/');
    return response.data;
  },

  // Get a single catalog by ID
  getById: async (id: number) => {
    const response = await axiosInstance.get<ApiResponse<Catalog>>(`/catalogs/${id}/`);
    return response.data;
  },

  // Create a new catalog
  create: async (data: FormData) => {
    const response = await axiosInstance.post<ApiResponse<Catalog>>('/catalogs/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update catalog mapping
  updateMapping: async (id: number, mappings: ColumnMapping[]) => {
    const response = await axiosInstance.put<ApiResponse<Catalog>>(`/catalogs/${id}/mapping/`, { mappings });
    return response.data;
  },

  // Delete a catalog
  delete: async (id: number) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(`/catalogs/${id}/`);
    return response.data;
  },

  // Import catalog data
  import: async (id: number) => {
    const response = await axiosInstance.post<ApiResponse<void>>(`/catalogs/${id}/import/`);
    return response.data;
  },

  // Export catalog data
  export: async (id: number, format: string) => {
    const response = await axiosInstance.get<Blob>(`/catalogs/${id}/export/`, {
      params: { format },
      responseType: 'blob',
    });
    return response.data;
  },
};

// Auth API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post<ApiResponse<{ token: string }>>('/auth/login/', { email, password });
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get<ApiResponse<{ email: string; id: number }>>('/auth/me/');
    return response.data;
  },
};

export default axiosInstance;
