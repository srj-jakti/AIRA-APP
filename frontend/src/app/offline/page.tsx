'use client';

import { WifiOff } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
            <WifiOff className="w-10 h-10 text-slate-400" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          You&apos;re Offline
        </h1>
        
        <p className="text-slate-400 mb-8">
          It looks like you&apos;ve lost your internet connection. Some features may not be available until you&apos;re back online.
        </p>
        
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-3">
            What you can do:
          </h2>
          <ul className="text-left text-slate-300 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>View cached pages and data</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Review your strategies and settings</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Check your last synced trading history</span>
            </li>
          </ul>
        </div>
        
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Try Again
        </button>
        
        <p className="text-sm text-slate-500 mt-6">
          AIRA will automatically reconnect when your internet is restored
        </p>
      </div>
    </div>
  );
}
