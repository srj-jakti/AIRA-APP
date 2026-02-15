'use client';

interface BalanceCardProps {
  balance: number;
  availableMargin: number;
  usedMargin: number;
  loading?: boolean;
}

export default function BalanceCard({ 
  balance, 
  availableMargin, 
  usedMargin, 
  loading = false 
}: BalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold opacity-90">Account Balance</h3>
        <svg
          className="w-8 h-8 opacity-80"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-bold mb-1">{formatCurrency(balance)}</div>
        <div className="text-sm opacity-80">Total Balance</div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
        <div>
          <div className="text-2xl font-semibold">{formatCurrency(availableMargin)}</div>
          <div className="text-xs opacity-80">Available Margin</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{formatCurrency(usedMargin)}</div>
          <div className="text-xs opacity-80">Used Margin</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm">
          <span className="opacity-80">Last Updated</span>
          <span className="font-medium">{new Date().toLocaleTimeString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}
