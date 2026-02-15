'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import TradeModeToggle from '@/components/dashboard/TradeModeToggle';
import AITradingSwitch from '@/components/dashboard/AITradingSwitch';
import BalanceCard from '@/components/dashboard/BalanceCard';
import PositionsTable from '@/components/dashboard/PositionsTable';
import OrdersTable from '@/components/dashboard/OrdersTable';
import PerformanceChart from '@/components/dashboard/PerformanceChart';

export default function DashboardPage() {
  const { user } = useAuth();
  const { connected, onPositionUpdate, onOrderUpdate, onTicks } = useWebSocket();
  const [tradeMode, setTradeMode] = useState<'live' | 'paper'>('live');
  const [aiTradingEnabled, setAiTradingEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data - will be replaced with real data from API
  const [balance, setBalance] = useState({
    total: 100000,
    available: 75000,
    used: 25000,
  });

  const [positions, setPositions] = useState([
    {
      id: '1',
      tradingsymbol: 'RELIANCE',
      exchange: 'NSE',
      quantity: 10,
      averagePrice: 2450.50,
      lastPrice: 2475.00,
      pnl: 245.00,
      pnlPercentage: 1.00,
      product: 'MIS',
    },
    {
      id: '2',
      tradingsymbol: 'TCS',
      exchange: 'NSE',
      quantity: 5,
      averagePrice: 3520.00,
      lastPrice: 3495.50,
      pnl: -122.50,
      pnlPercentage: -0.70,
      product: 'CNC',
    },
  ]);

  const [orders, setOrders] = useState([
    {
      id: '1',
      tradingsymbol: 'INFY',
      exchange: 'NSE',
      transactionType: 'BUY' as const,
      quantity: 15,
      price: 1450.00,
      status: 'COMPLETE' as const,
      orderType: 'MARKET',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      tradingsymbol: 'HDFC',
      exchange: 'NSE',
      transactionType: 'SELL' as const,
      quantity: 8,
      price: 1620.50,
      status: 'PENDING' as const,
      orderType: 'LIMIT',
      timestamp: new Date().toISOString(),
    },
  ]);

  const [performanceData, setPerformanceData] = useState([
    { time: '09:15', value: 100000 },
    { time: '10:00', value: 100500 },
    { time: '11:00', value: 100200 },
    { time: '12:00', value: 100800 },
    { time: '13:00', value: 101200 },
    { time: '14:00', value: 100900 },
    { time: '15:00', value: 101500 },
  ]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);

    // Setup WebSocket listeners
    onPositionUpdate((position) => {
      console.log('Position update:', position);
      // Update positions state with real-time data
      setPositions(prev => {
        const index = prev.findIndex(p => p.id === position.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...position };
          return updated;
        }
        return [...prev, position];
      });
    });

    onOrderUpdate((order) => {
      console.log('Order update:', order);
      // Update orders state with real-time data
      setOrders(prev => {
        const index = prev.findIndex(o => o.id === order.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = { ...updated[index], ...order };
          return updated;
        }
        return [...prev, order];
      });
    });

    onTicks((ticks) => {
      // Update last prices in positions based on ticks
      setPositions(prev => prev.map(position => {
        const tick = ticks.find(t => t.instrument_token === parseInt(position.id));
        if (tick) {
          const pnl = (tick.last_price - position.averagePrice) * position.quantity;
          const pnlPercentage = ((tick.last_price - position.averagePrice) / position.averagePrice) * 100;
          return {
            ...position,
            lastPrice: tick.last_price,
            pnl,
            pnlPercentage,
          };
        }
        return position;
      }));
    });
  }, [onPositionUpdate, onOrderUpdate, onTicks]);

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'CANCELLED' as const }
          : order
      ));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.email || 'Trader'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TradeModeToggle mode={tradeMode} onChange={setTradeMode} />
        <AITradingSwitch enabled={aiTradingEnabled} onChange={setAiTradingEnabled} />
      </div>

      {/* Balance Card */}
      <div className="mb-6">
        <BalanceCard
          balance={balance.total}
          availableMargin={balance.available}
          usedMargin={balance.used}
          loading={loading}
        />
      </div>

      {/* Performance Chart */}
      <div className="mb-6">
        <PerformanceChart data={performanceData} loading={loading} />
      </div>

      {/* Positions Table */}
      <div className="mb-6">
        <PositionsTable positions={positions} loading={loading} />
      </div>

      {/* Orders Table */}
      <div className="mb-6">
        <OrdersTable 
          orders={orders} 
          onCancelOrder={handleCancelOrder}
          loading={loading}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Trades</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">24</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Win Rate</div>
          <div className="text-2xl font-bold text-green-600">62.5%</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Strategies</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">3</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Today's P&L</div>
          <div className="text-2xl font-bold text-green-600">+₹1,500</div>
        </div>
      </div>
    </div>
  );
}
