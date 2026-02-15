import { Request, Response, NextFunction } from 'express';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AppError extends Error {
  status?: number;
  severity?: ErrorSeverity;
  code?: string;
  isOperational?: boolean;
}

/**
 * Create an operational error (expected errors)
 */
export function createError(
  message: string,
  status: number = 500,
  severity: ErrorSeverity = 'error',
  code?: string
): AppError {
  const error = new Error(message) as AppError;
  error.status = status;
  error.severity = severity;
  error.code = code;
  error.isOperational = true;
  return error;
}

/**
 * Determine error severity based on status code
 */
function getErrorSeverity(status: number): ErrorSeverity {
  if (status >= 500) return 'critical';
  if (status >= 400) return 'error';
  if (status >= 300) return 'warning';
  return 'info';
}

/**
 * Get user-friendly error message
 */
function getUserFriendlyMessage(error: AppError, isAdmin: boolean): string {
  // Show technical details only to admins
  if (isAdmin && error.message) {
    return error.message;
  }

  // User-friendly messages based on status code
  switch (error.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Authentication required. Please sign in.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Internal server error. Our team has been notified.';
    case 503:
      return 'Service temporarily unavailable. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Log error with appropriate severity
 */
function logError(error: AppError, req: Request): void {
  const severity = error.severity || getErrorSeverity(error.status || 500);
  
  const errorLog = {
    severity,
    message: error.message,
    code: error.code,
    status: error.status,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: (req as any).user?.id,
    timestamp: new Date().toISOString(),
  };

  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Handler]', errorLog);
  }

  // TODO: Send to Sentry in production
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, {
  //     level: severity,
  //     contexts: { custom: errorLog },
  //   });
  // }

  // TODO: Alert administrators for critical errors
  // if (severity === 'critical') {
  //   alertAdministrators(errorLog);
  // }
}

/**
 * Error handling middleware
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Set default values
  err.status = err.status || 500;
  err.severity = err.severity || getErrorSeverity(err.status);

  // Log the error
  logError(err, req);

  // Check if user is admin
  const isAdmin = (req as any).user?.subscription === 'admin';

  // Send response
  res.status(err.status).json({
    error: getUserFriendlyMessage(err, isAdmin),
    code: err.code,
    ...(process.env.NODE_ENV === 'development' && {
      message: err.message,
      stack: err.stack,
    }),
  });
}

/**
 * Async error wrapper
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Not found handler
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const error = createError(
    `Route ${req.originalUrl} not found`,
    404,
    'warning',
    'ROUTE_NOT_FOUND'
  );
  next(error);
}
