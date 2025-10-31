import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type EventItem = {
    id: string
    title: string
    description: string
    region: string
    area: string
    type: string
    date: string
    startDate?: string
    endDate?: string
    imageUrl?: string
    pricing?: { isFree: boolean; price: number }
}

type Props = {
    region?: string
    type?: string
    pricing?: 'free' | 'paid' | ''
}

export function EventsList({ region = '', type = '', pricing = '' }: Props): React.ReactElement {
    const { t, i18n } = useTranslation()
    const [events, setEvents] = useState<EventItem[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const apiUrl = useMemo(() => {
        const url = (import.meta as any).env?.VITE_API_URL || '/api'
        console.log('EventsList apiUrl:', url, 'env:', (import.meta as any).env)
        return url
    }, [])

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

    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    const getEventStatus = (event: EventItem): { status: 'past' | 'ongoing' | 'upcoming', daysLeft?: number, message: string } => {
        const now = new Date()
        const start = event.startDate ? new Date(event.startDate) : new Date(event.date)
        const end = event.endDate ? new Date(event.endDate) : start
        
        if (now > end) {
            return { status: 'past', message: t('event.status.unavailable') }
        }
        
        if (now >= start && now <= end) {
            const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            return { status: 'ongoing', daysLeft, message: `${t('event.status.remaining')} ${daysLeft} ${t('duration.days')}` }
        }
        
        const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return { status: 'upcoming', message: `${t('event.status.starts')} ${daysUntil} ${t('duration.days')}ից` }
    }

    const getEventDuration = (event: EventItem): string => {
        if (!event.startDate || !event.endDate) {
            return formatDate(new Date(event.date))
        }
        
        const start = new Date(event.startDate)
        const end = new Date(event.endDate)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        
        const startStr = formatDate(start)
        const endStr = formatDate(end)
        
        if (diffDays === 1) {
            return startStr
        }
        
        return `${startStr} - ${endStr} (${diffDays} ${t('duration.days')})`
    }

    const sortEvents = (events: EventItem[]): EventItem[] => {
        const now = new Date()
        
        return [...events].sort((a, b) => {
            const aStart = a.startDate ? new Date(a.startDate) : new Date(a.date)
            const aEnd = a.endDate ? new Date(a.endDate) : aStart
            const bStart = b.startDate ? new Date(b.startDate) : new Date(b.date)
            const bEnd = b.endDate ? new Date(b.endDate) : bStart
            
            // Check if events are past (unavailable)
            const aIsPast = now > aEnd
            const bIsPast = now > bEnd
            
            // If one is past and other isn't, put past events at the end
            if (aIsPast && !bIsPast) return 1
            if (!aIsPast && bIsPast) return -1
            
            // If both are past, sort by end date (most recent first)
            if (aIsPast && bIsPast) {
                return bEnd.getTime() - aEnd.getTime()
            }
            
            // For upcoming/ongoing events, sort by fewest days remaining
            const aDaysRemaining = now >= aStart && now <= aEnd 
                ? Math.ceil((aEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                : Math.ceil((aStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            
            const bDaysRemaining = now >= bStart && now <= bEnd 
                ? Math.ceil((bEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                : Math.ceil((bStart.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            
            // Sort by fewest days remaining (ascending order)
            return aDaysRemaining - bDaysRemaining
        })
    }

    useEffect(() => {
        const params = new URLSearchParams()
        if (region) params.set('region', getArmenianRegionName(region))
        if (type) params.set('type', type)
        if (pricing) params.set('pricing', pricing)
        params.set('lng', i18n.language === 'en' ? 'en' : 'hy')
        setLoading(true)
        fetch(`${apiUrl}/api/events?${params.toString()}`)
        .then(r => {
            if (!r.ok) {
                console.error('Events fetch failed:', r.status, r.statusText)
                throw new Error(`HTTP ${r.status}`)
            }
            return r.json()
        })
        .then(d => {
            console.log('Events response:', d)
            const items = Array.isArray(d.items) ? d.items : []
            console.log('Parsed events:', items.length, 'items')
            setEvents(sortEvents(items))
        })
        .catch((err) => {
            console.error('Events fetch error:', err)
            setEvents([])
        })
        .finally(() => setLoading(false))
    }, [region, type, pricing, apiUrl, i18n.language])

    // Debug: Log current state
    useEffect(() => {
        console.log('EventsList state:', { 
            eventsCount: events.length, 
            loading, 
            region, 
            type, 
            pricing,
            apiUrl 
        })
    }, [events, loading, region, type, pricing, apiUrl])

    return (
        <div className="grid gap-4">
        {loading && <div className="opacity-70">{t('events.loading')}</div>}
        {!loading && events.length === 0 && (
            <div className="opacity-70 text-center py-8">
                {t('events.empty')}
                <div className="text-xs mt-2">Debug: No events found. Check console for details.</div>
            </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(ev => {
                const status = getEventStatus(ev)
                const statusColors = {
                    past: 'text-red-600 dark:text-red-400',
                    ongoing: 'text-orange-600 dark:text-orange-400',
                    upcoming: 'text-green-600 dark:text-green-400'
                }
                
                return (
                <div key={ev.id} className="rounded-lg border p-4 grid gap-2 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg hover:border-[#BC9E82] bg-white dark:bg-slate-800">
                    <img
                        src={'/placeholder.svg'}
                        alt={ev.title}
                        className="w-full h-36 object-cover rounded transition-transform duration-300 hover:scale-110"
                    />
                    <div className="font-semibold">{ev.title}</div>
                    <div className="text-sm opacity-70">{ev.area} · {getEventDuration(ev)}</div>
                    <div className={`text-sm font-medium ${statusColors[status.status]}`}>
                        {status.message}
                    </div>
                    <div className="text-sm">{ev.description}</div>
                    {ev.pricing && (
                        <div className="text-sm font-medium">
                            {t('field.pricing')}: {ev.pricing.isFree ? t('pricing.free') : `${ev.pricing.price.toLocaleString()} AMD`}
                        </div>
                    )}
                </div>
                )
            })}
        </div>
        </div>
    )
}


