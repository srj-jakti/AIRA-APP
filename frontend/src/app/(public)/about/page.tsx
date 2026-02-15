import { Metadata } from 'next'
import Link from 'next/link'
import { Target, Users, Zap, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About - AIRA AI Trading Platform',
  description: 'Learn about AIRA\'s mission to democratize algorithmic trading through AI-powered automation and intelligent strategy creation.',
  openGraph: {
    title: 'About - AIRA AI Trading Platform',
    description: 'Democratizing algorithmic trading with AI',
  },
}

export default function AboutPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About AIRA
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Democratizing algorithmic trading through AI-powered automation
          </p>
        </div>

        {/* Mission Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-12 text-white text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg opacity-90">
              To empower every trader with institutional-grade algorithmic trading capabilities through 
              accessible AI technology, making automated trading simple, intelligent, and profitable.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground mb-6">
              AIRA (AI-powered trading platform) was born from a simple observation: algorithmic trading 
              shouldn&apos;t be limited to hedge funds and institutional investors. Every trader deserves access 
              to powerful automation tools that can execute strategies 24/7, analyze markets in real-time, 
              and make data-driven decisions.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              We&apos;ve built AIRA to bridge the gap between complex algorithmic trading systems and everyday 
              traders. By leveraging cutting-edge AI technology, we&apos;ve made it possible to create sophisticated 
              trading strategies using natural language, backtest them against historical data, and deploy 
              them for automated execution—all without writing a single line of code.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ValueCard
              icon={<Target className="h-12 w-12 text-primary" />}
              title="Innovation"
              description="Continuously pushing the boundaries of what&apos;s possible with AI and trading technology"
            />
            <ValueCard
              icon={<Users className="h-12 w-12 text-primary" />}
              title="Accessibility"
              description="Making advanced trading tools available to everyone, regardless of technical expertise"
            />
            <ValueCard
              icon={<Zap className="h-12 w-12 text-primary" />}
              title="Performance"
              description="Delivering fast, reliable execution with minimal latency and maximum uptime"
            />
            <ValueCard
              icon={<Shield className="h-12 w-12 text-primary" />}
              title="Transparency"
              description="Clear communication about capabilities, limitations, and regulatory compliance"
            />
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Technology</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TechCard
                title="AI-Powered Strategy Creation"
                description="Our natural language processing engine converts your trading ideas into executable strategies, complete with entry/exit logic, stop-losses, and targets."
              />
              <TechCard
                title="Server-Side Execution"
                description="Trading engine runs on our servers, ensuring your strategies execute 24/7 during market hours, independent of your device or internet connection."
              />
              <TechCard
                title="Real-Time Market Analysis"
                description="Continuously scan 500+ instruments every 5 seconds, analyzing market conditions and identifying opportunities based on your active strategies."
              />
              <TechCard
                title="Advanced Backtesting"
                description="Test strategies against years of historical data with realistic simulation including slippage, commission, and market impact modeling."
              />
              <TechCard
                title="Learning Engine"
                description="AI system that learns from all platform activity, identifying patterns in profitable strategies and autonomously creating new strategies."
              />
              <TechCard
                title="Multi-Broker Architecture"
                description="Designed to support multiple brokers with seamless integration, starting with Zerodha and expanding to Upstox, Dhan, and more."
              />
            </div>
          </div>
        </div>

        {/* Compliance Section */}
        <div className="mb-20">
          <div className="max-w-4xl mx-auto bg-muted/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Regulatory Compliance</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">AIRA is a technology platform, not a SEBI registered advisor.</strong> We provide 
                software tools for automated trading execution and strategy creation. We do not provide investment advice, 
                recommendations, or tips.
              </p>
              <p>
                All trading strategies, whether created by users or AI-assisted, are executed at the user&apos;s own risk and 
                discretion. Users are solely responsible for their trading decisions and outcomes.
              </p>
              <p>
                We maintain strict data security standards with bank-grade encryption for all credentials and sensitive 
                information. Our platform complies with industry best practices for security and privacy.
              </p>
              <p>
                Trading in securities is subject to market risks. Past performance does not guarantee future results. 
                Users should carefully consider their financial situation and risk tolerance before engaging in automated trading.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Join the AIRA Community</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start your journey towards smarter, automated trading today
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

function ValueCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="text-center p-6 rounded-lg border bg-card">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function TechCard({ 
  title, 
  description 
}: { 
  title: string
  description: string
}) {
  return (
    <div className="p-6 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
