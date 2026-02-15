import { Metadata } from 'next'
import Link from 'next/link'
import { Bot, TrendingUp, LineChart, Zap, Shield, Clock, Brain, Target, Bell, Smartphone, Globe, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Features - AIRA AI Trading Platform',
  description: 'Explore AIRA\'s powerful features: AI trading, strategy creation, backtesting, real-time scanning, risk management, and more.',
  openGraph: {
    title: 'Features - AIRA AI Trading Platform',
    description: 'Explore AIRA\'s powerful features for automated trading',
  },
}

export default function FeaturesPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Trade Smarter
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AIRA combines cutting-edge AI technology with powerful trading tools to help you automate and optimize your trading strategies
          </p>
        </div>

        {/* Core Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Core Trading Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DetailedFeatureCard
              icon={<Bot className="h-12 w-12 text-primary" />}
              title="AI-Powered Trading"
              description="Enable AI trading to execute trades automatically based on your active strategies. The AI respects your risk limits and continues trading even when you're offline."
              benefits={[
                'Server-side execution',
                'Automatic risk management',
                'Works 24/7 during market hours',
                'Respects daily profit/loss limits'
              ]}
            />
            <DetailedFeatureCard
              icon={<Brain className="h-12 w-12 text-primary" />}
              title="AI Strategy Creation"
              description="Describe your trading idea in natural language and let AI convert it into executable strategy logic with entry, exit, stop-loss, and target conditions."
              benefits={[
                'Natural language input',
                'Automatic logic generation',
                'AI-powered improvements',
                'Multiple strategy types'
              ]}
            />
            <DetailedFeatureCard
              icon={<LineChart className="h-12 w-12 text-primary" />}
              title="Advanced Backtesting"
              description="Test your strategies against historical data with realistic simulation including slippage and commission to evaluate performance before risking real money."
              benefits={[
                'Historical data analysis',
                'Realistic execution modeling',
                'Comprehensive metrics',
                'Performance visualization'
              ]}
            />
            <DetailedFeatureCard
              icon={<Zap className="h-12 w-12 text-primary" />}
              title="Real-Time Market Scanner"
              description="Continuously scan 500+ instruments every 5 seconds to identify opportunities matching your active strategy conditions in real-time."
              benefits={[
                'Scans 500+ instruments',
                '5-second refresh rate',
                'Strategy-based alerts',
                'Real-time notifications'
              ]}
            />
            <DetailedFeatureCard
              icon={<Target className="h-12 w-12 text-primary" />}
              title="AI Chart Analysis"
              description="Get AI-powered insights on any instrument with chart analysis, trend identification, and trading recommendations based on your active strategies."
              benefits={[
                'Instant chart analysis',
                'AI-generated insights',
                'Shareable snapshots',
                'Social media integration'
              ]}
            />
            <DetailedFeatureCard
              icon={<Shield className="h-12 w-12 text-primary" />}
              title="Risk Management"
              description="Configure daily profit and loss limits to protect your capital. The system automatically stops trading when limits are reached."
              benefits={[
                'Daily profit limits',
                'Daily loss limits',
                'Automatic enforcement',
                'Balance protection'
              ]}
            />
          </div>
        </div>

        {/* Strategy Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Strategy Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FeatureSection
              title="Multiple Strategy Types"
              description="Create strategies for different trading styles:"
              items={[
                'Scalping - Quick trades for small profits',
                'Intraday - Day trading strategies',
                'Swing Trading - Multi-day positions',
                'Investment - Long-term holdings'
              ]}
            />
            <FeatureSection
              title="Strategy Visibility Options"
              description="Control who can see and use your strategies:"
              items={[
                'Private - Only visible to you',
                'Public - Available in marketplace',
                'Invite-only - Selective access',
                'AI-Generated - Created by learning engine'
              ]}
            />
            <FeatureSection
              title="Advanced Strategy Logic"
              description="Build sophisticated strategies with:"
              items={[
                'Multiple entry/exit conditions',
                'Stop-loss and target configuration',
                'Trailing stop-loss and targets',
                'Multiple indicator support'
              ]}
            />
            <FeatureSection
              title="Strategy Marketplace"
              description="Access and share strategies:"
              items={[
                'Browse public strategies',
                'View backtest results',
                'Activate proven strategies',
                'Share your successful strategies'
              ]}
            />
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Platform Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SimpleFeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Server-Side Execution"
              description="Trading engine runs on our servers, continuing to execute trades even when you close your browser or app."
            />
            <SimpleFeatureCard
              icon={<Smartphone className="h-10 w-10 text-primary" />}
              title="Progressive Web App"
              description="Install AIRA on your mobile device for a native app experience with offline capabilities."
            />
            <SimpleFeatureCard
              icon={<Bell className="h-10 w-10 text-primary" />}
              title="Multi-Channel Notifications"
              description="Receive trade notifications via email, push notifications, Telegram, and WhatsApp."
            />
            <SimpleFeatureCard
              icon={<Globe className="h-10 w-10 text-primary" />}
              title="Multi-Language Support"
              description="Use AIRA in English or Hindi with full interface translation and localized formatting."
            />
            <SimpleFeatureCard
              icon={<BarChart3 className="h-10 w-10 text-primary" />}
              title="Performance Analytics"
              description="Track your trading performance with detailed metrics, charts, and strategy-wise breakdowns."
            />
            <SimpleFeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Secure & Compliant"
              description="Bank-grade encryption for credentials, SEBI-compliant disclaimers, and secure session management."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-muted/50 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start with paper trading and explore all features risk-free
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  )
}

function DetailedFeatureCard({ 
  icon, 
  title, 
  description, 
  benefits 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  benefits: string[]
}) {
  return (
    <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start text-sm">
            <svg className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SimpleFeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-lg border bg-card text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function FeatureSection({ 
  title, 
  description, 
  items 
}: { 
  title: string
  description: string
  items: string[]
}) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <svg className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
