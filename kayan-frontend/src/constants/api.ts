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
  },

  VISITS: {
    LIST: '/visits',
    SCAN: '/visits/scan',
  },

  REWARDS: {
    LIST: '/rewards',
    DETAIL: (id: string): string => `/rewards/${id}`,
    REDEEM: (id: string): string => `/rewards/${id}/redeem`,
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
