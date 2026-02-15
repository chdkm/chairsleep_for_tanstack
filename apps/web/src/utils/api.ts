export const API_URL = 'http://localhost:4000/api'

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Important for cookies
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(error.error || 'Request failed')
    }

    return response.json()
}
