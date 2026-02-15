'use client';

import { useState, useEffect } from 'react';

interface ChannelPreferences {
  trades: boolean;
  dailySummary: boolean;
  limits: boolean;
  systemAlerts: boolean;
  marketing: boolean;
}

interface NotificationPreferences {
  email: ChannelPreferences;
  push: ChannelPreferences;
  telegram: ChannelPreferences;
  whatsapp: ChannelPreferences;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      trades: true,
      dailySummary: true,
      limits: true,
      systemAlerts: true,
      marketing: false,
    },
    push: {
      trades: true,
      dailySummary: false,
      limits: true,
      systemAlerts: true,
      marketing: false,
    },
    telegram: {
      trades: false,
      dailySummary: false,
      limits: false,
      systemAlerts: false,
      marketing: false,
    },
    whatsapp: {
      trades: false,
      dailySummary: false,
      limits: false,
      systemAlerts: false,
      marketing: false,
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
    },
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const notificationTypes = [
    { key: 'trades', label: 'Trade Executions', description: 'Get notified when trades are executed' },
    { key: 'dailySummary', label: 'Daily Summary', description: 'Daily P&L and performance summary' },
    { key: 'limits', label: 'Limit Alerts', description: 'Alerts when risk limits are reached' },
    { key: 'systemAlerts', label: 'System Alerts', description: 'Important system notifications' },
    { key: 'marketing', label: 'Marketing', description: 'Product updates and promotions' },
  ];

  const channels = [
    { key: 'email', label: 'Email', icon: '📧' },
    { key: 'push', label: 'Push', icon: '🔔' },
    { key: 'telegram', label: 'Telegram', icon: '✈️' },
    { key: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  ];

  const handleToggle = (channel: string, type: string) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: {
        ...prev[channel as keyof typeof prev],
        [type]: !prev[channel as keyof typeof prev][type as keyof ChannelPreferences],
      },
    }));
    setSaved(false);
  };

  const handleQuietHoursToggle = () => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled,
      },
    }));
    setSaved(false);
  };

  const handleQuietHoursChange = (field: 'start' | 'end', value: string) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value,
      },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In production, save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      // Send test notification
      alert('Test notification sent! Check your enabled channels.');
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Preferences</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage how you receive notifications across different channels
          </p>
        </div>
        <button
          onClick={handleTestNotification}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Send Test Notification
        </button>
      </div>

      {/* Notification Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Notification Type
                </th>
                {channels.map(channel => (
                  <th key={channel.key} className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-1">{channel.icon}</span>
                      <span>{channel.label}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {notificationTypes.map(type => (
                <tr key={type.key}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {type.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {type.description}
                      </div>
                    </div>
                  </td>
                  {channels.map(channel => (
                    <td key={`${channel.key}-${type.key}`} className="px-6 py-4 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[channel.key as keyof typeof preferences][type.key as keyof ChannelPreferences]}
                          onChange={() => handleToggle(channel.key, type.key)}
                          className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </label>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quiet Hours</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pause notifications during specific hours
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.quietHours.enabled}
              onChange={handleQuietHoursToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {preferences.quietHours.enabled && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Time
              </label>
              <input
                type="time"
                value={preferences.quietHours.start}
                onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Time
              </label>
              <input
                type="time"
                value={preferences.quietHours.end}
                onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-4">
        {saved && (
          <span className="text-green-600 dark:text-green-400 text-sm">
            ✓ Preferences saved successfully
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      {/* SEBI Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Disclaimer:</strong> Notifications are for informational purposes only. AIRA is a tool provider and does not provide investment advice. All trading decisions are your own responsibility.
        </p>
      </div>
    </div>
  );
}
