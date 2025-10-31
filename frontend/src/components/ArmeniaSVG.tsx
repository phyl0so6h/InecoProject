import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type TooltipState = {
  visible: boolean
  x: number
  y: number
  region: string
  events: { id: string; title: string }[]
}

const ID_TO_KEY: Record<string, string> = {
  'AM-SH': 'shirak',
  'AM-LO': 'lori',
  'AM-TV': 'tavush',
  'AM-AG': 'aragatsotn',
  'AM-KT': 'kotayk',
  'AM-GR': 'gegharkunik',
  'AM-AV': 'armavir',
  'AM-AR': 'ararat',
  'AM-VD': 'vayotsDzor',
  'AM-SU': 'syunik',
  'AM-ER': 'yerevan',
}

// Յուրաքանչյուր մարզի համար կանաչ երանգների գույներ
const REGION_COLORS: Record<string, string> = {
  'AM-SH': '#A8D8A8',
  'AM-LO': '#B8E6B8',
  'AM-TV': '#A8D8A8',
  'AM-AG': '#C8F0C8',
  'AM-KT': '#B8E6B8',
  'AM-GR': '#A8D8A8',
  'AM-AV': '#C8F0C8',
  'AM-AR': '#B8E6B8',
  'AM-VD': '#A8D8A8',
  'AM-SU': '#C8F0C8',
  'AM-ER': '#BC9E82',
}

export function ArmeniaSVG(): React.ReactElement {
  const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || '/api', [])
  const navigate = useNavigate()
  const { i18n, t } = useTranslation()
  const [hoverKey, setHoverKey] = useState<string>('')
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, region: '', events: [] })

  // Helper function to convert region key to Armenian name for backend
  const getArmenianRegionName = (regionKey: string): string => {
    const regionMap: Record<string, string> = {
      'yerevan': 'Երևան',
      'ararat': 'Արարատ',
      'armavir': 'Արմավիր',
      'gegharkunik': 'Գեղարքունիք',
      'kotayk': 'Կոտայք',
      'lori': 'Լոռի',
      'shirak': 'Շիրակ',
      'syunik': 'Սյունիք',
      'tavush': 'Տավուշ',
      'vayotsDzor': 'Վայոց Ձոր',
      'aragatsotn': 'Արագածոտն'
    }
    return regionMap[regionKey] || regionKey
  }

  const fetchEvents = async (regionKey: string) => {
    try {
      const res = await fetch(`${apiUrl}/events?region=${encodeURIComponent(getArmenianRegionName(regionKey))}&lng=${i18n.language === 'en' ? 'en' : 'hy'}`)
      const data = await res.json()
      const items = Array.isArray(data.items) ? data.items.slice(0, 3) : []
      setTooltip(t => ({ ...t, events: items.map((i: any) => ({ id: i.id, title: i.title })) }))
    } catch {
      setTooltip(t => ({ ...t, events: [] }))
    }
  }

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cleanup: Array<() => void> = []
    const mount = async () => {
      if (!containerRef.current) return
      const res = await fetch('/armenia.svg')
      const text = await res.text()
      containerRef.current.innerHTML = text
      const svg = containerRef.current.querySelector('svg') as SVGSVGElement | null
      if (!svg) return
      Object.entries(ID_TO_KEY).forEach(([id, key]) => {
        const path = svg.querySelector(`#${id}`) as SVGPathElement | null
        if (!path) return
        
        // Սահմանել յուրաքանչյուր մարզի հատուկ գույնը
        const regionColor = REGION_COLORS[id] || '#6B7280'
        path.style.fill = regionColor
        path.style.transition = 'fill 150ms ease, filter 150ms ease, transform 150ms ease'
        
        const enter = (e: MouseEvent) => {
          const regionName = t(`regions.${key}`)
          setHoverKey(regionName)
          setTooltip({ visible: true, x: e.clientX, y: e.clientY, region: regionName, events: [] })
          path.style.filter = 'brightness(1.2) saturate(1.3)'
          path.style.transform = 'scale(1.05)'
          fetchEvents(key)
        }
        const move = (e: MouseEvent) => setTooltip(t => ({ ...t, x: e.clientX, y: e.clientY }))
        const leave = () => {
          setHoverKey('')
          setTooltip(t => ({ ...t, visible: false }))
          path.style.filter = ''
          path.style.transform = ''
        }
        const click = () => {
          navigate(`/events?region=${encodeURIComponent(key)}`)
        }
        path.addEventListener('mouseenter', enter)
        path.addEventListener('mousemove', move)
        path.addEventListener('mouseleave', leave)
        path.addEventListener('click', click)
        cleanup.push(() => {
          path.removeEventListener('mouseenter', enter)
          path.removeEventListener('mousemove', move)
          path.removeEventListener('mouseleave', leave)
          path.removeEventListener('click', click)
        })
      })
    }
    mount()
    return () => { cleanup.forEach(fn => fn()) }
  }, [navigate, i18n.language])

  return (
    <div className="relative min-h-[380px]">
      <div ref={containerRef} className="w-full [&_path]:cursor-pointer p-4" aria-label="Armenia map" />
      {tooltip.visible && (
        <div style={{ left: tooltip.x + 12, top: tooltip.y + 12 }} className="pointer-events-none fixed z-50 min-w-[220px] opacity-100 rounded-2xl">
          <div className="rounded-2xl p-3 bg-white/80 dark:bg-slate-900/80">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-lg">📍</div>
              <div className="font-bold text-gray-900 dark:text-white">{tooltip.region}</div>
            </div>
            <div className="text-xs text-gray-600 dark:text-white mb-2">
              {t('map.tooltip.nearbyEvents')}
            </div>
            <ul className="text-sm space-y-1">
              {tooltip.events.length ? tooltip.events.map(ev => (
                <li key={ev.id} className="text-gray-700 dark:text-white">
                  • {ev.title}
                </li>
              )) : <li className="text-gray-500 dark:text-white italic">{t('map.tooltip.noData')}</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}


