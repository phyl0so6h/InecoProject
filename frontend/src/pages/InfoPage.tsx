import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export function InfoPage(): React.ReactElement {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-white rounded-2xl p-8 md:p-12"
        style={{background: 'linear-gradient(to right, #BC9E82, #8FBC8F)'}}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('about.welcome')}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
            {t('about.missionText')}
          </p>
        </div>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4" style={{color: '#BC9E82'}}>
            {t('about.mission')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('about.missionText')}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4" style={{color: '#BC9E82'}}>
            {t('about.vision')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('about.visionText')}
          </p>
        </div>
      </motion.section>

      {/* History Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{color: '#BC9E82'}}>
              {t('about.history')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {t('about.historyText')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center" 
              alt="Armenian History" 
              className="rounded-lg shadow-md"
            />
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center" 
              alt="Ancient Armenia" 
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </motion.section>

      {/* Culture Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop&crop=center" 
              alt="Armenian Culture" 
              className="rounded-lg shadow-md w-full"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold mb-6" style={{color: '#BC9E82'}}>
              {t('about.culture')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {t('about.cultureText')}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Nature Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6" style={{color: '#BC9E82'}}>
              {t('about.nature')}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {t('about.natureText')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center" 
              alt="Mount Ararat" 
              className="rounded-lg shadow-md"
            />
            <img 
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center" 
              alt="Lake Sevan" 
              className="rounded-lg shadow-md"
            />
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6" style={{color: '#BC9E82'}}>
            {t('about.team')}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg max-w-3xl mx-auto">
            {t('about.teamText')}
          </p>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="text-white rounded-2xl p-8 md:p-12"
        style={{background: 'linear-gradient(to right, #BC9E82, #8FBC8F)'}}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t('about.contact')}
          </h2>
          <p className="text-xl opacity-90 mb-8">
            {t('about.contactText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:info@armenia-travel.com"
              className="px-6 py-3 bg-white rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              style={{color: '#BC9E82'}}
            >
              Email Us
            </a>
            <a 
              href="tel:+37412345678"
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white transition-colors"
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#BC9E82'}
              onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'white'}
            >
              Call Us
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  )
}


