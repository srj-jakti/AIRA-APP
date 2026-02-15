/**
 * Centralized Error Handling Utility
 * Provides user-friendly error messages and logging
 */

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface ErrorDetails {
  message: string;
  code?: string;
  severity: ErrorSeverity;
  context?: Record<string, any>;
  timestamp: Date;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: any): string {
  // Network errors
  if (error.message?.includes('fetch') || error.message?.includes('network')) {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Authentication errors
  if (error.status === 401 || error.message?.includes('unauthorized')) {
    return 'Your session has expired. Please sign in again.';
  }

  if (error.status === 403 || error.message?.includes('forbidden')) {
    return 'You do not have permission to perform this action.';
  }

  // Validation errors
  if (error.status === 400 || error.message?.includes('validation')) {
    return error.message || 'Invalid input. Please check your data and try again.';
  }

  // Server errors
  if (error.status >= 500) {
    return 'Server error. Our team has been notified. Please try again later.';
  }

  // Trading-specific errors
  if (error.message?.includes('insufficient balance')) {
    return 'Insufficient balance to execute this trade.';
  }

  if (error.message?.includes('market closed')) {
    return 'Market is currently closed. Trading hours: 9:15 AM - 3:30 PM IST.';
  }

  if (error.message?.includes('risk limit')) {
    return 'Daily risk limit reached. Trading has been paused for today.';
  }

  if (error.message?.includes('API key')) {
    return 'API connection error. Please check your API credentials in Settings.';
  }

  // Payment errors
  if (error.message?.includes('payment')) {
    return 'Payment failed. Please check your payment details and try again.';
  }

  // Default message
  return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Determine error severity
 */
export function getErrorSeverity(error: any): ErrorSeverity {
  // Critical errors
  if (
    error.status >= 500 ||
    error.message?.includes('database') ||
    error.message?.includes('critical')
  ) {
    return 'critical';
  }

  // Errors
  if (
    error.status === 400 ||
    error.status === 401 ||
    error.status === 403 ||
    error.status === 404 ||
    error.message?.includes('error')
  ) {
    return 'error';
  }

  // Warnings
  if (error.message?.includes('warning') || error.message?.includes('limit')) {
    return 'warning';
  }

  // Info
  return 'info';
}

/**
 * Log error (will integrate with Sentry in production)
 */
export function logError(error: any, context?: Record<string, any>): void {
  const errorDetails: ErrorDetails = {
    message: error.message || 'Unknown error',
    code: error.code || error.status?.toString(),
    severity: getErrorSeverity(error),
    context: {
      ...context,
      stack: error.stack,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    },
    timestamp: new Date(),
  };

  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Handler]', errorDetails);
  }

  // TODO: Send to Sentry in production
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, {
  //     level: errorDetails.severity,
  //     contexts: { custom: errorDetails.context },
  //   });
  // }
}

/**
 * Handle API errors
 */
export async function handleApiError(response: Response): Promise<never> {
  let errorMessage = 'An error occurred';
  
  try {
    const data = await response.json();
    errorMessage = data.error || data.message || errorMessage;
  } catch {
    errorMessage = response.statusText || errorMessage;
  }

  const err = new Error(errorMessage) as any;
  err.status = response.status;
  
  logError(err, { endpoint: response.url });
  throw err;
}

/**
 * Provide error recovery suggestions
 */
export function getRecoverySuggestion(error: any): string | null {
  if (error.message?.includes('network')) {
    return 'Check your internet connection and refresh the page.';
  }

  if (error.status === 401) {
    return 'Please sign in again to continue.';
  }

  if (error.message?.includes('API key')) {
    return 'Go to Settings → User API to update your credentials.';
  }

  if (error.message?.includes('risk limit')) {
    return 'You can adjust your risk limits in Settings → Risk Settings.';
  }

  if (error.message?.includes('payment')) {
    return 'Contact support if the issue persists.';
  }

  return null;
}

/**
 * Format error for display
 */
export interface FormattedError {
  title: string;
  message: string;
  suggestion?: string;
  severity: ErrorSeverity;
}

export function formatError(error: any, context?: Record<string, any>): FormattedError {
  logError(error, context);

  return {
    title: getErrorTitle(error),
    message: getUserFriendlyMessage(error),
    suggestion: getRecoverySuggestion(error) || undefined,
    severity: getErrorSeverity(error),
  };
}

function getErrorTitle(error: any): string {
  const severity = getErrorSeverity(error);

  switch (severity) {
    case 'critical':
      return 'Critical Error';
    case 'error':
      return 'Error';
    case 'warning':
      return 'Warning';
    case 'info':
      return 'Notice';
    default:
      return 'Error';
  }
}
