'use client';

import { useState, useEffect } from 'react';

export default function WhatsAppSettingsPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preferences, setPreferences] = useState({
    all: true,
    trades: true,
    dailySummary: true,
    limits: true,
    systemAlerts: false
  });

  // Mock user ID - replace with actual auth
  const userId = 'user-123';

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch(`/api/v1/whatsapp/status/${userId}`);
      const data = await response.json();
      
      if (data.connected) {
        setConnected(true);
        setPhoneNumber(data.phoneNumber || '');
      }
    } catch (error) {
      console.error('Error checking connection status:', error);
    }
  };

  const handleSendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate phone number
      if (!phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
        setError('Please enter a valid phone number with country code (e.g., +919876543210)');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/v1/whatsapp/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phoneNumber })
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setSuccess('OTP sent to your WhatsApp number');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/whatsapp/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phoneNumber, otp })
      });

      const data = await response.json();

      if (data.success) {
        setConnected(true);
        setOtpSent(false);
        setOtp('');
        setSuccess('WhatsApp connected successfully!');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect WhatsApp?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v1/whatsapp/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (data.success) {
        setConnected(false);
        setPhoneNumber('');
        setSuccess('WhatsApp disconnected successfully');
      } else {
        setError('Failed to disconnect WhatsApp');
      }
    } catch (error) {
      setError('Failed to disconnect WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/v1/whatsapp/test-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Test notification sent! Check your WhatsApp.');
      } else {
        setError('Failed to send test notification');
      }
    } catch (error) {
      setError('Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = async (key: string, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    
    // If "all" is toggled, update all preferences
    if (key === 'all') {
      newPrefs.trades = value;
      newPrefs.dailySummary = value;
      newPrefs.limits = value;
      newPrefs.systemAlerts = value;
    }
    
    setPreferences(newPrefs);

    try {
      await fetch('/api/v1/whatsapp/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, preferences: newPrefs })
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          WhatsApp Integration
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your WhatsApp to receive trade notifications and daily summaries
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-800 dark:text-green-200">{success}</p>
        </div>
      )}

      {/* Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Connection Status
          </h2>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>

        {!connected ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number (with country code)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+919876543210"
                disabled={otpSent || loading}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Enter your phone number with country code (e.g., +91 for India)
              </p>
            </div>

            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Check your WhatsApp for the verification code
                </p>
              </div>
            )}

            <div className="flex gap-3">
              {!otpSent ? (
                <button
                  onClick={handleSendOTP}
                  disabled={loading || !phoneNumber}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || !otp || otp.length !== 6}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <button
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                    }}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Connected to WhatsApp
                </p>
                <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                  {phoneNumber}
                </p>
              </div>
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleTestNotification}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                {loading ? 'Sending...' : 'Send Test Message'}
              </button>
              <button
                onClick={handleDisconnect}
                disabled={loading}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      {connected && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Notification Preferences
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">All Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Enable/disable all WhatsApp notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.all}
                  onChange={(e) => handlePreferenceChange('all', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Trade Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notified for every trade executed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.trades}
                  onChange={(e) => handlePreferenceChange('trades', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Daily Summary</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive daily P&L summary at market close</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.dailySummary}
                  onChange={(e) => handlePreferenceChange('dailySummary', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Limit Alerts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when profit/loss limits are reached</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.limits}
                  onChange={(e) => handlePreferenceChange('limits', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">System Alerts</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Important system notifications and updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.systemAlerts}
                  onChange={(e) => handlePreferenceChange('systemAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ AIRA is a software tool, not a SEBI registered advisor. All notifications are automated and do not constitute investment advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
