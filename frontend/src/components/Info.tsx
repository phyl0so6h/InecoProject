import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type InfoData = { culture: string; traditions: string[] }

export function Info(): React.ReactElement {
    const { t } = useTranslation()
    const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000', [])
    const [data, setData] = useState<InfoData | null>(null)

    useEffect(() => {
        fetch(`${apiUrl}/info`).then(r => r.json()).then(setData).catch(() => setData(null))
    }, [apiUrl])

  if (!data) return <div className="opacity-70">{t('info.noData')}</div>
  return (
    <div className="grid gap-6">
      <article className="grid md:grid-cols-2 gap-4 items-start">
        <img src="https://source.unsplash.com/800x500/?armenia,culture" alt="Culture" className="rounded-xl border" />
        <div>
          <h3 className="text-xl font-semibold mb-2">{t('info.culture')}</h3>
          <p className="leading-relaxed">{data.culture}</p>
        </div>
      </article>
      <article className="grid md:grid-cols-2 gap-4 items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">{t('info.traditions')}</h3>
          <ul className="list-disc pl-5 space-y-1">
            {data.traditions.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>
        <img src="https://source.unsplash.com/800x500/?armenia,tradition" alt="Traditions" className="rounded-xl border" />
      </article>
    </div>
  )
}


