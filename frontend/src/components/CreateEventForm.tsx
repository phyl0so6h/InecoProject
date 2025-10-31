import React, { useState, useMemo } from 'react'

type EventFormData = {
  title: string
  description: string
  region: string
  type: string
  date: string
  imageUrl: string
}

interface Props {
  onSuccess: (event: EventFormData) => void
  onCancel: () => void
}

export function CreateEventForm({ onSuccess, onCancel }: Props): React.ReactElement {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    region: '',
    type: '',
    date: '',
    imageUrl: ''
  })

  const [loading, setLoading] = useState(false)
  const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || '/api', [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${apiUrl}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess(formData)
      } else {
        console.error('Failed to create event')
      }
    } catch (error) {
      console.error('Error creating event:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Event Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 h-24"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Region</label>
            <select
              value={formData.region}
              onChange={(e) => handleChange('region', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700"
              required
            >
              <option value="">Select Region</option>
              <option value="Երևան">Երևան</option>
              <option value="Արարատ">Արարատ</option>
              <option value="Արմավիր">Արմավիր</option>
              <option value="Գեղարքունիք">Գեղարքունիք</option>
              <option value="Կոտայք">Կոտայք</option>
              <option value="Լոռի">Լոռի</option>
              <option value="Շիրակ">Շիրակ</option>
              <option value="Սյունիք">Սյունիք</option>
              <option value="Տավուշ">Տավուշ</option>
              <option value="Վայոց Ձոր">Վայոց Ձոր</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Event Type</label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700"
              required
            >
              <option value="">Select Type</option>
              <option value="Festival">Փառատոն</option>
              <option value="Culture">Մշակույթ</option>
              <option value="Music">Երաժշտություն</option>
              <option value="Food">Խոհանոց</option>
              <option value="Sport">Սպորտ</option>
              <option value="Tradition">Ավանդույթ</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Event Date</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
