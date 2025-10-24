import React from 'react'
import { useTranslation } from 'react-i18next'
import { ArmeniaSVG } from '../components/ArmeniaSVG'
import { motion } from 'framer-motion'

export function HomePage(): React.ReactElement {
  const { t } = useTranslation()
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-8 md:p-12"
      >
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/events"
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
            >
              {t('home.cta.events')}
            </a>
            <a 
              href="/routes"
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors text-center"
            >
              {t('home.cta.routes')}
            </a>
          </div>
        </div>
      </motion.section>

      {/* Feature Cards */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="card-hover bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-3">🎭</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('nav.events')}</h3>
          <p className="text-gray-600 dark:text-gray-400">{t('home.features.events.desc')}</p>
        </div>
        
        <div className="card-hover bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-3">🏔️</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('nav.routes')}</h3>
          <p className="text-gray-600 dark:text-gray-400">{t('home.features.routes.desc')}</p>
        </div>
        
        <div className="card-hover bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-4xl mb-3">🤝</div>
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.features.friends')}</h3>
          <p className="text-gray-600 dark:text-gray-400">{t('home.features.friends.desc')}</p>
        </div>
      </motion.section>

      {/* Interactive Armenia Map */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{t('home.regions.title')}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('home.regions.subtitle')}
          </p>
        </div>
        <ArmeniaSVG />
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white"
      >
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold mb-1">10+</div>
            <div className="text-lg opacity-90">{t('home.stats.regions')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">100+</div>
            <div className="text-lg opacity-90">{t('nav.events')}</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-1">1000+</div>
            <div className="text-lg opacity-90">{t('home.stats.travelers')}</div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}