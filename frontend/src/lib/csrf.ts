/**
 * CSRF Protection Utilities
 * 
 * Implements CSRF token generation and validation for form submissions
 */

const CSRF_TOKEN_KEY = 'csrf_token'
const CSRF_HEADER_NAME = 'X-CSRF-Token'

/**
 * Generate a random CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Store CSRF token in sessionStorage
 */
export function storeCSRFToken(token: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(CSRF_TOKEN_KEY, token)
  }
}

/**
 * Get CSRF token from sessionStorage
 */
export function getCSRFToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(CSRF_TOKEN_KEY)
  }
  return null
}

/**
 * Initialize CSRF token if not exists
 */
export function initCSRFToken(): string {
  let token = getCSRFToken()
  if (!token) {
    token = generateCSRFToken()
    storeCSRFToken(token)
  }
  return token
}

/**
 * Add CSRF token to fetch request headers
 */
export function addCSRFHeader(headers: HeadersInit = {}): HeadersInit {
  const token = getCSRFToken()
  if (token) {
    return {
      ...headers,
      [CSRF_HEADER_NAME]: token,
    }
  }
  return headers
}

/**
 * Create a fetch wrapper with CSRF protection
 */
export async function csrfFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = initCSRFToken()
  
  const headers = {
    ...options.headers,
    [CSRF_HEADER_NAME]: token,
  }

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies
  })
}

/**
 * Validate CSRF token on form submission
 */
export function validateCSRFToken(token: string): boolean {
  const storedToken = getCSRFToken()
  return storedToken === token && token.length === 64
}
