import { useTranslation } from '@/lib/i18n';

export default function AdminPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
        <p className="mt-3 text-base text-gray-600">{t('admin.description')}</p>
        <p className="mt-10 text-sm uppercase tracking-wider text-gray-400">
          {t('status.comingSoon')}
        </p>
      </div>
    </main>
  );
}
