import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Estimate = {
    region: string
    eventId: string
    passengers: number
    distanceKm: number
    transport: { mode: 'ride_free' | 'ride_paid' | 'taxi'; perPerson: number; total: number }
    event: { isFree: boolean; price: number }
    totalPerPerson: number
    totalGroup: number
}

type ItineraryDay = {
    day: number
    date: string
    region: string | null
    event: (EventItem & { pricing: { isFree: boolean; price: number } }) | null
    attraction: { id: string; title: string; summary: string; imageUrl: string } | null
    transport: { mode: 'ride_free' | 'ride_paid' | 'taxi' | 'return'; perPerson: number; total: number; description?: string; planId?: string; route?: string[] } | null
    costPerPerson: number
    costGroup: number
}

type EventItem = {
    id: string
    title: string
    region: string
}

export function RouteGenerator(): React.ReactElement {
    const { t, i18n } = useTranslation()
    const [region, setRegion] = useState<string>('yerevan')
    const [endRegion, setEndRegion] = useState<string>('')
    const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().slice(0,10))
    const [events, setEvents] = useState<EventItem[]>([])
    const [eventId, setEventId] = useState<string>('')
    const [passengers, setPassengers] = useState<number>(2)

    const [days, setDays] = useState<number>(3)
    const [budget, setBudget] = useState<number>(100000)
    const [interestsText, setInterestsText] = useState<string>('')
    const [stops, setStops] = useState<Array<{ day: number; place: string }>>([])
    const [generated, setGenerated] = useState<{
        name: string
        days: number
        budget: number
        interests: string[]
        stops: Array<{ day: number; place: string }>
    } | null>(null)
    const [itinerary, setItinerary] = useState<{ items: ItineraryDay[]; totals: { perPerson: number; group: number; withinBudget: boolean } } | null>(null)
    
    // Collapsible sections state
    const [showOptional, setShowOptional] = useState<boolean>(false)
    
    // Interests selection
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const availableInterests = [
        'culture', 'nature', 'food', 'history', 'art', 
        'music', 'sport', 'adventure', 'relaxation', 'photography'
    ]
    
    // Intermediate stops selection
    const [selectedStops, setSelectedStops] = useState<string[]>([])
    const availableStops = [
        'areni', 'garni', 'geghard', 'sevanavank', 'dilijan',
        'tatev', 'khor_virap', 'echmiadzin', 'gyumri', 'vanadzor'
    ]

    const [saving, setSaving] = useState<boolean>(false)
    const [newStopText, setNewStopText] = useState<string>('')
    const [loadingEstimate, setLoadingEstimate] = useState<boolean>(false)

    const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || '/api', [])

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

    useEffect(() => {
        const params = new URLSearchParams()
        if (region) params.set('region', getArmenianRegionName(region))
        params.set('lng', i18n.language === 'en' ? 'en' : 'hy')
        fetch(`${apiUrl}/api/events?${params.toString()}`)
            .then(r => r.json())
            .then(d => {
                const items = Array.isArray(d.items) ? d.items : []
                setEvents(items)
                if (!eventId && items.length) setEventId(items[0].id)
            })
            .catch(() => setEvents([]))
    }, [region, apiUrl, i18n.language])

    // estimate panel intentionally removed

    const generate = (): void => {
        const interests = selectedInterests.length > 0 ? selectedInterests : interestsText
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        
        // Convert selectedStops to stops format
        const generatedStops = selectedStops.map((stop, index) => ({
            day: index + 1,
            place: stop
        }))
        
        // Combine selectedStops with manually added stops
        const allStops = [...generatedStops, ...stops]
        
        setGenerated({ name: `${t('routes.createRoute')} ${days} ${t('routes.days')}`, days, budget, interests, stops: allStops })

        fetch(`${apiUrl}/api/itinerary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                startDate, 
                days, 
                budgetPerPerson: budget, 
                interests, 
                passengers, 
                startRegion: getArmenianRegionName(region), 
                endRegion: endRegion ? getArmenianRegionName(endRegion) : undefined,
                lng: i18n.language === 'en' ? 'en' : 'hy'
            })
        })
        .then(r => r.json())
        .then(setItinerary)
        .catch(() => setItinerary(null))
    }

    const addStop = (): void => {
        if (!newStopText.trim()) return
        const nextDay = (stops[stops.length - 1]?.day || 0) + 1
        setStops(prev => [...prev, { day: nextDay, place: newStopText.trim() }])
        setNewStopText('')
    }

    const removeStop = (day: number): void => {
        setStops(prev => prev.filter(s => s.day !== day))
    }

    const toggleInterest = (interest: string): void => {
        setSelectedInterests(prev => 
            prev.includes(interest) 
                ? prev.filter(i => i !== interest)
                : [...prev, interest]
        )
    }

    const toggleStop = (stop: string): void => {
        setSelectedStops(prev => 
            prev.includes(stop) 
                ? prev.filter(s => s !== stop)
                : [...prev, stop]
        )
    }

    const save = async (): Promise<void> => {
        if (!generated) return
        const token = localStorage.getItem('auth_token')
        if (!token) return
        setSaving(true)
        try {
            const res = await fetch(`${apiUrl}/api/routes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: generated.name,
                    days: generated.days,
                    budget: generated.budget,
                    interests: generated.interests,
                    stops: generated.stops,
                }),
            })
            if (res.ok) {
                // Show success animation
                const button = document.querySelector('[data-save-button]') as HTMLElement
                if (button) {
                    button.style.transform = 'scale(0.95)'
                    button.style.backgroundColor = '#10B981'
                    
                    // Show success checkmark
                    const successIcon = document.createElement('div')
                    successIcon.innerHTML = '✓'
                    successIcon.className = 'absolute inset-0 flex items-center justify-center text-white text-lg font-bold'
                    button.appendChild(successIcon)
                    
                    // Hide text during animation
                    const textSpan = button.querySelector('span')
                    if (textSpan) textSpan.style.opacity = '0'
                    
                    setTimeout(() => {
                        button.style.transform = 'scale(1)'
                        button.style.backgroundColor = ''
                        successIcon.remove()
                        if (textSpan) textSpan.style.opacity = '1'
                    }, 1500)
                }
                
                // Clear form after animation
                setTimeout(() => {
                    setGenerated(null)
                    setRegion('yerevan')
                    setEndRegion('')
                    setStartDate(new Date().toISOString().slice(0,10))
                    setEvents([])
                    setEventId('')
                    setPassengers(2)
                    setDays(3)
                    setBudget(100000)
                    setInterestsText('')
                    setStops([])
                    setSelectedStops([])
                }, 2000)
            }
        } finally {
            setSaving(false)
        }
    }

    // estimate affordability removed

    return (
        <div className="space-y-8">

            {/* Required Fields */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{t('routes.requiredFields')}</h4>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('routes.startPoint')} *</label>
                        <select
                            className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={region}
                            onChange={e => setRegion(e.target.value)}
                        >
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
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('routes.participants')} *</label>
                        <input
                            className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="number"
                            min={1}
                            value={passengers}
                            onChange={e => setPassengers(Number(e.target.value || 1))}
                            placeholder="2"
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('routes.budget')} *</label>
                        <input
                            className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="number"
                            min={0}
                            value={budget}
                            onChange={e => setBudget(Number(e.target.value || 0))}
                            placeholder="100000"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('routes.days')} *</label>
                        <input
                            className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="number"
                            min={1}
                            value={days}
                            onChange={e => setDays(Number(e.target.value || 1))}
                            placeholder="3"
                        />
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('routes.startDate')} *</label>
                        <input
                            className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="date"
                            value={startDate}
                            onChange={e => setStartDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Optional Fields - Collapsible */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <button 
                    onClick={() => setShowOptional(!showOptional)}
                    className="flex items-center justify-between w-full text-left"
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{t('routes.optionalFields')}</h4>
                    </div>
                    <div className={`transform transition-transform ${showOptional ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </button>
                
                {showOptional && (
                    <div className="mt-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('routes.endPoint')}</label>
                                <select
                                    className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={endRegion}
                                    onChange={e => setEndRegion(e.target.value)}
                                >
                                    <option value="">{t('routes.selectEndPoint')}</option>
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
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('routes.specificEvent')}</label>
                                <select
                                    className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-lg px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={eventId}
                                    onChange={e => setEventId(e.target.value)}
                                >
                                    <option value="">{t('routes.selectEvent')}</option>
                                    {events.map(ev => (
                                        <option key={ev.id} value={ev.id}>{ev.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('routes.interests')}</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                {availableInterests.map(interest => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                                            selectedInterests.includes(interest)
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {t(`interests.${interest}`)}
                                    </button>
                                ))}
                            </div>
                            {selectedInterests.length > 0 && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('routes.selected')}: {selectedInterests.map(i => t(`interests.${i}`)).join(', ')}
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('routes.intermediateStops')}</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {availableStops.map(stop => (
                                    <button
                                        key={stop}
                                        type="button"
                                        onClick={() => toggleStop(stop)}
                                        className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left ${
                                            selectedStops.includes(stop)
                                                ? 'bg-green-600 text-white border-green-600'
                                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {t(`stops.${stop}`)}
                                    </button>
                                ))}
                            </div>
                            {selectedStops.length > 0 && (
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {t('routes.selected')}: {selectedStops.map(s => t(`stops.${s}`)).join(', ')}
                                </div>
                            )}
                            
                            {/* Manual stop addition */}
                            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">{t('routes.addStop')}</label>
                                <div className="flex gap-2">
                    <input
                                        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newStopText}
                        onChange={e => setNewStopText(e.target.value)}
                                        placeholder={t('routes.newStopPlaceholder')}
                                    />
                                    <button 
                                        onClick={addStop} 
                                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors btt"
                                    >
                                        {t('routes.add')}
                                    </button>
            </div>

            {stops.length > 0 && (
                                    <div className="space-y-2 mt-3">
                    {stops.map(s => (
                                            <div key={s.day} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{t('routes.day')} {s.day}: {s.place}</span>
                                                <button 
                                                    className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded" 
                                                    onClick={() => removeStop(s.day)}
                                                >
                                                    {t('common.delete')}
                                                </button>
                        </div>
                    ))}
                </div>
            )}
                            </div>
                        </div>
                    </div>
                )}
            </div>


            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center max-w-full">
                <button 
                    onClick={generate}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base flex-shrink-0"
                >
                    {t('routes.generate')}
                </button>
                <button 
                    onClick={() => { 
                        setRegion('yerevan'); 
                        setEndRegion(''); 
                        setStartDate(new Date().toISOString().slice(0,10)); 
                        setDays(3); 
                        setBudget(100000); 
                        setPassengers(2); 
                        setInterestsText(''); 
                        setSelectedInterests([]);
                        setSelectedStops([]);
                        setStops([]); 
                        setGenerated(null); 
                        setItinerary(null); 
                        setEventId(''); 
                        setShowOptional(false);
                    }}
                    className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium text-sm sm:text-base flex-shrink-0"
                >
                    {t('routes.clear')}
                </button>
                <button 
                    onClick={save} 
                    disabled={!generated || saving || !localStorage.getItem('auth_token')}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-medium text-sm sm:text-base relative overflow-hidden flex-shrink-0"
                    data-save-button
                >
                    {saving && (
                        <div className="absolute inset-0 bg-green-700 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <span className={saving ? 'opacity-0' : 'opacity-100'}>
                        {saving ? t('routes.saving') : t('routes.save')}
                    </span>
                </button>
            </div>

            {/* Results Section */}
            {generated && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                    <div className="text-center space-y-2">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{t('routes.your_route')}</h4>
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>{generated.days} {t('routes.days')}</span>
                            <span>•</span>
                            <span>{generated.budget.toLocaleString()} AMD/${t('routes.per_person')}</span>
                        </div>
                    </div>
                    
                    {generated.interests.length > 0 && (
                        <div className="text-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Նախասիրություններ: </span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{generated.interests.join(', ')}</span>
                        </div>
                    )}
                    
                    {generated.stops.length > 0 && (
                        <div className="space-y-2">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('routes.intermediateStops')}</h5>
                        <div className="grid gap-2">
                            {generated.stops.map(s => (
                                    <div key={s.day} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-sm">
                                        <span className="font-medium">{t('routes.day')} {s.day}:</span> {s.place}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                    
                    {itinerary && (
                        <div className="space-y-4">
                            <h5 className="text-lg font-semibold text-gray-900 dark:text-white text-center">{t('routes.generatedRoute')}</h5>
                            <div className="space-y-3">
                                {itinerary.items.map(d => (
                                    <div key={d.day} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h6 className="font-semibold text-gray-900 dark:text-white">{t('routes.day')} {d.day}</h6>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{new Date(d.date).toLocaleDateString()}</span>
                                        </div>
                                        {d.event ? (
                                            <div className="space-y-2">
                                                <div className="font-medium text-gray-900 dark:text-white">{d.event.title}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{t('routes.region')}: {getTranslatedRegionName(d.region || '')}</div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-600 dark:text-gray-400">{t('routes.transport')}:</span>
                                                        <span className="ml-1">
                                                            {d.transport ? (
                                                                d.transport.mode === 'ride_free' ? 
                                                                    <span className="text-green-600 dark:text-green-400">
                                                                        {d.transport.description || t('routes.free_travel_plan')}
                                                                    </span> :
                                                                d.transport.mode === 'ride_paid' ? 
                                                                    <span className="text-blue-600 dark:text-blue-400">
                                                                        {d.transport.description || `${t('routes.travel_plan')} ${d.transport.perPerson.toLocaleString()} AMD/${t('routes.per_person')}`}
                                                                    </span> :
                                                                d.transport.mode === 'return' ? `${t('routes.return')} ${d.transport.perPerson.toLocaleString()} AMD/${t('routes.per_person')}` :
                                                                `${t('routes.taxi')} ~${d.transport.perPerson.toLocaleString()} AMD/${t('routes.per_person')}`
                                                            ) : '—'}
                                                        </span>
                                                        {d.transport?.route && d.transport.route.length > 0 && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {t('routes.route')}: {getTranslatedRoute(d.transport.route)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600 dark:text-gray-400">{t('routes.login')}:</span>
                                                        <span className="ml-1">{d.event.pricing.isFree ? t('routes.free') : `${d.event.pricing.price.toLocaleString()} AMD`}</span>
                                                    </div>
                                                </div>
                                                {(() => { 
                                                    const lodging = d.costPerPerson - (d.transport?.perPerson ?? 0) - (d.event?.pricing.isFree ? 0 : (d.event?.pricing.price ?? 0)); 
                                                    return lodging > 0 ? (
                                                        <div className="text-sm">
                                                            <span className="text-gray-600 dark:text-gray-400">{t('routes.accommodation')}:</span>
                                                            <span className="ml-1">{lodging.toLocaleString()} AMD/{t('routes.per_person')}</span>
                                                        </div>
                                                    ) : null 
                                                })()}
                                                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                                    <div className="flex justify-between text-sm font-medium">
                                                        <span>{t('routes.total')}:</span>
                                                        <span>{d.costPerPerson.toLocaleString()} AMD/${t('routes.per_person')} · {d.costGroup.toLocaleString()} AMD {t('routes.group_total')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : d.attraction ? (
                                            <div className="space-y-2">
                                                <div className="font-medium text-gray-900 dark:text-white">🎯 {d.attraction.title}</div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">{d.attraction.summary}</div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">{t('routes.attraction')}</div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-600 dark:text-gray-400">{t('routes.transport')}:</span>
                                                        <span className="ml-1">
                                                            {d.transport ? (
                                                                d.transport.mode === 'ride_free' ? 
                                                                    <span className="text-green-600 dark:text-green-400">
                                                                        {d.transport.description || t('routes.free_travel_plan')}
                                                                    </span> :
                                                                d.transport.mode === 'ride_paid' ? 
                                                                    <span className="text-blue-600 dark:text-blue-400">
                                                                        {d.transport.description || `${t('routes.travel_plan')} ${d.transport.perPerson.toLocaleString()} AMD/${t('routes.per_person')}`}
                                                                    </span> :
                                                                d.transport.mode === 'return' ? `${t('routes.return')} ${d.transport.perPerson.toLocaleString()} AMD/${t('routes.per_person')}` :
                                                                `${t('routes.taxi')} ~${d.transport.perPerson.toLocaleString()} AMD/${t('routes.per_person')}`
                                                            ) : '—'}
                                                        </span>
                                                        {d.transport?.route && d.transport.route.length > 0 && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                {t('routes.route')}: {getTranslatedRoute(d.transport.route)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600 dark:text-gray-400">{t('routes.login')}:</span>
                                                        <span className="ml-1 text-green-600 dark:text-green-400">{t('routes.free')}</span>
                                                    </div>
                                                </div>
                                                {(() => { 
                                                    const lodging = d.costPerPerson - (d.transport?.perPerson ?? 0); 
                                                    return lodging > 0 ? (
                                                        <div className="text-sm">
                                                            <span className="text-gray-600 dark:text-gray-400">{t('routes.accommodation')}:</span>
                                                            <span className="ml-1">{lodging.toLocaleString()} AMD/{t('routes.per_person')}</span>
                                                        </div>
                                                    ) : null 
                                                })()}
                                                <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                                                    <div className="flex justify-between text-sm font-medium">
                                                        <span>{t('routes.total')}:</span>
                                                        <span>{d.costPerPerson.toLocaleString()} AMD/${t('routes.per_person')} · {d.costGroup.toLocaleString()} AMD {t('routes.group_total')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-500 dark:text-gray-400 italic">{t('routes.no_event_found')}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    {t('routes.general_costs')}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {itinerary.totals.perPerson.toLocaleString()} AMD/${t('routes.per_person')} · {itinerary.totals.group.toLocaleString()} AMD {t('routes.group_total')}
                                </div>
                                <div className={`text-sm font-medium mt-1 ${
                                    itinerary.totals.withinBudget 
                                        ? 'text-green-600 dark:text-green-400' 
                                        : 'text-red-600 dark:text-red-400'
                                }`}>
                                    {itinerary.totals.withinBudget ? t('routes.withinBudget') : t('routes.overBudget')}
                                </div>
                        </div>
                    </div>
                )}
            </div>
            )}
        </div>
    )
}


