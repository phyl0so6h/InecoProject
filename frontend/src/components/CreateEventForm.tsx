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
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUrlChange = (url: string) => {
    setImageFile(null)
    setImagePreview(null)
    handleChange('imageUrl', url)
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Event Image</label>
            
            {/* Image Upload Option */}
            <div className="mb-3">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300"
              />
              <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
            </div>

            {/* Or Image URL Option */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-900 text-gray-500">or</span>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Image URL</label>
              <input
                type="url"
                value={imageFile ? '' : formData.imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-neutral-700"
                placeholder="https://example.com/image.jpg"
                disabled={!!imageFile}
              />
            </div>

            {/* Image Preview */}
            {(imagePreview || formData.imageUrl) && (
              <div className="mt-3">
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">Preview</label>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  <img
                    src={imagePreview || formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview(null)
                      setFormData(prev => ({ ...prev, imageUrl: '' }))
                    }}
                    className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
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
