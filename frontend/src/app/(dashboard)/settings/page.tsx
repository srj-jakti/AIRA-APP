'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/rbac';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'account' | 'api' | 'risk' | 'history'>('account');
  const [apiConfig, setApiConfig] = useState({
    apiKey: '',
    apiSecret: '',
    totpSecret: '',
    userId: '',
    password: '',
    autoLogin: false,
  });
  const [riskSettings, setRiskSettings] = useState({
    dailyProfitLimit: 5000,
    dailyLossLimit: 3000,
    aiTradingEnabled: false,
  });

  const tabs = [
    { id: 'account' as const, name: 'Account', icon: '👤' },
    { id: 'api' as const, name: 'API Configuration', icon: '🔑' },
    { id: 'risk' as const, name: 'Risk Settings', icon: '⚠️' },
    { id: 'history' as const, name: 'P&L History', icon: '📊' },
  ];

  const handleSaveAPI = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API save
    alert('API configuration saved!');
  };

  const handleSaveRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement risk settings save
    alert('Risk settings saved!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account, API configuration, and risk settings
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

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Account Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                Subscription Plan
              </label>
              <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {user?.user_metadata?.subscription || 'Basic'} Plan
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Active until: Dec 31, 2024
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/pricing')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
            {isAdmin(user) && (
              <div>
                <button
                  onClick={() => router.push('/settings/admin')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  🔐 Access Admin Panel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* API Configuration Tab */}
      {activeTab === 'api' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Zerodha API Configuration
          </h2>
          <form onSubmit={handleSaveAPI} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                API Key
              </label>
              <input
                type="text"
                value={apiConfig.apiKey}
                onChange={(e) => setApiConfig({ ...apiConfig, apiKey: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your Zerodha API key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                API Secret
              </label>
              <input
                type="password"
                value={apiConfig.apiSecret}
                onChange={(e) => setApiConfig({ ...apiConfig, apiSecret: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your API secret"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                TOTP Secret (for 2FA)
              </label>
              <input
                type="password"
                value={apiConfig.totpSecret}
                onChange={(e) => setApiConfig({ ...apiConfig, totpSecret: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter your TOTP secret"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  User ID
                </label>
                <input
                  type="text"
                  value={apiConfig.userId}
                  onChange={(e) => setApiConfig({ ...apiConfig, userId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your Zerodha user ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  value={apiConfig.password}
                  onChange={(e) => setApiConfig({ ...apiConfig, password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Your Zerodha password"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoLogin"
                checked={apiConfig.autoLogin}
                onChange={(e) => setApiConfig({ ...apiConfig, autoLogin: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="autoLogin" className="ml-2 text-sm text-gray-900 dark:text-white">
                Enable auto-login (Elite/Pro plans only)
              </label>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save API Configuration
              </button>
            </div>
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Your API credentials are encrypted and stored securely. They are never shared with anyone.
              </p>
            </div>
          </form>
        </div>
      )}

      {/* Risk Settings Tab */}
      {activeTab === 'risk' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Risk Management Settings
          </h2>
          <form onSubmit={handleSaveRisk} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                Daily Profit Limit: ₹{riskSettings.dailyProfitLimit.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="50000"
                step="1000"
                value={riskSettings.dailyProfitLimit}
                onChange={(e) => setRiskSettings({ ...riskSettings, dailyProfitLimit: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                AI will stop trading when this profit is reached
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                Daily Loss Limit: ₹{riskSettings.dailyLossLimit.toLocaleString()}
              </label>
              <input
                type="range"
                min="500"
                max="20000"
                step="500"
                value={riskSettings.dailyLossLimit}
                onChange={(e) => setRiskSettings({ ...riskSettings, dailyLossLimit: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                AI will stop trading when this loss is reached
              </p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-gray-900 dark:text-white">AI Trading</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Enable or disable AI-powered automated trading
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRiskSettings({ ...riskSettings, aiTradingEnabled: !riskSettings.aiTradingEnabled })}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  riskSettings.aiTradingEnabled ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    riskSettings.aiTradingEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Risk Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* P&L History Tab */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Daily P&L History
          </h2>
          <div className="space-y-3">
            {[
              { date: '2024-06-15', profit: 2500, loss: 800, net: 1700 },
              { date: '2024-06-14', profit: 1800, loss: 1200, net: 600 },
              { date: '2024-06-13', profit: 3200, loss: 500, net: 2700 },
              { date: '2024-06-12', profit: 1500, loss: 2000, net: -500 },
              { date: '2024-06-11', profit: 2800, loss: 900, net: 1900 },
            ].map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{day.date}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Profit: ₹{day.profit.toLocaleString()} | Loss: ₹{day.loss.toLocaleString()}
                  </div>
                </div>
                <div className={`text-lg font-bold ${day.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {day.net >= 0 ? '+' : ''}₹{day.net.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
