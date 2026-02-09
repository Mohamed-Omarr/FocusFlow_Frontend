'use client';

import { useTranslations } from 'next-intl';

export function TermsOfService() {
  const t = useTranslations("landing.termsOfService");

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <p className="mb-4">
        {t('effective_date', { date: new Date() })}
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.acceptance.title')}</h2>
      <p className="mb-4">{t('sections.acceptance.content')}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.use_of_service.title')}</h2>
      <ul className="list-disc list-inside mb-4">
        <li>{t('sections.use_of_service.item1')}</li>
        <li>{t('sections.use_of_service.item2')}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.account_responsibility.title')}</h2>
      <ul className="list-disc list-inside mb-4">
        <li>{t('sections.account_responsibility.item1')}</li>
        <li>{t('sections.account_responsibility.item2')}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.content.title')}</h2>
      <ul className="list-disc list-inside mb-4">
        <li>{t('sections.content.item1')}</li>
        <li>{t('sections.content.item2')}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.prohibited_activities.title')}</h2>
      <ul className="list-disc list-inside mb-4">
        <li>{t('sections.prohibited_activities.item1')}</li>
        <li>{t('sections.prohibited_activities.item2')}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.termination.title')}</h2>
      <p className="mb-4">{t('sections.termination.content')}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.disclaimer_liability.title')}</h2>
      <p className="mb-4">{t('sections.disclaimer_liability.content')}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.governing_law.title')}</h2>
      <p className="mb-4">{t('sections.governing_law.content')}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.changes_to_terms.title')}</h2>
      <p className="mb-4">{t('sections.changes_to_terms.content')}</p>
    </div>
  );
}
