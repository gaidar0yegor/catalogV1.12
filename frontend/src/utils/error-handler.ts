import axios, { AxiosError } from 'axios';
import type { ApiResponse } from '../types';

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;
    const data = error.response?.data;

    // Handle specific error cases
    switch (status) {
      case 401:
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
        return new ApiError('Session expired. Please login again.', status, data);
      case 403:
        return new ApiError('You do not have permission to perform this action.', status, data);
      case 404:
        return new ApiError('The requested resource was not found.', status, data);
      case 422:
        return new ApiError('Invalid data provided.', status, data);
      default:
        if (status >= 500) {
          return new ApiError('An unexpected server error occurred.', status, data);
        }
        return new ApiError(message, status, data);
    }
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500);
  }

  return new ApiError('An unknown error occurred.', 500);
}

export function formatApiError(error: ApiError): string {
  if (error.data?.errors) {
    // Handle validation errors
    return Object.entries(error.data.errors)
      .map(([field, messages]) => `${field}: ${messages}`)
      .join('\n');
  }

  return error.message;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    message,
  };
}

export function createErrorResponse<T>(error: string): ApiResponse<T> {
  return {
    data: null as unknown as T,
    error,
  };
}
