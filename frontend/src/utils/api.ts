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
 * @param endpoint - API endpoint path (e.g., 'events' or 'api/events' or '/api/events')
 * @returns Full URL for the endpoint
 */
export function buildApiUrl(endpoint: string): string {
    const apiUrl = getApiUrl()

    // Remove leading/trailing slashes from endpoint
    const cleanEndpoint = endpoint.replace(/^\/+|\/+$/g, '')

    // Remove /api prefix from endpoint if present (we'll add it conditionally)
    const endpointWithoutApi = cleanEndpoint.replace(/^api\//, '')

    // If apiUrl is a full URL (production), add /api prefix
    if (apiUrl.startsWith('http')) {
        return `${apiUrl}/api/${endpointWithoutApi}`
    }

    // If apiUrl is relative (/api for vite proxy), endpoint should NOT have /api
    // because vite proxy already handles /api -> backend
    return `${apiUrl}/${endpointWithoutApi}`
}

// Example usage:
// buildApiUrl('events') -> '/api/events' (dev) or 'https://backend.onrender.com/api/events' (prod)
// buildApiUrl('api/events') -> '/api/events' (dev) or 'https://backend.onrender.com/api/events' (prod)

