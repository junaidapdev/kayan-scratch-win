import { Navigate, Route, Routes } from 'react-router-dom';

import { RouteGuard } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import AdminPage from '@/pages/AdminPage';
import NotFoundPage from '@/pages/NotFoundPage';
import {
  LockoutPage,
  PhonePage,
  PlaceholderPage,
  RegisterDetailsPage,
  RegisterOtpPage,
  RewardClaimPage,
  RewardConfirmPage,
  RewardDonePage,
  RewardsPage,
  ScanAmountPage,
  ScanLandingPage,
  StampSuccessPage,
} from '@/pages/customer';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route
        path={ROUTES.ROOT}
        element={<Navigate to={ROUTES.CUSTOMER.SCAN} replace />}
      />

      {/* Public entry flow */}
      <Route path={ROUTES.CUSTOMER.SCAN} element={<ScanLandingPage />} />
      <Route path={ROUTES.CUSTOMER.PHONE} element={<PhonePage />} />
      <Route
        path={ROUTES.CUSTOMER.REGISTER_OTP}
        element={<RegisterOtpPage />}
      />

      {/* Registration completes the customer session — guarded on the
          registration token issued by /auth/otp/verify. */}
      <Route
        path={ROUTES.CUSTOMER.REGISTER_DETAILS}
        element={
          <RouteGuard require="registration-token">
            <RegisterDetailsPage />
          </RouteGuard>
        }
      />

      {/* Amount entry requires the 5-min scan JWT. */}
      <Route
        path={ROUTES.CUSTOMER.SCAN_AMOUNT}
        element={
          <RouteGuard require="scan-token">
            <ScanAmountPage />
          </RouteGuard>
        }
      />

      {/* Stamp success & lockout are reachable from both the register and the
          scan flows; the stamp/lockout data rides on navigation state so the
          pages enforce their own "open directly → /scan" fallback. */}
      <Route
        path={ROUTES.CUSTOMER.STAMP_SUCCESS}
        element={<StampSuccessPage />}
      />
      <Route path={ROUTES.CUSTOMER.LOCKOUT} element={<LockoutPage />} />

      {/* The rewards surfaces require the long-lived session JWT. */}
      <Route
        path={ROUTES.CUSTOMER.REWARDS}
        element={
          <RouteGuard require="session">
            <RewardsPage />
          </RouteGuard>
        }
      />
      <Route
        path={ROUTES.CUSTOMER.REWARD_CLAIM_PATTERN}
        element={
          <RouteGuard require="session">
            <RewardClaimPage />
          </RouteGuard>
        }
      />
      <Route
        path={ROUTES.CUSTOMER.REWARD_CONFIRM_PATTERN}
        element={
          <RouteGuard require="session">
            <RewardConfirmPage />
          </RouteGuard>
        }
      />
      <Route
        path={ROUTES.CUSTOMER.REWARD_DONE_PATTERN}
        element={
          <RouteGuard require="session">
            <RewardDonePage />
          </RouteGuard>
        }
      />

      {/* Profile lands with the admin chunk — placeholder for now. */}
      <Route
        path={ROUTES.CUSTOMER.PROFILE}
        element={
          <RouteGuard require="session">
            <PlaceholderPage titleKey="Profile" />
          </RouteGuard>
        }
      />

      <Route path={ROUTES.ADMIN.ROOT} element={<AdminPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}
