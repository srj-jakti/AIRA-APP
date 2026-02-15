'use client';

import { usePWA } from '@/hooks/usePWA';
import { Wifi, WifiOff, Smartphone } from 'lucide-react';

export default function PWAStatus() {
  const { isInstalled, isOnline } = usePWA();

  return (
    <div className="flex items-center gap-2">
      {/* Online/Offline Status */}
      <div
        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
          isOnline
            ? 'bg-green-500/10 text-green-500'
            : 'bg-red-500/10 text-red-500'
        }`}
        title={isOnline ? 'Online' : 'Offline'}
      >
        {isOnline ? (
          <Wifi className="w-3.5 h-3.5" />
        ) : (
          <WifiOff className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* PWA Installed Status */}
      {isInstalled && (
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-500"
          title="App Installed"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">App Mode</span>
        </div>
      )}
    </div>
  );
}
