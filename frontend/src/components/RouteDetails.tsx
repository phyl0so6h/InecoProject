import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface RouteDetails {
  id: string
  name: string
  description: string
  days: number
  budget: number
  interests: string[]
  stops: Array<{ day: number; place: string }>
  createdAt: string
  itinerary?: Array<{
    day: number
    date: string
    region: string | null
    event: {
      id: string
      title: string
      region: string
      pricing: { isFree: boolean; price: number }
    } | null
    attraction: {
      id: string
      title: string
      summary: string
      imageUrl: string
    } | null
    transport: {
      mode: 'ride_free' | 'ride_paid' | 'taxi' | 'return'
      perPerson: number
      total: number
      description?: string
    } | null
    costPerPerson: number
    costGroup: number
  }>
}

export function RouteDetails(): React.ReactElement {
  const { t } = useTranslation()
  const { routeId } = useParams<{ routeId: string }>()
  const navigate = useNavigate()
  const [route, setRoute] = useState<RouteDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [itinerary, setItinerary] = useState<any>(null)
  const [itineraryLoading, setItineraryLoading] = useState(false)
  const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || '/api', [])

  useEffect(() => {
    const fetchRouteDetails = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${apiUrl}/routes/${routeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setRoute(data)
          
          // Generate itinerary for the route
          if (data) {
            setItineraryLoading(true)
            try {
              const itineraryResponse = await fetch(`${apiUrl}/itinerary`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                  startDate: new Date().toISOString().slice(0, 10),
                  days: data.days,
                  budgetPerPerson: data.budget,
                  interests: data.interests || [],
                  passengers: 2, // Default passengers
                  startRegion: 'Երևան', // Default start region
                  endRegion: '',
                  lng: 'hy'
                })
              })
              
              if (itineraryResponse.ok) {
                const itineraryData = await itineraryResponse.json()
                setItinerary(itineraryData)
              }
            } catch (error) {
              console.error('Failed to generate itinerary:', error)
            } finally {
              setItineraryLoading(false)
            }
          }
        } else {
          navigate('/profile/routes')
        }
      } catch (error) {
        console.error('Failed to fetch route details:', error)
        navigate('/profile/routes')
      } finally {
        setLoading(false)
      }
    }

    if (routeId) {
      fetchRouteDetails()
    }
  }, [routeId, navigate, apiUrl])

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC9E82]"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('profile.loading')}</p>
        <p className="mt-2 text-sm text-gray-500">Route ID: {routeId}</p>
      </div>
    )
  }

  if (!route) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('profile.routeNotFound')}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{t('profile.routeNotFoundDescription')}</p>
        <button
          onClick={() => navigate('/profile/routes')}
          className="px-4 py-2 bg-[#BC9E82] text-white rounded-lg hover:bg-[#A68B5B] transition-colors"
        >
          {t('profile.backToRoutes')}
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/profile/routes')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{route.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{route.description}</p>
          </div>
        </div>

        {/* Route Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('routes.days')}</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{route.days}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('routes.budget')}</h3>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{route.budget.toLocaleString()} AMD</p>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{t('routes.interests')}</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{route.interests.length}</p>
          </div>
        </div>

        {/* Interests */}
        {route.interests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('routes.interests')}</h3>
            <div className="flex flex-wrap gap-2">
              {route.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[#BC9E82]/10 dark:bg-[#BC9E82]/20 text-[#BC9E82] dark:text-[#BC9E82] rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stops */}
        {route.stops.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('routes.stops')}</h3>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="space-y-4">
                {route.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#BC9E82] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {stop.day}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{stop.place}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Itinerary */}
        {itineraryLoading ? (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('routes.itinerary')}</h3>
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#BC9E82]"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('profile.loading')}</p>
            </div>
          </div>
        ) : itinerary && itinerary.items && itinerary.items.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('routes.itinerary')}</h3>
            <div className="space-y-6">
              {itinerary.items.map((day: any, index: number) => (
                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-[#BC9E82] text-white rounded-full flex items-center justify-center font-bold">
                      {day.day}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{t('routes.day')} {day.day}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(day.date).toLocaleDateString()}</p>
                      {day.region && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('routes.region')}: {day.region}</p>
                      )}
                    </div>
                  </div>

                  {day.event && (
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{t('routes.event')}</h5>
                      <p className="text-blue-700 dark:text-blue-300">{day.event.title}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        {day.event.pricing.isFree ? t('routes.free') : `${day.event.pricing.price.toLocaleString()} AMD`}
                      </p>
                    </div>
                  )}

                  {day.attraction && (
                    <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h5 className="font-medium text-green-900 dark:text-green-100 mb-2">{t('routes.attraction')}</h5>
                      <p className="text-green-700 dark:text-green-300">{day.attraction.title}</p>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">{day.attraction.summary}</p>
                    </div>
                  )}

                  {day.transport && (
                    <div className="mb-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <h5 className="font-medium text-orange-900 dark:text-orange-100 mb-2">{t('routes.transport')}</h5>
                      <p className="text-orange-700 dark:text-orange-300">
                        {day.transport.mode === 'ride_free' && t('routes.rideFree')}
                        {day.transport.mode === 'ride_paid' && t('routes.ridePaid')}
                        {day.transport.mode === 'taxi' && t('routes.taxi')}
                        {day.transport.mode === 'return' && t('routes.return')}
                      </p>
                      {day.transport.description && (
                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">{day.transport.description}</p>
                      )}
                      {day.transport.perPerson > 0 && (
                        <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                          {day.transport.perPerson.toLocaleString()} AMD {t('routes.perPerson')}
                        </p>
                      )}
                      {day.transport.route && (
                        <p className="text-sm text-orange-500 dark:text-orange-300 mt-1">
                          {t('routes.route')}: {day.transport.route.join(' → ')}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Accommodation Cost */}
                  {day.day < itinerary.items.length && (
                    <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h5 className="font-medium text-purple-900 dark:text-purple-100 mb-2">{t('routes.accommodation')}</h5>
                      <p className="text-purple-700 dark:text-purple-300">
                        {t('routes.hotel_per_night')}: 10,000 AMD {t('routes.perPerson')}
                      </p>
                      <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                        {t('routes.total_accommodation')}: 10,000 AMD {t('routes.perPerson')}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{t('routes.costPerPerson')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{day.costPerPerson.toLocaleString()} AMD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Summary */}
        {itinerary && itinerary.totals && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('routes.summary')}</h3>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('routes.total_days')}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{route.days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('routes.total_cost')} ({t('routes.per_person')})</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{itinerary.totals.perPerson.toLocaleString()} AMD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('routes.total_cost')} ({t('routes.group_total')})</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{itinerary.totals.group.toLocaleString()} AMD</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{t('routes.budget')}</span>
                    <span className="text-lg font-bold text-[#BC9E82]">{route.budget.toLocaleString()} AMD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('routes.budget_status')}</span>
                    <span className={`font-semibold ${itinerary.totals.withinBudget ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {itinerary.totals.withinBudget ? t('routes.withinBudget') : t('routes.overBudget')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('profile.saved')}: {new Date(route.createdAt).toLocaleDateString()}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/profile/routes')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('profile.backToRoutes')}
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#BC9E82] text-white rounded-lg hover:bg-[#A68B5B] transition-colors"
              >
                {t('routes.print')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
