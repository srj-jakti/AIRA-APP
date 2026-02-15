'use client';

import { FormattedError } from '@/lib/errorHandler';

interface ErrorDisplayProps {
  error: FormattedError | string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorDisplay({ error, onRetry, onDismiss }: ErrorDisplayProps) {
  const formattedError = typeof error === 'string' 
    ? { title: 'Error', message: error, severity: 'error' as const }
    : error;

  const severityStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    critical: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      border: 'border-red-300 dark:border-red-700',
      text: 'text-red-900 dark:text-red-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const styles = severityStyles[formattedError.severity];

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4`}>
      <div className="flex items-start">
        <div className={`${styles.text} flex-shrink-0`}>
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${styles.text}`}>
            {formattedError.title}
          </h3>
          <div className={`mt-2 text-sm ${styles.text}`}>
            <p>{formattedError.message}</p>
            {formattedError.suggestion && (
              <p className="mt-2 font-medium">
                💡 {formattedError.suggestion}
              </p>
            )}
          </div>
          {(onRetry || onDismiss) && (
            <div className="mt-4 flex gap-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`text-sm font-medium ${styles.text} hover:underline`}
                >
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className={`text-sm font-medium ${styles.text} hover:underline`}
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
