'use client';

import { useState } from 'react';

interface TradeModeToggleProps {
  mode: 'live' | 'paper';
  onChange: (mode: 'live' | 'paper') => void;
}

export default function TradeModeToggle({ mode, onChange }: TradeModeToggleProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">
        Trading Mode
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange('live')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'live'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${mode === 'live' ? 'bg-white' : 'bg-green-500'}`} />
            Live Trade
          </div>
        </button>
        <button
          onClick={() => onChange('paper')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'paper'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${mode === 'paper' ? 'bg-white' : 'bg-blue-500'}`} />
            Paper Trade
          </div>
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {mode === 'live' 
          ? 'Trading with real money. All trades will be executed on your broker account.'
          : 'Practice trading with virtual money. No real trades will be executed.'}
      </p>
    </div>
  );
}
