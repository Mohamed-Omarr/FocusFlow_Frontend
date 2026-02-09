'use client';

import { useTranslations } from 'next-intl';

export function PrivacyPolicy() {
  const t = useTranslations("landing.privacyPolicy");

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
      <p className="mb-4">
        {t('effective_date', { date: new Date() })}
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.introduction.title')}</h2>
      <p className="mb-4">{t('sections.introduction.content')}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.information_collected.title')}</h2>
      <p className="mb-4">
        <strong>Personal Information:</strong> {t('sections.information_collected.personal_information')}
      </p>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.how_we_use.title')}</h2>
      <ul className="list-disc list-inside mb-4">
        <li>{t('sections.how_we_use.item1')}</li>
        <li>{t('sections.how_we_use.item2')}</li>
        <li>{t('sections.how_we_use.item3')}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.sharing_information.title')}</h2>
      <ul className="list-disc list-inside mb-4">
        <li>{t('sections.sharing_information.item1')}</li>
        <li>{t('sections.sharing_information.item2')}</li>
        <li>{t('sections.sharing_information.item3')}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.rights.title')}</h2>
      <ul className="list-disc list-inside mb-4">
        <li>{t('sections.rights.item1')}</li>
        <li>{t('sections.rights.item2')}</li>
      </ul>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.data_security.title')}</h2>
      <p className="mb-4">{t('sections.data_security.content')}</p>

      <h2 className="text-xl font-semibold mt-4 mb-2">{t('sections.changes_to_policy.title')}</h2>
      <p className="mb-4">{t('sections.changes_to_policy.content')}</p>
    </div>
  );
}
