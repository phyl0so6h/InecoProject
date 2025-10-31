import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

type Props = {
  id: string
  title: string
  region: string
  date: string
  description: string
  imageUrl?: string
  onOpen: (id: string) => void
}

export function EventCard({ id, title, region, date, description, imageUrl, onOpen }: Props): React.ReactElement {
  const { t } = useTranslation()
  return (
    <motion.div 
      whileHover={{ y: -4 }} 
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="card-hover rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Image */}
      <div className="relative h-40">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl" style={{backgroundColor: 'rgba(188, 158, 130, 0.2)'}}>
            🎭
          </div>
        )}
        
        {/* Badge */}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-white dark:bg-slate-800 text-xs font-medium text-gray-700 dark:text-gray-300 shadow-sm">
          {region}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
          {title}
        </h3>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          📅 {new Date(date).toLocaleDateString()}
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
        
        <button 
          onClick={() => onOpen(id)}
          className="w-full mt-3 px-4 py-2 rounded-lg text-white font-medium transition-colors"
          style={{backgroundColor: '#BC9E82'}}
          onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#A68B5B'}
          onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#BC9E82'}
        >
                 {t('routes.details')}
        </button>
      </div>
    </motion.div>
  )
}


