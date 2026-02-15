import { Request, Response, NextFunction } from 'express'

const CSRF_HEADER_NAME = 'x-csrf-token'

/**
 * CSRF Protection Middleware
 * Validates CSRF token from request headers
 */
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip CSRF check for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next()
  }

  const token = req.headers[CSRF_HEADER_NAME] as string

  if (!token) {
    return res.status(403).json({
      error: 'CSRF token missing',
      code: 'CSRF_TOKEN_MISSING',
    })
  }

  // Validate token format (should be 64 character hex string)
  if (!/^[a-f0-9]{64}$/.test(token)) {
    return res.status(403).json({
      error: 'Invalid CSRF token',
      code: 'CSRF_TOKEN_INVALID',
    })
  }

  // Token is valid, proceed
  next()
}

/**
 * Generate CSRF token endpoint
 */
export function generateCSRFToken(req: Request, res: Response) {
  // Generate a random token
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')

  res.json({ token })
}
