'use client';

import { useState } from 'react';
import {
  generateSnapshot,
  generateShareUrls,
  downloadSnapshot,
  shareSnapshot,
} from '@/lib/snapshotGenerator';

interface AIInsight {
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  summary: string;
  keyPoints: string[];
  recommendation: string;
}

export default function AnalysisPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight | null>(null);
  const [generatingSnapshot, setGeneratingSnapshot] = useState(false);
  const [snapshotBlob, setSnapshotBlob] = useState<Blob | null>(null);

  // Mock data
  const mockInsights: AIInsight = {
    type: 'bullish',
    confidence: 78,
    summary:
      'RELIANCE shows strong bullish momentum with increasing volume. Technical indicators suggest continuation of uptrend.',
    keyPoints: [
      'Price above all major moving averages (20, 50, 200 EMA)',
      'RSI at 62 - in bullish zone but not overbought',
      'Volume increasing on up days',
      'Support at ₹2,450, Resistance at ₹2,520',
      'MACD showing bullish crossover',
    ],
    recommendation:
      'Consider long positions with stop loss at ₹2,445. Target ₹2,520 for short term.',
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Mock search results
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAiInsights(mockInsights);
      setAnalyzing(false);
    }, 2000);
  };

  const handleShare = async (platform: string) => {
    if (!aiInsights || !selectedInstrument) return;

    try {
      // Generate snapshot if not already generated
      let blob = snapshotBlob;
      if (!blob) {
        setGeneratingSnapshot(true);
        blob = await generateSnapshot(
          {
            instrument: selectedInstrument,
            sentiment: aiInsights.type,
            confidence: aiInsights.confidence,
            summary: aiInsights.summary,
            keyPoints: aiInsights.keyPoints,
            recommendation: aiInsights.recommendation,
            timestamp: new Date(),
          },
          {
            includeChart: true,
            includeBranding: true,
            includeDisclaimer: true,
            theme: 'light',
          }
        );
        setSnapshotBlob(blob);
        setGeneratingSnapshot(false);
      }

      // Handle different platforms
      if (platform === 'Instagram' || platform === 'Download') {
        // Download for Instagram (Instagram doesn't support direct web sharing)
        downloadSnapshot(
          blob,
          `aira-analysis-${selectedInstrument}-${Date.now()}.png`
        );
        alert(
          platform === 'Instagram'
            ? 'Image downloaded! You can now upload it to Instagram.'
            : 'Snapshot downloaded successfully!'
        );
      } else if (platform === 'Mobile Share') {
        // Try Web Share API for mobile
        const shared = await shareSnapshot(blob, {
          instrument: selectedInstrument,
          sentiment: aiInsights.type,
          confidence: aiInsights.confidence,
          summary: aiInsights.summary,
          keyPoints: aiInsights.keyPoints,
          recommendation: aiInsights.recommendation,
          timestamp: new Date(),
        });

        if (!shared) {
          // Fallback to download
          downloadSnapshot(
            blob,
            `aira-analysis-${selectedInstrument}-${Date.now()}.png`
          );
          alert('Snapshot downloaded! You can share it from your device.');
        }
      } else {
        // For other platforms, open share URL
        // In production, you would upload the image to a CDN and use that URL
        const shareUrls = generateShareUrls(
          selectedInstrument,
          aiInsights.type,
          undefined // Image URL would go here in production
        );

        const url =
          platform === 'X (Twitter)'
            ? shareUrls.twitter
            : platform === 'Facebook'
            ? shareUrls.facebook
            : platform === 'WhatsApp'
            ? shareUrls.whatsapp
            : platform === 'Telegram'
            ? shareUrls.telegram
            : '';

        if (url) {
          window.open(url, '_blank', 'width=600,height=400');
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to generate or share snapshot. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Analysis</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get AI-powered insights and analysis for any instrument
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for stocks, indices, or commodities..."
            className="w-full px-4 py-3 pl-12 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Quick Select */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Popular:</span>
          {['RELIANCE', 'TCS', 'INFY', 'HDFC', 'NIFTY 50'].map((symbol) => (
            <button
              key={symbol}
              onClick={() => {
                setSearchQuery(symbol);
                setSelectedInstrument(symbol);
              }}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 overflow-hidden">
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedInstrument || 'Select an instrument'}
              </h2>
              {selectedInstrument && (
                <p className="text-sm text-gray-500 dark:text-gray-400">NSE</p>
              )}
            </div>
            {selectedInstrument && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <svg
                      className="inline-block w-5 h-5 mr-2"
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
                    Analyze with AI
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {selectedInstrument ? (
            <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
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
                  TradingView-style chart will be displayed here
                </p>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Search and select an instrument to view chart
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
          <div className="p-6 border-b dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Insights
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    aiInsights.type === 'bullish'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : aiInsights.type === 'bearish'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}
                >
                  {aiInsights.type.toUpperCase()}
                </span>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                    Confidence:
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {aiInsights.confidence}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Summary
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{aiInsights.summary}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Key Points
              </h3>
              <ul className="space-y-2">
                {aiInsights.keyPoints.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Recommendation
              </h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-blue-900 dark:text-blue-200">{aiInsights.recommendation}</p>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Disclaimer:</strong> This is AI-generated analysis for informational
                purposes only. Not financial advice. Always do your own research and consult with a
                financial advisor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Share Section */}
      {aiInsights && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Share Analysis
          </h2>
          
          {generatingSnapshot && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-sm text-blue-900 dark:text-blue-200">
                  Generating snapshot...
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Instagram', icon: '📷', color: 'bg-pink-600' },
              { name: 'X (Twitter)', icon: '𝕏', color: 'bg-black' },
              { name: 'Facebook', icon: '👍', color: 'bg-blue-600' },
              { name: 'WhatsApp', icon: '💬', color: 'bg-green-600' },
              { name: 'Telegram', icon: '✈️', color: 'bg-blue-500' },
              { name: 'Download', icon: '⬇️', color: 'bg-gray-600' },
            ].map((platform) => (
              <button
                key={platform.name}
                onClick={() => handleShare(platform.name)}
                disabled={generatingSnapshot}
                className={`flex items-center gap-2 px-4 py-2 ${platform.color} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>{platform.icon}</span>
                {platform.name}
              </button>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              📸 Snapshot includes chart, analysis, AIRA branding, and disclaimer
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              For Instagram: Download the image and upload it manually
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
