/**
 * API URL helper utility
 * Handles both relative paths (/api for vite proxy) and absolute URLs (production)
 */

export function getApiUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_API_URL
  // If VITE_API_URL is not set, use '/api' for local dev (vite proxy)
  // But in production, it should be set to full backend URL
  return envUrl || '/api'
}

/**
 * Builds the correct API endpoint URL
 * @param endpoint - API endpoint path (e.g., '/api/events' or '/events')
 * @returns Full URL for the endpoint
 */
export function buildApiUrl(endpoint: string): string {
  const apiUrl = getApiUrl()
  
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  
  // If apiUrl is a full URL (starts with http), append the endpoint
  if (apiUrl.startsWith('http')) {
    // If endpoint already has /api prefix, use it as-is
    if (cleanEndpoint.startsWith('api/')) {
      return `${apiUrl}/${cleanEndpoint}`
    }
    // Otherwise, add /api prefix
    return `${apiUrl}/api/${cleanEndpoint}`
  }
  
  // If apiUrl is relative (/api), the endpoint should NOT have /api prefix
  // because vite proxy already handles /api -> backend
  if (cleanEndpoint.startsWith('api/')) {
    // Remove /api prefix for relative paths (vite proxy handles it)
    const withoutApi = cleanEndpoint.replace(/^api\//, '')
    return `${apiUrl}/${withoutApi}`
  }
  
  return `${apiUrl}/${cleanEndpoint}`
}

// Example usage:
// buildApiUrl('events') -> '/api/events' (dev) or 'https://backend.onrender.com/api/events' (prod)
// buildApiUrl('api/events') -> '/api/events' (dev) or 'https://backend.onrender.com/api/events' (prod)

