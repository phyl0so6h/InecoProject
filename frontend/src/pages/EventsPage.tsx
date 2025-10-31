import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { EventsList } from '../components/EventsList'
import { useSearchParams } from 'react-router-dom'

export function EventsPage(): React.ReactElement {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState({
    region: params.get('region') || '',
    type: params.get('type') || '',
    pricing: (params.get('pricing') as 'free' | 'paid' | '') || '',
    date: params.get('date') || ''
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    const next = new URLSearchParams()
    if (filters.region) next.set('region', filters.region)
    if (filters.type) next.set('type', filters.type)
    if (filters.pricing) next.set('pricing', filters.pricing)
    if (filters.date) next.set('date', filters.date)
    setParams(next, { replace: true })
  }, [filters, setParams])

  const clearFilters = () => {
    setFilters({ region: '', type: '', pricing: '', date: '' })
    setParams(new URLSearchParams(), { replace: true })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('nav.events')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('home.features.events.desc')}</p>
      </div>

      {/* Filter Section */}
      <section className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('events.filters.title')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('field.region')}</label>
            <select 
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
              className="w-full h-12 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              style={{outline: 'none'}}
              onFocus={(e) => {e.target.style.borderColor = '#BC9E82'; e.target.style.boxShadow = '0 0 0 1px #BC9E82'}}
              onBlur={(e) => {e.target.style.borderColor = ''; e.target.style.boxShadow = ''}}
            >
              <option value="">{t('events.filters.region')}</option>
              <option value="yerevan">{t('regions.yerevan')}</option>
              <option value="ararat">{t('regions.ararat')}</option>
              <option value="armavir">{t('regions.armavir')}</option>
              <option value="gegharkunik">{t('regions.gegharkunik')}</option>
              <option value="kotayk">{t('regions.kotayk')}</option>
              <option value="lori">{t('regions.lori')}</option>
              <option value="shirak">{t('regions.shirak')}</option>
              <option value="syunik">{t('regions.syunik')}</option>
              <option value="tavush">{t('regions.tavush')}</option>
              <option value="vayotsDzor">{t('regions.vayotsDzor')}</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('field.type')}</label>
            <select 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full h-12 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              style={{outline: 'none'}}
              onFocus={(e) => {e.target.style.borderColor = '#BC9E82'; e.target.style.boxShadow = '0 0 0 1px #BC9E82'}}
              onBlur={(e) => {e.target.style.borderColor = ''; e.target.style.boxShadow = ''}}
            >
              <option value="">{t('events.filters.type_all')}</option>
              <option value="Festival">Փառատոն</option>
              <option value="Culture">Մշակույթ</option>
              <option value="Music">Երաժշտություն</option>
              <option value="Food">Խոհանոց</option>
              <option value="Sport">Սպորտ</option>
              <option value="Tradition">Ավանդույթ</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('field.pricing')}</label>
            <select 
              value={filters.pricing}
              onChange={(e) => handleFilterChange('pricing', e.target.value)}
              className="w-full h-12 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              style={{outline: 'none'}}
              onFocus={(e) => {e.target.style.borderColor = '#BC9E82'; e.target.style.boxShadow = '0 0 0 1px #BC9E82'}}
              onBlur={(e) => {e.target.style.borderColor = ''; e.target.style.boxShadow = ''}}
            >
              <option value="">{t('events.filters.pricing_all')}</option>
              <option value="free">{t('events.filters.pricing_free')}</option>
              <option value="paid">{t('events.filters.pricing_paid')}</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('field.date')}</label>
            <input 
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="w-full h-12 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              style={{outline: 'none'}}
              onFocus={(e) => {e.target.style.borderColor = '#BC9E82'; e.target.style.boxShadow = '0 0 0 1px #BC9E82'}}
              onBlur={(e) => {e.target.style.borderColor = ''; e.target.style.boxShadow = ''}}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {t('events.filters.clear')}
          </button>
        </div>
      </section>

      {/* Events List */}
      <section className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('events.list.title')}</h2>
        <EventsList region={filters.region} type={filters.type} pricing={filters.pricing as 'free' | 'paid' | ''} />
      </section>
    </div>
  )
}