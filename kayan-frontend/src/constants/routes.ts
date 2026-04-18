export const ROUTES = {
  ROOT: '/',
  CUSTOMER: {
    SCAN: '/scan',
    VERIFY: '/verify',
    CARD: '/card',
  },
  ADMIN: {
    ROOT: '/admin',
    LOGIN: '/admin/login',
    DASHBOARD: '/admin/dashboard',
    CUSTOMERS: '/admin/customers',
    REWARDS: '/admin/rewards',
    BRANCHES: '/admin/branches',
  },
  NOT_FOUND: '*',
} as const;
