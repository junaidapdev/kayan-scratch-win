import { Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';
import { ROUTES } from '@/constants/routes';

export default function NotFoundPage(): JSX.Element {
  const { t } = useTranslation();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-5xl font-bold text-brand">404</h1>
      <p className="mt-3 text-gray-600">{t('common.comingSoon')}</p>
      <Link
        to={ROUTES.CUSTOMER.SCAN}
        className="mt-6 text-sm font-medium text-brand underline"
      >
        {t('common.back')}
      </Link>
    </main>
  );
}
