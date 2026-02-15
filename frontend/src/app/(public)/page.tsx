import Link from 'next/link'
import { Metadata } from 'next'
import { Bot, TrendingUp, LineChart, Zap, Shield, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'AIRA - AI Trading Platform | Automated Trading India',
  description: 'AI-powered trading platform with automated execution, strategy creation, backtesting, and real-time market scanning. Start algorithmic trading in India with AIRA.',
  keywords: 'AI trading platform, automated trading India, algo trading software, algorithmic trading, trading bot India',
  openGraph: {
    title: 'AIRA - AI Trading Platform',
    description: 'AI-powered trading platform with automated execution and strategy creation',
    type: 'website',
    url: 'https://aira.trading',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIRA - AI Trading Platform',
    description: 'AI-powered trading platform with automated execution and strategy creation',
  },
}

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Trading Platform
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Automate your trading with AI-driven strategies, real-time market scanning, and intelligent execution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                href="/signup"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Start Trading Now
              </Link>
              <Link
                href="/features"
                className="px-8 py-4 bg-background border-2 border-primary text-primary rounded-lg text-lg font-semibold hover:bg-accent transition-colors"
              >
                Explore Features
              </Link>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              AIRA is a software platform providing autonomous trading tools. We do not provide trading advice, 
              recommendations, or tips. Users are solely responsible for their trading decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Traders</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to automate and optimize your trading strategies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bot className="h-10 w-10 text-primary" />}
              title="AI Trading"
              description="Let AI execute trades automatically based on your active strategies and risk settings, even when you're offline"
            />
            <FeatureCard
              icon={<TrendingUp className="h-10 w-10 text-primary" />}
              title="Strategy Creation"
              description="Create trading strategies using natural language. AI converts your ideas into executable trading logic"
            />
            <FeatureCard
              icon={<LineChart className="h-10 w-10 text-primary" />}
              title="Backtesting"
              description="Test your strategies against historical data with realistic slippage and commission modeling"
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Real-Time Scanner"
              description="Continuously scan 500+ instruments for opportunities matching your strategy conditions"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Risk Management"
              description="Set daily profit/loss limits and let the system protect your capital automatically"
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="24/7 Execution"
              description="Server-side trading engine runs continuously during market hours, independent of your browser"
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-lg text-muted-foreground">
              Start with Basic and upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Basic"
              price="₹999"
              period="month"
              features={[
                'Manual daily login',
                'Strategy creation with AI',
                'Backtesting',
                'Real-time scanner',
                'Paper trading',
              ]}
            />
            <PricingCard
              name="Elite"
              price="₹2,999"
              period="month"
              features={[
                'Auto-login with TOTP',
                'All Basic features',
                'Live trading',
                'AI automated trading',
                'Priority support',
              ]}
              highlighted
            />
            <PricingCard
              name="Pro"
              price="₹9,999"
              period="month"
              features={[
                'All Elite features',
                'Advanced analytics',
                'Custom strategies',
                'API access',
                'Dedicated support',
              ]}
            />
          </div>

          <div className="text-center mt-12">
            <Link
              href="/pricing"
              className="text-primary hover:underline font-medium"
            >
              View detailed pricing comparison →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Trading?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join traders who are already using AI to automate their strategies
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-background text-foreground rounded-lg text-lg font-semibold hover:bg-background/90 transition-colors"
          >
            Get Started Free
          </Link>
          <p className="mt-4 text-sm opacity-75">
            No credit card required • Start with paper trading
          </p>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

function PricingCard({ 
  name, 
  price, 
  period, 
  features, 
  highlighted = false 
}: { 
  name: string
  price: string
  period: string
  features: string[]
  highlighted?: boolean
}) {
  return (
    <div className={`p-8 rounded-lg border ${highlighted ? 'border-primary shadow-lg scale-105' : 'bg-card'}`}>
      {highlighted && (
        <div className="text-center mb-4">
          <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-2">/{period}</span>
        </div>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`block w-full py-3 text-center rounded-lg font-semibold transition-colors ${
          highlighted
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        Get Started
      </Link>
    </div>
  )
}
