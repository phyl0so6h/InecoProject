import React, { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type Event = {
  id: string
  title: string
  description: string
  region: string
  type: string
  date: string
  imageUrl: string
}

type User = {
  id: string
  email: string
  role: string
}

export function AdminPage(): React.ReactElement {
  const { t } = useTranslation()
  const [events, setEvents] = useState<Event[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState<'events' | 'users' | 'create-event'>('events')
  const [loading, setLoading] = useState(true)
  const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || '/api', [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, usersRes] = await Promise.all([
          fetch(`${apiUrl}/events`),
          fetch(`${apiUrl}/users`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            }
          })
        ])
        
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json()
          setEvents(eventsData.items || [])
        }
        
        if (usersRes.ok) {
          const usersData = await usersRes.json()
          setUsers(usersData.items || [])
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [apiUrl])

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm(t('admin.confirmDelete'))) return
    
    try {
      const response = await fetch(`${apiUrl}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (response.ok) {
        setEvents(events.filter(e => e.id !== eventId))
      }
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">{t('admin.loading')}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('admin.title')}</h1>
        <button
          onClick={() => setActiveTab('create-event')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('admin.createEvent')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'events'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('admin.eventsManagement')}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'users'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {t('admin.usersManagement')}
        </button>
      </div>

      {/* Events Management */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('admin.eventsManagement')}</h2>
          <div className="grid gap-4">
            {events.map(event => (
              <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{event.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>{t('admin.region')}: {event.region}</span>
                      <span>{t('admin.type')}: {event.type}</span>
                      <span>{t('admin.date')}: {new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {/* Edit functionality */}}
                      className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                    >
                      {t('admin.edit')}
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      {t('admin.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('admin.usersManagement')}</h2>
          <div className="grid gap-4">
            {users.map(user => (
              <div key={user.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{user.email}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{t('admin.role')}: {user.role}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {/* Edit user role */}}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      {t('admin.changeRole')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Event */}
      {activeTab === 'create-event' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('admin.createNewEvent')}</h2>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-green-700 dark:text-green-300">
              {t('admin.createEventDescription')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}