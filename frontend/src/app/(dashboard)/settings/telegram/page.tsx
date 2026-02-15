'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function TelegramSettingsPage() {
  const [connected, setConnected] = useState(false);
  const [connectionCode, setConnectionCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const userId = 'user-123'; // TODO: Get from auth context
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
  const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'AIRABot';

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/telegram/status/${userId}`);
      const data = await response.json();
      if (data.success) {
        setConnected(data.data.connected);
      }
    } catch (error) {
      console.error('Failed to check Telegram status:', error);
    }
  };

  const generateConnectionCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/telegram/generate-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.success) {
        setConnectionCode(data.data.code);

        // Generate QR code
        const botUrl = `https://t.me/${BOT_USERNAME}?start=${data.data.code}`;
        const qrUrl = await QRCode.toDataURL(botUrl);
        setQrCodeUrl(qrUrl);
      }
    } catch (error) {
      console.error('Failed to generate connection code:', error);
      alert('Failed to generate connection code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Telegram?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/telegram/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.success) {
        setConnected(false);
        setConnectionCode('');
        setQrCodeUrl('');
        alert('Telegram disconnected successfully');
      }
    } catch (error) {
      console.error('Failed to disconnect Telegram:', error);
      alert('Failed to disconnect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Telegram Integration
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your AIRA account to Telegram for notifications and bot commands
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Connection Status
          </h2>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                connected ? 'bg-green-500' : 'bg-gray-400'
              }`}
            ></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>

        {connected ? (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your AIRA account is connected to Telegram. You can now receive notifications
              and use bot commands.
            </p>
            <button
              onClick={disconnect}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Disconnecting...' : 'Disconnect'}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Connect your Telegram account to receive trade notifications and use the AIRA
              bot.
            </p>
            <button
              onClick={generateConnectionCode}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Connect Telegram'}
            </button>
          </div>
        )}
      </div>

      {/* Connection Instructions */}
      {connectionCode && !connected && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Connect Your Account
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR Code */}
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Scan QR Code
              </h3>
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto border-4 border-gray-200 dark:border-gray-700 rounded-lg"
                />
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Scan with your phone's camera
              </p>
            </div>

            {/* Manual Instructions */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Manual Connection
              </h3>
              <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-3">
                    1
                  </span>
                  <span>
                    Open Telegram and search for{' '}
                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      @{BOT_USERNAME}
                    </span>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-3">
                    2
                  </span>
                  <span>Start a chat with the bot</span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-3">
                    3
                  </span>
                  <span>
                    Send the command:{' '}
                    <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      /connect {connectionCode}
                    </span>
                  </span>
                </li>
              </ol>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Your Connection Code:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-lg font-mono text-center">
                    {connectionCode}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(connectionCode);
                      alert('Code copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                  Code expires in 10 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Telegram Bot Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              📊 Account Commands
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• /balance - View account balance</li>
              <li>• /positions - View open positions</li>
              <li>• /strategies - View active strategies</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🤖 Trading Commands
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• /ai on - Enable AI trading</li>
              <li>• /ai off - Disable AI trading</li>
              <li>• /market - Check market status</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🔔 Notifications
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Trade execution alerts</li>
              <li>• Daily P&L summary</li>
              <li>• Risk limit notifications</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🌐 Language Support
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• /language en - English</li>
              <li>• /language hi - Hindi</li>
              <li>• /help - Show all commands</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
