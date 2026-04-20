import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import App from './App';
import { TOAST_DURATION_MS } from '@/constants/ui';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import { CustomerAuthProvider } from '@/contexts/CustomerAuthContext';
import './lib/i18n';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found in index.html');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      <CustomerAuthProvider>
        <AdminAuthProvider>
          <App />
          <Toaster
          position="top-center"
          richColors
          duration={TOAST_DURATION_MS}
          toastOptions={{
            style: {
              fontFamily:
                '"DM Sans", system-ui, "Noto Sans Arabic", sans-serif',
            },
            }}
          />
        </AdminAuthProvider>
      </CustomerAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
