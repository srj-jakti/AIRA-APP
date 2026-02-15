import rateLimit from 'express-rate-limit'

/**
 * Rate limiter for login attempts
 * Limits to 5 attempts per 15 minutes per IP address
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many login attempts. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Store rate limit data in memory (for production, use Redis)
  skipSuccessfulRequests: false, // Count successful requests
  skipFailedRequests: false, // Count failed requests
})

/**
 * Rate limiter for API endpoints
 * Limits to 100 requests per 15 minutes per IP address
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
})

/**
 * Rate limiter for sensitive operations (password reset, API key updates)
 * Limits to 3 attempts per hour per IP address
 */
export const sensitiveOperationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per windowMs
  message: {
    error: 'Too many attempts for this sensitive operation. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
})
