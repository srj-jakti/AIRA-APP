'use client';

import { useEffect, useRef } from 'react';

interface PerformanceData {
  time: string;
  value: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
  loading?: boolean;
}

export default function PerformanceChart({ data, loading = false }: PerformanceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || loading || data.length === 0) return;

    // Lightweight Charts will be integrated here
    // For now, we'll show a placeholder
    
    return () => {
      // Cleanup chart
    };
  }, [data, loading]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Performance</h3>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Calculate performance metrics
  const totalPnL = data.length > 0 ? data[data.length - 1].value - data[0].value : 0;
  const pnlPercentage = data.length > 0 ? ((totalPnL / data[0].value) * 100) : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)}
              </div>
              <div className={`text-sm ${
                totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {pnlPercentage >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {data.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
            No performance data available
          </div>
        ) : (
          <div ref={chartContainerRef} className="h-64">
            {/* Placeholder for Lightweight Charts */}
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="text-center">
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
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  Chart will be rendered here
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Using Lightweight Charts library
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Today</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {data.length > 0 ? data[data.length - 1].value.toFixed(2) : '0.00'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">This Week</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {totalPnL.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">This Month</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {totalPnL.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
