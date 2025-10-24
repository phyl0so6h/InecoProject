import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type TravelPlan = {
    id: string
    organizer: { id: string; name: string }
    from: string
    to: string
    date: string
    seats: number
    route: string[]
    eventId: string
    eventTitle: string
    ridePricing?: { isFree: boolean; pricePerSeat: number }
}

type Props = {
    to?: string
    eventId?: string
}

export function TravelPlans({ to = '', eventId = '' }: Props): React.ReactElement {
    const { t, i18n } = useTranslation()
    const [plans, setPlans] = useState<TravelPlan[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [joining, setJoining] = useState<string>('')

    const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || '/api', [])

    // Helper function to translate region name for display
    const getTranslatedRegionName = (regionName: string): string => {
        const regionTranslationMap: Record<string, string> = {
            'Երևան': t('regions.yerevan'),
            'Արարատ': t('regions.ararat'),
            'Արմավիր': t('regions.armavir'),
            'Գեղարքունիք': t('regions.gegharkunik'),
            'Կոտայք': t('regions.kotayk'),
            'Լոռի': t('regions.lori'),
            'Շիրակ': t('regions.shirak'),
            'Սյունիք': t('regions.syunik'),
            'Տավուշ': t('regions.tavush'),
            'Վայոց Ձոր': t('regions.vayotsDzor'),
            'Արագածոտն': t('regions.aragatsotn'),
            // Cities
            'Վանաձոր': t('cities.vanadzor'),
            'Ալավերդի': t('cities.alaverdi'),
            'Գյումրի': t('cities.gyumri'),
            'Կապան': t('cities.kapan'),
            'Գորիս': t('cities.goris'),
            'Արտաշատ': t('cities.artashat'),
            'Արենի': t('cities.areni'),
            'Եղեգնաձոր': t('cities.eghgnadzor'),
            'Սևան': t('cities.sevan'),
            'Դիլիջան': t('cities.dilijan'),
            'Իջևան': t('cities.ijevan'),
            'Խոր Վիրապ': t('cities.khor_virap'),
            'Մասիս': t('cities.masis')
        }
        return regionTranslationMap[regionName] || regionName
    }

    // Helper function to translate route array
    const getTranslatedRoute = (route: string[]): string => {
        return route.map(region => getTranslatedRegionName(region)).join(' → ')
    }

    const join = async (id: string) => {
        setJoining(id)
        try {
            const token = localStorage.getItem('auth_token')
            if (!token) {
                alert(t('auth.required'))
                return
            }
            const res = await fetch(`${apiUrl}/travel-plans/${id}/join`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
            })
            if (res.ok) {
                const data = await res.json()
                setPlans(ps => ps.map(p => p.id === id ? { ...p, seats: data.seatsLeft } : p))
                alert(t('travel.joined'))
            } else {
                const error = await res.json()
                alert(error.error || t('travel.joinError'))
            }
        } catch (error) {
            alert(t('travel.joinError'))
        } finally {
            setJoining('')
        }
    }

    const formatDate = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    const getPlanStatus = (plan: TravelPlan): { status: 'past' | 'upcoming', daysLeft?: number, message: string } => {
        const now = new Date()
        const planDate = new Date(plan.date)
        
        if (now > planDate) {
            return { status: 'past', message: t('travel.status.past') }
        }
        
        const daysUntil = Math.ceil((planDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        return { status: 'upcoming', daysLeft: daysUntil, message: `${t('travel.status.departs')} ${daysUntil} ${t('duration.days')}ից` }
    }

    const getTravelDetails = (plan: TravelPlan) => {
        const planDate = new Date(plan.date)
        const departureTime = new Date(planDate.getTime() + 8 * 60 * 60 * 1000) // 8 AM
        
        // Calculate distances between stops
        const stopDistances: Record<string, Record<string, number>> = {
            'Երևան': {
                'Իջևան': 120,
                'Դիլիջան': 140,
                'Վանաձոր': 120,
                'Ալավերդի': 150,
                'Գյումրի': 120,
                'Արտաշատ': 30,
                'Արենի': 50,
                'Եղեգնաձոր': 130,
                'Սևան': 70,
                'Գորիս': 250,
                'Տաթև': 280,
                'Խոր Վիրապ': 50
            },
            'Իջևան': {
                'Դիլիջան': 20,
                'Վանաձոր': 30
            },
            'Դիլիջան': {
                'Վանաձոր': 25,
                'Ալավերդի': 50
            }
        }
        
        // Calculate route with intermediate stops
        const calculateRouteTimes = (route: string[], startTime: Date) => {
            const routeTimes: Array<{stop: string, arrivalTime: string, departureTime?: string}> = []
            let currentTime = new Date(startTime)
            
            for (let i = 0; i < route.length; i++) {
                const currentStop = route[i]
                const nextStop = route[i + 1]
                
                // Add arrival time for current stop
                routeTimes.push({
                    stop: currentStop,
                    arrivalTime: currentTime.toLocaleTimeString(i18n.language === 'en' ? 'en-US' : 'hy-AM', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                })
                
                // If there's a next stop, calculate travel time
                if (nextStop) {
                    const distance = stopDistances[currentStop]?.[nextStop] || 
                                   stopDistances['Երևան']?.[nextStop] || 100
                    const travelMinutes = Math.max(30, Math.ceil(distance / 60 * 60)) // 60 km/h
                    
                    // Add departure time (15 min stop)
                    const departureTime = new Date(currentTime.getTime() + 15 * 60 * 1000)
                    routeTimes[routeTimes.length - 1].departureTime = departureTime.toLocaleTimeString(i18n.language === 'en' ? 'en-US' : 'hy-AM', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                    
                    // Move to next stop
                    currentTime = new Date(departureTime.getTime() + travelMinutes * 60 * 1000)
                }
            }
            
            return routeTimes
        }
        
        const routeTimes = calculateRouteTimes(plan.route, departureTime)
        const totalDistance = plan.route.reduce((total, stop, index) => {
            if (index === 0) return total
            const prevStop = plan.route[index - 1]
            const distance = stopDistances[prevStop]?.[stop] || 
                           stopDistances['Երևան']?.[stop] || 100
            return total + distance
        }, 0)
        
        const totalTravelHours = Math.ceil(totalDistance / 60) // 60 km/h average
        const finalArrival = routeTimes[routeTimes.length - 1].arrivalTime
        
        return {
            departureTime: departureTime.toLocaleTimeString(i18n.language === 'en' ? 'en-US' : 'hy-AM', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            arrivalTime: finalArrival,
            travelDuration: `${totalTravelHours} ${t('travel.hours')}`,
            distance: `${totalDistance} ${t('travel.km')}`,
            vehicleType: t('travel.vehicleType'),
            meetingPoint: t('travel.meetingPoint'),
            routeTimes: routeTimes
        }
    }

    const sortPlans = (plans: TravelPlan[]): TravelPlan[] => {
        const now = new Date()
        
        return [...plans].sort((a, b) => {
            const aDate = new Date(a.date)
            const bDate = new Date(b.date)
            
            // Check if plans are past
            const aIsPast = now > aDate
            const bIsPast = now > bDate
            
            // Put past plans at the end
            if (aIsPast && !bIsPast) return 1
            if (!aIsPast && bIsPast) return -1
            
            // Sort by date (earliest first)
            return aDate.getTime() - bDate.getTime()
        })
    }

    useEffect(() => {
        const params = new URLSearchParams()
        if (to) params.set('to', to)
        if (eventId) params.set('eventId', eventId)
        params.set('lng', i18n.language === 'en' ? 'en' : 'hy')
        setLoading(true)
        fetch(`${apiUrl}/travel-plans?${params.toString()}`)
        .then(r => r.json())
        .then(d => {
            const items = Array.isArray(d.items) ? d.items : []
            setPlans(sortPlans(items))
        })
        .catch(() => setPlans([]))
        .finally(() => setLoading(false))
    }, [to, eventId, apiUrl, i18n.language])

    return (
        <div className="grid gap-4">
        {loading && (
            <div className="text-center py-8">
                <div className="text-gray-600 dark:text-gray-400">{t('travel.loading')}</div>
            </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map(plan => {
                const status = getPlanStatus(plan)
                const statusColors = {
                    past: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-400',
                    upcoming: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-400'
                }
                
                return (
                <div key={plan.id} className="card-hover rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-4">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 flex-1">
                            {plan.eventTitle}
                        </h3>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status.status]} ml-2 whitespace-nowrap`}>
                            {status.message}
                        </div>
                    </div>
                    
                    {/* Route */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span>🚗</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {(function mapRegion(r: string){
                                if (i18n.language !== 'en') return r
                                const m: Record<string,string> = {
                                    'Երևան':'Yerevan','Արագածոտն':'Aragatsotn','Արարատ':'Ararat','Արմավիր':'Armavir','Գեղարքունիք':'Gegharkunik','Կոտայք':'Kotayk','Լոռի':'Lori','Շիրակ':'Shirak','Սյունիք':'Syunik','Տավուշ':'Tavush','Վայոց Ձոր':'Vayots Dzor'
                                }
                                return m[r] || r
                            })(plan.from)} → {(function mapRegion(r: string){
                                if (i18n.language !== 'en') return r
                                const m: Record<string,string> = {
                                    'Երևան':'Yerevan','Արագածոտն':'Aragatsotn','Արարատ':'Ararat','Արմավիր':'Armavir','Գեղարքունիք':'Gegharkunik','Կոտայք':'Kotayk','Լոռի':'Lori','Շիրակ':'Shirak','Սյունիք':'Syunik','Տավուշ':'Tavush','Վայոց Ձոր':'Vayots Dzor'
                                }
                                return m[r] || r
                            })(plan.to)}
                        </span>
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-1 mb-3 text-sm text-gray-600 dark:text-gray-400">
                        <div><strong>{t('travel.organizer')}:</strong> {plan.organizer.name}</div>
                        <div><strong>{t('travel.date')}:</strong> {formatDate(new Date(plan.date))}</div>
                        <div><strong>{t('travel.seats')}:</strong> {plan.seats} {t('travel.seatsAvailable')}</div>
                        <div><strong>{t('travel.route')}:</strong> {getTranslatedRoute(plan.route)}</div>
                    </div>
                    
                    {/* Price & Actions */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-bold">
                                {plan.ridePricing?.isFree ? (
                                    <span className="text-green-600 dark:text-green-400">{t('pricing.free')}</span>
                                ) : (
                                    <span className="text-purple-600 dark:text-purple-400">{plan.ridePricing?.pricePerSeat.toLocaleString()} AMD</span>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
                            >
                                {selectedPlan === plan.id ? t('travel.hideDetails') : t('travel.details')}
                            </button>
                            <button 
                                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                disabled={plan.seats <= 0 || status.status === 'past' || joining === plan.id}
                                onClick={() => join(plan.id)}
                            >
                                {joining === plan.id 
                                    ? t('travel.joining') 
                                    : plan.seats <= 0 
                                        ? t('travel.noSeats') 
                                        : t('travel.join')
                                }
                            </button>
                        </div>
                    </div>
                </div>
                )
            })}
            {!loading && !plans.length && (
                <div className="col-span-full text-center py-8">
                    <div className="text-4xl mb-2">🚗</div>
                    <div className="text-gray-600 dark:text-gray-400">{t('travel.empty')}</div>
                </div>
            )}
        </div>
        {selectedPlan && (() => {
            const plan = plans.find(p => p.id === selectedPlan)
            if (!plan) return null
            const details = getTravelDetails(plan)
            return (
                <div className="fixed inset-0 z-50">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedPlan(null)}></div>
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden">
                            {/* Modal Header */}
                            <div className="bg-purple-600 p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="font-bold text-xl mb-1">{plan.eventTitle}</h2>
                                        <div className="text-purple-100 text-sm">
                                            🚗 {getTranslatedRegionName(plan.from)} → {getTranslatedRegionName(plan.to)}
                                        </div>
                                    </div>
                                    <button
                                        className="px-3 py-1 text-sm rounded bg-white/20 hover:bg-white/30 transition-colors"
                                        onClick={() => setSelectedPlan(null)}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                            
                            {/* Modal Content */}
                            <div className="p-4 space-y-4">
                                {/* Quick Info Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('travel.date')}</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{formatDate(new Date(plan.date))}</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('travel.seats')}</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{plan.seats} {t('travel.seatsAvailable')}</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('travel.duration')}</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{details.travelDuration}</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('travel.distance')}</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{details.distance}</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('travel.vehicle')}</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{details.vehicleType}</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">{t('travel.meeting')}</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">{details.meetingPoint}</div>
                                    </div>
                                </div>
                                
                                {/* Route Timeline */}
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
                                    <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white">
                                        🗺️ {t('travel.routeTimeline')}
                                    </h3>
                                    <div className="space-y-2">
                                        {details.routeTimes.map((stop: any, index: number) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="w-3 h-3 bg-purple-600 rounded-full flex-shrink-0 mt-1"></div>
                                                <div className="flex-1">
                                                    <div className="font-bold text-gray-900 dark:text-white">{getTranslatedRegionName(stop.stop)}</div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                                        <span className="font-medium">{t('travel.arrives')}:</span> {stop.arrivalTime}
                                                        {stop.departureTime && (
                                                            <>
                                                                <span className="mx-2">•</span>
                                                                <span className="font-medium">{t('travel.departs')}:</span> {stop.departureTime}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Footer */}
                                <div className="flex justify-end pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                                        onClick={() => setSelectedPlan(null)}
                                    >
                                        {t('travel.close')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })()}
        </div>
    )
}
