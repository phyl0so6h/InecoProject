import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type AttractionItem = { id: string; title: string; summary: string; imageUrl: string }

export function AttractionsPage(): React.ReactElement {
  const { t, i18n } = useTranslation()
  const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || '/api', [])
  const [items, setItems] = useState<AttractionItem[]>([])
  const [openId, setOpenId] = useState<string>('')
  const [detail, setDetail] = useState<{ id: string; title: string; summary: string; history: string; imageUrl: string } | null>(null)

  useEffect(() => {
    fetch(`${apiUrl}/attractions?lng=${i18n.language === 'en' ? 'en' : 'hy'}`)
      .then(r => r.json())
      .then(d => setItems(Array.isArray(d.items) ? d.items : []))
      .catch(() => setItems([]))
  }, [apiUrl, i18n.language])

  useEffect(() => {
    if (!openId) return
    fetch(`${apiUrl}/attractions/${openId}?lng=${i18n.language === 'en' ? 'en' : 'hy'}`)
      .then(r => r.json())
      .then(setDetail)
      .catch(() => setDetail(null))
  }, [openId, apiUrl, i18n.language])

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">{t('attractions.title')}</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(a => (
          <button key={a.id} className="text-left border rounded-lg overflow-hidden bg-white dark:bg-neutral-900" onClick={() => setOpenId(a.id)}>
            <img src={a.imageUrl || '/placeholder.svg'} alt={a.title} className="w-full h-40 object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg' }} />
            <div className="p-3">
              <div className="font-semibold">{a.title}</div>
              <div className="text-sm opacity-80">{a.summary}</div>
            </div>
          </button>
        ))}
      </div>

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setDetail(null)}>
          <div className="max-w-2xl w-full rounded-xl overflow-hidden bg-white dark:bg-neutral-900" onClick={(e) => e.stopPropagation()}>
            <img src={detail.imageUrl || '/placeholder.svg'} alt={detail.title} className="w-full h-56 object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg' }} />
            <div className="p-4 grid gap-2">
              <div className="text-xl font-semibold">{detail.title}</div>
              <div className="text-sm opacity-80">{detail.summary}</div>
              <div className="text-sm leading-relaxed whitespace-pre-line">{detail.history}</div>
              <div className="flex justify-end">
                <button className="px-3 py-2 rounded-md border" onClick={() => setDetail(null)}>{t('common.close')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


