'use client';

import { useState, useEffect } from 'react';

interface ScanResult {
  id: string;
  symbol: string;
  exchange: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  strategy: string;
  signal: 'BUY' | 'SELL';
  confidence: number;
  timestamp: string;
}

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);

  // Mock scan results
  const mockResults: ScanResult[] = [
    {
      id: '1',
      symbol: 'RELIANCE',
      exchange: 'NSE',
      lastPrice: 2475.50,
      change: 24.50,
      changePercent: 1.00,
      strategy: 'Momentum Scalper',
      signal: 'BUY',
      confidence: 85,
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      symbol: 'TCS',
      exchange: 'NSE',
      lastPrice: 3495.00,
      change: -15.50,
      changePercent: -0.44,
      strategy: 'Trend Following',
      signal: 'SELL',
      confidence: 72,
      timestamp: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    // Simulate real-time scanning
    if (scanning) {
      const interval = setInterval(() => {
        setScanResults(mockResults);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [scanning]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Market Scanner
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time scanning based on your active strategies
            </p>
          </div>
          <button
            onClick={() => setScanning(!scanning)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              scanning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {scanning ? (
              <>
                <span className="inline-block w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                Stop Scanning
              </>
            ) : (
              <>
                <span className="inline-block w-2 h-2 bg-white rounded-full mr-2" />
                Start Scanning
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scanner Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {scanning ? (
              <span className="text-green-600">Scanning...</span>
            ) : (
              <span className="text-gray-500">Idle</span>
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Instruments Scanned</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {scanning ? '1,247' : '0'}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Signals Found</div>
          <div className="text-xl font-bold text-green-600">{scanResults.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Strategies</div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">2</div>
        </div>
      </div>

      {/* Scan Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Scan Results ({scanResults.length})
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {scanning ? 'Live' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Strategy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Signal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {!scanning && scanResults.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Start scanning to find trading opportunities
                    </p>
                    <button
                      onClick={() => setScanning(true)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Start Scanner
                    </button>
                  </td>
                </tr>
              ) : (
                scanResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatTime(result.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.symbol}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.exchange}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatCurrency(result.lastPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm font-semibold ${
                          result.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {result.change >= 0 ? '+' : ''}
                        {formatCurrency(result.change)}
                      </div>
                      <div
                        className={`text-xs ${
                          result.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {result.changePercent >= 0 ? '+' : ''}
                        {result.changePercent.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {result.strategy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.signal === 'BUY'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {result.signal}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              result.confidence >= 80
                                ? 'bg-green-600'
                                : result.confidence >= 60
                                ? 'bg-yellow-600'
                                : 'bg-red-600'
                            }`}
                            style={{ width: `${result.confidence}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {result.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                        View Chart
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          How Scanner Works
        </h3>
        <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
          <li>• Scanner evaluates instruments against your active strategy conditions</li>
          <li>• Scans run every 5 seconds during market hours</li>
          <li>• Signals are generated when entry conditions are met</li>
          <li>• Confidence score indicates signal strength</li>
          <li>• Click "View Chart" to analyze the opportunity in detail</li>
        </ul>
      </div>
    </div>
  );
}
