import React from 'react'
import { useTranslation } from 'react-i18next'
import { Info } from '../components/Info'

export function InfoPage(): React.ReactElement {
  const { t } = useTranslation()
  return (
    <section className="rounded-xl border border-neutral-200/60 dark:border-neutral-800 p-6">
      <h2 className="text-xl font-semibold mb-2">{t('info.title')}</h2>
      <Info />
    </section>
  )
}


