'use client';

import { useEffect } from 'react';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  dismissAfter?: number;
}

export default function SuccessMessage({ 
  message, 
  onDismiss,
  autoDismiss = true,
  dismissAfter = 3000 
}: SuccessMessageProps) {
  useEffect(() => {
    if (autoDismiss && onDismiss) {
      const timer = setTimeout(onDismiss, dismissAfter);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, onDismiss]);

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 text-green-600 dark:text-green-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            {message}
          </p>
        </div>
        {onDismiss && !autoDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
