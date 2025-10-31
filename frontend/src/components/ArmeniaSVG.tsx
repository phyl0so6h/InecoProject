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
      const res = await fetch(`${apiUrl}/api/events?region=${encodeURIComponent(getArmenianRegionName(regionKey))}&lng=${i18n.language === 'en' ? 'en' : 'hy'}`)
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
      
      // Mobile-ում SVG-ը ամբողջությամբ տեսանելի դարձնել
      const isMobile = window.innerWidth <= 768
      if (svg && isMobile) {
        // SVG-ին ավելացնել viewBox եթե չկա
        if (!svg.getAttribute('viewBox')) {
          const width = parseFloat(svg.getAttribute('width') || '792') || 792
          const height = parseFloat(svg.getAttribute('height') || '802') || 802
          svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
        }
        
        // Set preserveAspectRatio for proper scaling
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
        
        // Remove fixed width/height և թող CSS-ը կառավարի
        svg.removeAttribute('width')
        svg.removeAttribute('height')
        svg.style.width = '100%'
        svg.style.height = 'auto'
        svg.style.maxWidth = '100%'
        svg.style.maxHeight = '100%'
        svg.style.display = 'block'
      }
      
      Object.entries(ID_TO_KEY).forEach(([id, key]) => {
        const path = svg.querySelector(`#${id}`) as SVGPathElement | null
        if (!path) return
        
        // Սահմանել յուրաքանչյուր մարզի հատուկ գույնը
        const regionColor = REGION_COLORS[id] || '#6B7280'
        path.style.fill = regionColor
        path.style.transition = 'fill 150ms ease, filter 150ms ease, transform 150ms ease'
        
        const enter = (e: MouseEvent | TouchEvent) => {
          const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
          const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY
          const regionName = t(`regions.${key}`)
          setHoverKey(regionName)
          setTooltip({ visible: true, x: clientX || 0, y: clientY || 0, region: regionName, events: [] })
          path.style.filter = 'brightness(1.2) saturate(1.3)'
          path.style.transform = 'scale(1.05)'
          fetchEvents(key)
        }
        const move = (e: MouseEvent | TouchEvent) => {
          const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX
          const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY
          setTooltip(t => ({ ...t, x: clientX || 0, y: clientY || 0 }))
        }
        const leave = () => {
          setHoverKey('')
          setTooltip(t => ({ ...t, visible: false }))
          path.style.filter = ''
          path.style.transform = ''
        }
        const click = () => {
          navigate(`/events?region=${encodeURIComponent(key)}`)
        }
        
        // Desktop events
        path.addEventListener('mouseenter', enter as EventListener)
        path.addEventListener('mousemove', move as EventListener)
        path.addEventListener('mouseleave', leave)
        path.addEventListener('click', click)
        
        // Mobile touch events
        path.addEventListener('touchstart', enter as EventListener, { passive: true })
        path.addEventListener('touchmove', move as EventListener, { passive: true })
        path.addEventListener('touchend', leave, { passive: true })
        path.addEventListener('touchcancel', leave, { passive: true })
        
        cleanup.push(() => {
          path.removeEventListener('mouseenter', enter as EventListener)
          path.removeEventListener('mousemove', move as EventListener)
          path.removeEventListener('mouseleave', leave)
          path.removeEventListener('click', click)
          path.removeEventListener('touchstart', enter as EventListener)
          path.removeEventListener('touchmove', move as EventListener)
          path.removeEventListener('touchend', leave)
          path.removeEventListener('touchcancel', leave)
        })
      })
    }
    mount()
    
    // Ensure SVG has viewBox for responsive scaling
    setTimeout(() => {
      if (containerRef.current) {
        const svg = containerRef.current.querySelector('svg') as SVGSVGElement | null
        if (svg) {
          const isMobile = window.innerWidth <= 768
          
          if (isMobile) {
            // Ensure viewBox exists
            if (!svg.getAttribute('viewBox')) {
              const width = parseFloat(svg.getAttribute('width') || '792') || 792
              const height = parseFloat(svg.getAttribute('height') || '802') || 802
              svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
            }
            
            // Set preserveAspectRatio
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
            
            // Remove fixed dimensions for mobile
            svg.removeAttribute('width')
            svg.removeAttribute('height')
            svg.style.width = '100%'
            svg.style.height = 'auto'
            svg.style.maxWidth = '100%'
            svg.style.maxHeight = '100%'
          }
        }
      }
    }, 100)
    
    // Handle window resize
    const handleResize = () => {
      if (containerRef.current) {
        const svg = containerRef.current.querySelector('svg') as SVGSVGElement | null
        if (svg) {
          const isMobile = window.innerWidth <= 768
          
          if (isMobile) {
            // Ensure viewBox exists
            if (!svg.getAttribute('viewBox')) {
              const width = parseFloat(svg.getAttribute('width') || '792') || 792
              const height = parseFloat(svg.getAttribute('height') || '802') || 802
              svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
            }
            
            // Set preserveAspectRatio
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
            
            // Remove fixed dimensions
            svg.removeAttribute('width')
            svg.removeAttribute('height')
            svg.style.width = '100%'
            svg.style.height = 'auto'
            svg.style.maxWidth = '100%'
            svg.style.maxHeight = '100%'
          } else {
            // Desktop - restore if needed
            if (!svg.hasAttribute('width')) {
              svg.setAttribute('width', '792.57129')
              svg.setAttribute('height', '802.40002')
            }
            svg.style.width = ''
            svg.style.height = ''
            svg.style.maxWidth = ''
            svg.style.maxHeight = ''
          }
        }
      }
    }
    window.addEventListener('resize', handleResize)
    
    return () => { 
      cleanup.forEach(fn => fn())
      window.removeEventListener('resize', handleResize)
    }
  }, [navigate, i18n.language, t])

  return (
    <div className="relative min-h-[200px] md:min-h-[380px] w-full" style={{ overflow: 'hidden', maxWidth: '100%' }}>
      <div 
        ref={containerRef} 
        className="w-full [&_path]:cursor-pointer p-0 md:p-4" 
        aria-label="Armenia map"
        style={{
          touchAction: 'pan-x pan-y pinch-zoom',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
      <style>{`
        @media (max-width: 768px) {
          [aria-label="Armenia map"] {
            overflow-x: hidden !important;
            overflow-y: hidden !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 300px !important;
            touch-action: pan-x pan-y pinch-zoom;
            padding: 8px !important;
            box-sizing: border-box;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          [aria-label="Armenia map"] svg {
            width: 100% !important;
            height: auto !important;
            max-width: 100% !important;
            max-height: 100% !important;
            min-width: 0 !important;
            min-height: 0 !important;
            display: block !important;
            margin: 0 auto !important;
            box-sizing: border-box;
            object-fit: contain;
          }
        }
        @media (max-width: 480px) {
          [aria-label="Armenia map"] {
            height: 250px !important;
            padding: 4px !important;
          }
        }
      `}</style>
      {tooltip.visible && (
        <div 
          style={{ 
            left: Math.min(tooltip.x + 12, window.innerWidth - 240), 
            top: Math.min(tooltip.y + 12, window.innerHeight - 200),
            maxWidth: 'calc(100vw - 24px)'
          }} 
          className="pointer-events-none fixed z-50 min-w-[200px] max-w-[240px] opacity-100 rounded-2xl"
        >
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


