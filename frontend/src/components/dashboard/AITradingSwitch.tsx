'use client';

import { useState } from 'react';

interface AITradingSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function AITradingSwitch({ enabled, onChange }: AITradingSwitchProps) {
  const [showWarning, setShowWarning] = useState(false);

  const handleToggle = () => {
    if (!enabled) {
      // Show warning when enabling
      setShowWarning(true);
    } else {
      // Disable immediately
      onChange(false);
    }
  };

  const confirmEnable = () => {
    onChange(true);
    setShowWarning(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Trading</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {enabled ? 'AI is actively trading' : 'AI trading is disabled'}
            </p>
          </div>
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              enabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                enabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Risk Warning</h3>
            </div>

            <div className="mb-6 space-y-3">
              <p className="text-gray-700 dark:text-gray-300">
                You are about to enable AI-powered automated trading. Please understand the following risks:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>AI trading involves significant financial risk</li>
                <li>Past performance does not guarantee future results</li>
                <li>You may lose some or all of your invested capital</li>
                <li>AI will execute trades automatically based on your active strategies</li>
                <li>Ensure your risk limits are properly configured</li>
                <li>Monitor your account regularly</li>
              </ul>
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                  SEBI Disclaimer: AIRA is a technology platform and not a SEBI registered investment advisor. 
                  We do not provide investment advice. All trading decisions are made by you or your configured AI strategies.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmEnable}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                I Understand, Enable AI
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
