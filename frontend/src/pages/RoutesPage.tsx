import React from 'react'
import { useTranslation } from 'react-i18next'
import { RouteGenerator } from '../components/RouteGenerator'

export function RoutesPage(): React.ReactElement {
  const { t } = useTranslation()

  return (
    <div className="space-y-8">
      {/* Route Generator Section */}
      <section className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6">
        <h2 className="text-2xl font-bold mb-4">{t('routes.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {t('routes.description')}
        </p>
        <RouteGenerator />
      </section>
    </div>
  )
}