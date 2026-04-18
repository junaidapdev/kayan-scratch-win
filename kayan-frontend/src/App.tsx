import { Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';
import ScanPage from '@/pages/ScanPage';
import AdminPage from '@/pages/AdminPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App(): JSX.Element {
  return (
    <Routes>
      <Route
        path={ROUTES.ROOT}
        element={<Navigate to={ROUTES.CUSTOMER.SCAN} replace />}
      />
      <Route path={ROUTES.CUSTOMER.SCAN} element={<ScanPage />} />
      <Route path={ROUTES.ADMIN.ROOT} element={<AdminPage />} />
      <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
    </Routes>
  );
}
