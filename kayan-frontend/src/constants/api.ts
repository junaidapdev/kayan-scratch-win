/**
 * Endpoint paths for the backend. Path-builder helpers keep every URL
 * template in one file, honoring the "no magic strings" rule.
 */
export const API_ENDPOINTS = {
  HEALTH: '/health',

  AUTH: {
    REQUEST_OTP: '/auth/otp/request',
    VERIFY_OTP: '/auth/otp/verify',
    LOGOUT: '/auth/logout',
  },

  CUSTOMERS: {
    LIST: '/customers',
    DETAIL: (id: string): string => `/customers/${id}`,
    ME: '/customers/me',
    REGISTER: '/customers/register',
    MY_REWARDS: '/customers/me/rewards',
  },

  VISITS: {
    LIST: '/visits',
    SCAN: '/visits/scan',
    SCAN_LOOKUP: '/visits/scan/lookup',
  },

  REWARDS: {
    LIST: '/rewards',
    DETAIL: (code: string): string => `/rewards/${code}`,
    REDEEM_STEP_1: (code: string): string =>
      `/rewards/${code}/confirm-redeem-step-1`,
    REDEEM_STEP_2: (code: string): string =>
      `/rewards/${code}/confirm-redeem-step-2`,
  },

  BRANCHES: {
    LIST: '/branches',
    DETAIL: (id: string): string => `/branches/${id}`,
  },

  ADMIN: {
    LOGIN: '/admin/login',
    METRICS: '/admin/metrics',
  },
} as const;
