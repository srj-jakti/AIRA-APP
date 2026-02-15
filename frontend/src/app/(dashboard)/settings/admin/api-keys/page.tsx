'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/rbac';
import { useRouter } from 'next/navigation';

interface AdminAPI {
  id: string;
  apiKey: string;
  userId: string;
  isActive: boolean;
  requestCount: number;
}

export default function AdminAPIKeysPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [adminAPIs, setAdminAPIs] = useState<AdminAPI[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    apiKey: '',
    apiSecret: '',
    totpSecret: '',
    userId: '',
    password: '',
  });

  useEffect(() => {
    if (!loading && !isAdmin(user)) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (isAdmin(user)) {
      fetchAdminAPIs();
    }
  }, [user]);

  const fetchAdminAPIs = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin-apis`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setAdminAPIs(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch Admin APIs:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddAPI = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin-apis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setShowAddForm(false);
        setFormData({ apiKey: '', apiSecret: '', totpSecret: '', userId: '', password: '' });
        fetchAdminAPIs();
      } else {
        alert(data.error || 'Failed to add API key');
      }
    } catch (error) {
      console.error('Failed to add Admin API:', error);
      alert('Failed to add API key');
    }
  };

  const handleDeleteAPI = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key?')) return;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin-apis/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        fetchAdminAPIs();
      } else {
        alert(data.error || 'Failed to delete API key');
      }
    } catch (error) {
      console.error('Failed to delete Admin API:', error);
      alert('Failed to delete API key');
    }
  };

  const handleTestConnection = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin-apis/${id}/test`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      alert(data.connected ? 'Connection successful!' : 'Connection failed!');
    } catch (error) {
      console.error('Failed to test connection:', error);
      alert('Connection test failed!');
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAdmin(user)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/settings/admin')}
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            ← Back to Admin Panel
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Data API Keys</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage Zerodha API keys for market data distribution across all users
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Configured API Keys ({adminAPIs.length}/10)
            </h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              disabled={adminAPIs.length >= 10}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {showAddForm ? 'Cancel' : 'Add API Key'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddAPI} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    API Key
                  </label>
                  <input
                    type="text"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    API Secret
                  </label>
                  <input
                    type="password"
                    value={formData.apiSecret}
                    onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    TOTP Secret
                  </label>
                  <input
                    type="password"
                    value={formData.totpSecret}
                    onChange={(e) => setFormData({ ...formData, totpSecret: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    User ID
                  </label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add API Key
              </button>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">API Key</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">User ID</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Requests</th>
                  <th className="text-left py-3 px-4 text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminAPIs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No Admin Data API keys configured. Add your first API key to get started.
                    </td>
                  </tr>
                ) : (
                  adminAPIs.map((api) => (
                    <tr key={api.id} className="border-b dark:border-gray-700">
                      <td className="py-3 px-4 font-mono text-sm text-gray-900 dark:text-white">
                        {api.apiKey}
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">{api.userId}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            api.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {api.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {api.requestCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTestConnection(api.id)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                          >
                            Test
                          </button>
                          <button
                            onClick={() => handleDeleteAPI(api.id)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {adminAPIs.length >= 10 && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Maximum limit of 10 Admin Data API keys reached. Delete an existing key to add a new one.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            About Admin Data API Keys
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• Admin Data API keys are used to fetch real-time and historical market data for all users</li>
            <li>• Requests are automatically load-balanced across all active API keys</li>
            <li>• You can configure up to 10 API keys for better distribution and redundancy</li>
            <li>• All credentials are encrypted using AES-256 and stored securely in the database</li>
            <li>• API secrets are never exposed to the frontend or regular users</li>
            <li>• Test connection to verify API key is working correctly before use</li>
            <li>• Request counts help monitor usage and ensure even distribution</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
