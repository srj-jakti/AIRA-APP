'use client';

import { useEffect, useState } from 'react';

interface BacktestResultsProps {
  strategyId: string;
}

interface BacktestData {
  strategyId: string;
  instrument: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  totalReturnPercent: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  grossProfit: number;
  grossLoss: number;
  netProfit: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  sharpeRatio: number;
  equityCurve: Array<{ date: string; equity: number }>;
  trades: Array<{
    entryTime: string;
    exitTime: string;
    entryPrice: number;
    exitPrice: number;
    quantity: number;
    profitLoss: number;
    profitLossPercent: number;
    type: string;
    exitReason: string;
  }>;
}

export default function BacktestResults({ strategyId }: BacktestResultsProps) {
  const [results, setResults] = useState<BacktestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBacktestResults();
  }, [strategyId]);

  const fetchBacktestResults = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/backtest/${strategyId}`);
      const data = await response.json();

      if (data.success) {
        setResults(data.data);
      } else {
        setError(data.error || 'Failed to load backtest results');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load backtest results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-800 dark:text-yellow-200">No backtest results available. Run a backtest first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Return</p>
          <p className={`text-2xl font-bold ${results.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ₹{results.totalReturn.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
          <p className={`text-sm ${results.totalReturnPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {results.totalReturnPercent.toFixed(2)}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Win Rate</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {results.winRate.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {results.winningTrades}/{results.totalTrades} trades
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Profit Factor</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {results.profitFactor.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {results.profitFactor >= 1.5 ? 'Good' : results.profitFactor >= 1 ? 'Fair' : 'Poor'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Max Drawdown</p>
          <p className="text-2xl font-bold text-red-600">
            {results.maxDrawdownPercent.toFixed(2)}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ₹{results.maxDrawdown.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Trades</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{results.totalTrades}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Winning Trades</p>
            <p className="text-lg font-semibold text-green-600">{results.winningTrades}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Losing Trades</p>
            <p className="text-lg font-semibold text-red-600">{results.losingTrades}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gross Profit</p>
            <p className="text-lg font-semibold text-green-600">
              ₹{results.grossProfit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Gross Loss</p>
            <p className="text-lg font-semibold text-red-600">
              ₹{results.grossLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Net Profit</p>
            <p className={`text-lg font-semibold ${results.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{results.netProfit.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Win</p>
            <p className="text-lg font-semibold text-green-600">
              ₹{results.averageWin.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Loss</p>
            <p className="text-lg font-semibold text-red-600">
              ₹{results.averageLoss.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {results.sharpeRatio.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Equity Curve Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Equity Curve</h3>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          {/* Placeholder for chart - would integrate with Lightweight Charts */}
          <p>Chart visualization would go here</p>
        </div>
      </div>

      {/* Trade List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Trade History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Entry</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Exit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Entry Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Exit Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">P&L</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">P&L %</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Exit Reason</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {results.trades.map((trade, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {new Date(trade.entryTime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {new Date(trade.exitTime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    ₹{trade.entryPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    ₹{trade.exitPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {trade.quantity}
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold ${trade.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{trade.profitLoss.toFixed(2)}
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold ${trade.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trade.profitLossPercent.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white capitalize">
                    {trade.exitReason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
