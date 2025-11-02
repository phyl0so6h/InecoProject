import React from 'react'
import { useTranslation } from 'react-i18next'
import { TravelPlans } from '../components/TravelPlans'

export function TravelPlansPage(): React.ReactElement {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('nav.travelPlans')}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('travel.subtitle')}
        </p>
      </div>
      
      {/* Travel Plans Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <TravelPlans />
      </div>
    </div>
  )
}
