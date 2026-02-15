'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type StrategyTab = 'active' | 'create' | 'private' | 'public' | 'ai' | 'invite';

interface Strategy {
  id: string;
  name: string;
  description: string;
  category: string;
  visibility: string;
  isActive: boolean;
  userId: string;
  createdAt: string;
}

interface StrategyPerformance {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  totalPnL: number;
  averagePnL: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

export default function StrategyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<StrategyTab>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State for different strategy lists
  const [activeStrategies, setActiveStrategies] = useState<Strategy[]>([]);
  const [privateStrategies, setPrivateStrategies] = useState<Strategy[]>([]);
  const [publicStrategies, setPublicStrategies] = useState<Strategy[]>([]);
  const [aiStrategies, setAiStrategies] = useState<Strategy[]>([]);
  const [inviteStrategies, setInviteStrategies] = useState<Strategy[]>([]);
  
  // Performance data
  const [performanceData, setPerformanceData] = useState<Record<string, StrategyPerformance>>({});
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const tabs = [
    { id: 'active' as const, name: 'Active Strategies', icon: '✓' },
    { id: 'create' as const, name: 'Create Strategy', icon: '+' },
    { id: 'private' as const, name: 'My Strategies', icon: '🔒' },
    { id: 'public' as const, name: 'Marketplace', icon: '🌐' },
    { id: 'ai' as const, name: 'AI Strategies', icon: '🤖' },
    { id: 'invite' as const, name: 'Invite Only', icon: '👥' },
  ];

  const userId = 'user-123'; // TODO: Get from auth context
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

  // Fetch strategies based on active tab
  useEffect(() => {
    fetchStrategies();
  }, [activeTab, searchQuery, categoryFilter]);

  const fetchStrategies = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'active':
          await fetchActiveStrategies();
          break;
        case 'private':
          await fetchPrivateStrategies();
          break;
        case 'public':
          await fetchPublicStrategies();
          break;
        case 'ai':
          await fetchAIStrategies();
          break;
        case 'invite':
          await fetchInviteStrategies();
          break;
      }
    } catch (error) {
      console.error('Error fetching strategies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveStrategies = async () => {
    const response = await fetch(`${API_URL}/strategies/user/${userId}/active`);
    const data = await response.json();
    if (data.success) {
      setActiveStrategies(data.data);
      // Fetch performance for each active strategy
      data.data.forEach((strategy: Strategy) => {
        fetchPerformance(strategy.id);
      });
    }
  };

  const fetchPrivateStrategies = async () => {
    const response = await fetch(`${API_URL}/strategies/user/${userId}?visibility=PRIVATE`);
    const data = await response.json();
    if (data.success) {
      setPrivateStrategies(data.data);
    }
  };

  const fetchPublicStrategies = async () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (categoryFilter) params.append('category', categoryFilter);
    
    const response = await fetch(`${API_URL}/strategies/public?${params}`);
    const data = await response.json();
    if (data.success) {
      setPublicStrategies(data.data);
    }
  };

  const fetchInviteStrategies = async () => {
    // Fetch strategies shared with this user
    const response = await fetch(`${API_URL}/strategies/user/${userId}?visibility=INVITE_ONLY`);
    const data = await response.json();
    if (data.success) {
      setInviteStrategies(data.data);
    }
  };

  const fetchAIStrategies = async () => {
    const response = await fetch(`${API_URL}/ai-strategies`);
    const data = await response.json();
    if (data.success) {
      setAiStrategies(data.data);
    }
  };

  const fetchPerformance = async (strategyId: string) => {
    try {
      const response = await fetch(`${API_URL}/strategies/${strategyId}/performance`);
      const data = await response.json();
      if (data.success) {
        setPerformanceData(prev => ({ ...prev, [strategyId]: data.data }));
      }
    } catch (error) {
      console.error('Error fetching performance:', error);
    }
  };

  const toggleStrategy = async (strategyId: string, isActive: boolean) => {
    try {
      const response = await fetch(`${API_URL}/strategies/${strategyId}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      const data = await response.json();
      if (data.success) {
        fetchStrategies();
      }
    } catch (error) {
      console.error('Error toggling strategy:', error);
    }
  };

  const deleteStrategy = async (strategyId: string) => {
    if (!confirm('Are you sure you want to delete this strategy?')) return;
    
    try {
      const response = await fetch(`${API_URL}/strategies/${strategyId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchStrategies();
      }
    } catch (error) {
      console.error('Error deleting strategy:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Strategies</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create, manage, and activate your trading strategies
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Active Strategies Tab */}
      {activeTab === 'active' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Active Strategies ({activeStrategies.length})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeStrategies.map((strategy) => {
                  const perf = performanceData[strategy.id];
                  return (
                    <div
                      key={strategy.id}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-green-500"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {strategy.name}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {strategy.category}
                          </span>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">
                          Active
                        </span>
                      </div>

                      {perf ? (
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Trades</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">
                              {perf.totalTrades}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Win Rate</div>
                            <div className="text-xl font-bold text-green-600">{perf.winRate}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">P&L</div>
                            <div className={`text-xl font-bold ${perf.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {perf.totalPnL >= 0 ? '+' : ''}₹{perf.totalPnL.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 text-center text-gray-500 dark:text-gray-400">
                          Loading performance...
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleStrategy(strategy.id, strategy.isActive)}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Deactivate
                        </button>
                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeStrategies.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No active strategies</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Strategy
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Create Strategy Tab */}
      {activeTab === 'create' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Create New Strategy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Manual Creation
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Build your strategy step by step with our condition builder
                </p>
              </div>
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
            >
              <div className="text-center">
                <svg
                  className="w-12 h-12 mx-auto mb-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  AI-Assisted Creation
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Describe your strategy in plain language and let AI build it
                </p>
              </div>
            </button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              Strategy Categories
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Scalping', 'Intraday', 'Swing Trading', 'Investment'].map((category) => (
                <div
                  key={category}
                  className="px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-center text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* My Strategies Tab */}
      {activeTab === 'private' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              My Private Strategies ({privateStrategies.length})
            </h2>
            <button
              onClick={() => setActiveTab('create')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Create New
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {privateStrategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {strategy.name}
                      </h3>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded text-xs">
                        🔒 Private
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {strategy.description || 'No description'}
                    </p>

                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                        {strategy.category}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStrategy(strategy.id, strategy.isActive)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          strategy.isActive
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {strategy.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
                        Edit
                      </button>
                      <button
                        onClick={() => deleteStrategy(strategy.id)}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {privateStrategies.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No private strategies yet</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Your First Strategy
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Marketplace Tab */}
      {activeTab === 'public' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Strategy Marketplace
            </h2>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search strategies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Scalping">Scalping</option>
                <option value="Intraday">Intraday</option>
                <option value="Swing Trading">Swing Trading</option>
                <option value="Investment">Investment</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicStrategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {strategy.name}
                      </h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs">
                        🌐 Public
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                      {strategy.description || 'No description available'}
                    </p>

                    <div className="mb-4 flex items-center gap-2">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                        {strategy.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        by User {strategy.userId.slice(0, 8)}...
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStrategy(strategy.id, false)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Activate
                      </button>
                      <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {publicStrategies.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
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
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    {searchQuery || categoryFilter ? 'No strategies found' : 'No public strategies available'}
                  </p>
                  {(searchQuery || categoryFilter) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCategoryFilter('');
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* AI Strategies Tab */}
      {activeTab === 'ai' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              AI-Generated Strategies
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Strategies automatically generated and validated by AIRA's Learning Engine
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiStrategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-2 border-purple-200 dark:border-purple-800"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {strategy.name}
                      </h3>
                      <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded text-xs font-bold">
                        🤖 AI
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                      {strategy.description}
                    </p>

                    <div className="mb-4 flex items-center gap-2">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                        {strategy.category}
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                        AI-Generated
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStrategy(strategy.id, false)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
                      >
                        Activate
                      </button>
                      <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {aiStrategies.length === 0 && (
                <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg shadow border-2 border-purple-200 dark:border-purple-800">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    No AI-generated strategies available yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    AIRA's Learning Engine generates new strategies twice weekly
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Invite Only Tab */}
      {activeTab === 'invite' && (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Invite-Only Strategies ({inviteStrategies.length})
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Strategies shared with you by invitation
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inviteStrategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {strategy.name}
                      </h3>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded text-xs">
                        👥 Invited
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                      {strategy.description || 'No description available'}
                    </p>

                    <div className="mb-4 flex items-center gap-2">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                        {strategy.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Shared by User {strategy.userId.slice(0, 8)}...
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStrategy(strategy.id, strategy.isActive)}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          strategy.isActive
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {strategy.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {inviteStrategies.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">
                    No invite-only strategies yet
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    When someone shares a strategy with you, it will appear here
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Create Strategy Modal Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Strategy Creation Wizard
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Multi-step strategy creation form will be implemented here
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
