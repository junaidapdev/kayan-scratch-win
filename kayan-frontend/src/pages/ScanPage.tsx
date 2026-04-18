import { useTranslation } from '@/lib/i18n';

export default function ScanPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <div className="max-w-md">
        <h1 className="text-3xl font-bold text-brand">
          {t('customer.scan.title')}
        </h1>
        <p className="mt-3 text-base text-gray-600">
          {t('customer.scan.description')}
        </p>
        <p className="mt-10 text-sm uppercase tracking-wider text-gray-400">
          {t('common.comingSoon')}
        </p>
      </div>
    </main>
  );
}
