import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { env } from '@/config/env';
import {
  AUTH_TOKEN_STORAGE_KEY,
  API_TIMEOUT_MS,
} from '@/constants/ui';
import {
  ERROR_CODES,
  ERROR_MESSAGES,
  type BilingualMessage,
  type ErrorCode,
} from '@/constants/errors';
import { logger } from './logger';

// Mirrors the backend's ApiResponse wrapper from src/lib/apiResponse.ts.
export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiFailure {
  success: false;
  error: {
    code: string;
    message: BilingualMessage;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/**
 * Typed error thrown when the backend returns `{ success: false }` or the
 * request fails at the network layer. Components catch this to display the
 * appropriate bilingual message.
 */
export class ApiCallError extends Error {
  public readonly code: string;
  public readonly bilingualMessage: BilingualMessage;
  public readonly status?: number;
  public readonly details?: unknown;

  constructor(
    code: string,
    bilingualMessage: BilingualMessage,
    status?: number,
    details?: unknown,
  ) {
    super(bilingualMessage.en);
    this.name = 'ApiCallError';
    this.code = code;
    this.bilingualMessage = bilingualMessage;
    this.status = status;
    this.details = details;
  }
}

function fallbackMessage(code: ErrorCode): BilingualMessage {
  return ERROR_MESSAGES[code];
}

export const api: AxiosInstance = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token (if any) to every outbound request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap the ApiResponse envelope: resolve with `data` on success, reject with
// an ApiCallError on structured failure or network error.
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    const body = response.data;

    if (!body || typeof body !== 'object' || !('success' in body)) {
      // Endpoint did not honor the ApiResponse contract. Treat as unknown error.
      logger.error('Non-envelope response', { url: response.config.url, body });
      throw new ApiCallError(
        ERROR_CODES.UNKNOWN,
        fallbackMessage(ERROR_CODES.UNKNOWN),
        response.status,
      );
    }

    if (body.success) {
      // Replace the AxiosResponse.data with the unwrapped payload so callers
      // receive T directly via `const data = (await api.get(...)).data`.
      return { ...response, data: body.data } as AxiosResponse<unknown>;
    }

    throw new ApiCallError(
      body.error.code,
      body.error.message,
      response.status,
      body.error.details,
    );
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    // If the server responded with our envelope, surface that structured error.
    const body = error.response?.data;
    if (
      body &&
      typeof body === 'object' &&
      'success' in body &&
      body.success === false
    ) {
      throw new ApiCallError(
        body.error.code,
        body.error.message,
        error.response?.status,
        body.error.details,
      );
    }

    // Map status codes without an envelope to generic codes.
    const status = error.response?.status;
    let code: ErrorCode = ERROR_CODES.UNKNOWN;
    if (!error.response) code = ERROR_CODES.NETWORK_ERROR;
    else if (status === 401) code = ERROR_CODES.UNAUTHORIZED;
    else if (status === 403) code = ERROR_CODES.FORBIDDEN;
    else if (status === 404) code = ERROR_CODES.NOT_FOUND;
    else if (status === 429) code = ERROR_CODES.RATE_LIMITED;
    else if (status && status >= 500) code = ERROR_CODES.INTERNAL_ERROR;

    logger.error('API error', { url: error.config?.url, status, code });
    throw new ApiCallError(code, fallbackMessage(code), status);
  },
);

/**
 * Thin typed helpers so callers don't have to redeclare `AxiosResponse<T>`
 * everywhere. All return the unwrapped T.
 */
export const http = {
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const res = await api.get<T, AxiosResponse<T>>(url, { params });
    return res.data;
  },
  post: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await api.post<T, AxiosResponse<T>>(url, body);
    return res.data;
  },
  put: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await api.put<T, AxiosResponse<T>>(url, body);
    return res.data;
  },
  patch: async <T>(url: string, body?: unknown): Promise<T> => {
    const res = await api.patch<T, AxiosResponse<T>>(url, body);
    return res.data;
  },
  delete: async <T>(url: string): Promise<T> => {
    const res = await api.delete<T, AxiosResponse<T>>(url);
    return res.data;
  },
};
