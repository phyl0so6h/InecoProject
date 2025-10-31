import React, { useState, useMemo } from 'react'

type RouteFormData = {
  name: string
  description: string
  from: string
  to: string
  date: string
  seats: number
  route: string[]
  eventId: string
}

interface Props {
  onSuccess: (route: RouteFormData) => void
  onCancel: () => void
}

export function CreateRouteForm({ onSuccess, onCancel }: Props): React.ReactElement {
  const [formData, setFormData] = useState<RouteFormData>({
    name: '',
    description: '',
    from: 'Երևան',
    to: '',
    date: '',
    seats: 1,
    route: ['Երևան'],
    eventId: ''
  })

  const [loading, setLoading] = useState(false)
  const [newStop, setNewStop] = useState('')
  const apiUrl = useMemo(() => (import.meta as any).env?.VITE_API_URL || '/api', [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`${apiUrl}/api/travel-plans`, {
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
        console.error('Failed to create route')
      }
    } catch (error) {
      console.error('Error creating route:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof RouteFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addStop = () => {
    if (newStop.trim() && !formData.route.includes(newStop.trim())) {
      setFormData(prev => ({
        ...prev,
        route: [...prev.route, newStop.trim()]
      }))
      setNewStop('')
    }
  }

  const removeStop = (index: number) => {
    if (index > 0) { // Keep first stop (usually Երևան)
      setFormData(prev => ({
        ...prev,
        route: prev.route.filter((_, i) => i !== index)
      }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Travel Route</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Route Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700"
            placeholder="e.g., Երևան → Վայոց Ձոր"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 h-20"
            placeholder="Describe your travel plan..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">From</label>
            <input
              type="text"
              value={formData.from}
              onChange={(e) => handleChange('from', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To</label>
            <select
              value={formData.to}
              onChange={(e) => handleChange('to', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700"
              required
            >
              <option value="">Select Destination</option>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Departure Date & Time</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Available Seats</label>
            <input
              type="number"
              min="1"
              max="8"
              value={formData.seats}
              onChange={(e) => handleChange('seats', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Route Stops</label>
          <div className="space-y-2">
            {formData.route.map((stop, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="flex-1 p-2 bg-gray-50 dark:bg-gray-800 rounded">{stop}</span>
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeStop(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newStop}
                onChange={(e) => setNewStop(e.target.value)}
                placeholder="Add stop..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-neutral-700"
              />
              <button
                type="button"
                onClick={addStop}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Route'}
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
