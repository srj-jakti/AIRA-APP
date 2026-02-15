import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ - AIRA AI Trading Platform',
  description: 'Frequently asked questions about AIRA AI trading platform, features, pricing, security, and getting started.',
  openGraph: {
    title: 'FAQ - AIRA AI Trading Platform',
    description: 'Get answers to common questions about AIRA',
  },
}

export default function FAQPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about AIRA
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Getting Started */}
          <FAQSection
            title="Getting Started"
            faqs={[
              {
                question: "What is AIRA?",
                answer: "AIRA is an AI-powered trading platform that enables automated trading execution, strategy creation with AI assistance, backtesting, and real-time market scanning. It's designed to make algorithmic trading accessible to everyone, regardless of technical expertise."
              },
              {
                question: "Do I need coding knowledge to use AIRA?",
                answer: "No! AIRA is designed for traders without programming experience. You can create strategies using natural language descriptions, and our AI converts them into executable trading logic. The entire platform is accessible through an intuitive web interface."
              },
              {
                question: "What broker do I need?",
                answer: "Currently, AIRA integrates with Zerodha for trade execution. You'll need an active Zerodha account and API credentials to execute live trades. However, you can use paper trading mode without any broker integration to test the platform."
              },
              {
                question: "Can I try AIRA before paying?",
                answer: "Yes! You can sign up and use paper trading mode to explore all features without risking real money. This allows you to create strategies, run backtests, and see how the platform works before committing to a paid subscription."
              },
            ]}
          />

          {/* Features & Functionality */}
          <FAQSection
            title="Features & Functionality"
            faqs={[
              {
                question: "How does AI trading work?",
                answer: "When you enable AI trading, our server-side trading engine continuously evaluates your active strategies against real-time market data. When entry conditions are met, it automatically executes trades through your broker API. The engine respects your configured risk limits and continues operating even when you're offline."
              },
              {
                question: "What is the difference between paper trading and live trading?",
                answer: "Paper trading simulates trades without using real money, allowing you to test strategies risk-free. Live trading executes real trades through your broker account with actual capital. We recommend starting with paper trading to familiarize yourself with the platform."
              },
              {
                question: "How does strategy creation work?",
                answer: "You can describe your trading idea in natural language (e.g., 'Buy when RSI is below 30 and price crosses above 20-day moving average'). Our AI converts this into structured strategy logic with entry/exit conditions, stop-losses, and targets. You can then backtest and refine the strategy before activating it."
              },
              {
                question: "What is backtesting?",
                answer: "Backtesting tests your strategy against historical market data to evaluate how it would have performed in the past. Our backtesting engine simulates realistic execution including slippage and commission, providing metrics like win rate, profit factor, and maximum drawdown."
              },
              {
                question: "How does the market scanner work?",
                answer: "The scanner continuously monitors 500+ instruments every 5 seconds, checking if any meet your active strategy conditions. When a match is found, you receive an alert with details about the opportunity. This helps you identify trading setups in real-time."
              },
            ]}
          />

          {/* Pricing & Plans */}
          <FAQSection
            title="Pricing & Plans"
            faqs={[
              {
                question: "What's included in the Basic plan?",
                answer: "The Basic plan (₹999/month) includes strategy creation with AI, unlimited backtesting, real-time scanner, paper trading, AI chart analysis, and email notifications. It requires manual daily login to your broker account."
              },
              {
                question: "What's the difference between Elite and Pro plans?",
                answer: "Elite (₹2,999/month) adds auto-login, live trading, AI automated trading, and multi-channel notifications. Pro (₹9,999/month) includes all Elite features plus advanced analytics, API access, dedicated support, and custom development options."
              },
              {
                question: "Can I change my plan later?",
                answer: "Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle. You'll only pay the prorated difference when upgrading."
              },
              {
                question: "What is your refund policy?",
                answer: "We offer a 7-day money-back guarantee. If you&apos;re not satisfied within the first 7 days of your subscription, contact us for a full refund, no questions asked."
              },
            ]}
          />

          {/* Security & Safety */}
          <FAQSection
            title="Security & Safety"
            faqs={[
              {
                question: "How secure is my data?",
                answer: "We use bank-grade encryption for all sensitive data including API credentials. All communications use HTTPS, and credentials are never exposed in client-side code or logs. We implement industry best practices for security including secure session management and CSRF protection."
              },
              {
                question: "How do risk limits work?",
                answer: "You can configure daily profit and loss limits in your risk settings. When either limit is reached, the AI trading engine automatically stops trading for the day. This helps protect your capital from excessive losses and lock in profits."
              },
              {
                question: "Can AIRA access my broker account balance?",
                answer: "AIRA can view your account balance, positions, and orders through the broker API to display them in the dashboard and ensure sufficient funds for trades. However, we cannot withdraw funds or transfer money from your account."
              },
              {
                question: "What happens if the platform goes down?",
                answer: "Our trading engine runs on reliable cloud infrastructure with automatic failover. In the rare event of downtime, any open positions remain in your broker account and can be managed directly through your broker's platform. We monitor system health 24/7 and alert administrators immediately of any issues."
              },
            ]}
          />

          {/* Trading & Strategies */}
          <FAQSection
            title="Trading & Strategies"
            faqs={[
              {
                question: "What types of strategies can I create?",
                answer: "AIRA supports four strategy types: Scalping (quick trades), Intraday (day trading), Swing Trading (multi-day positions), and Investment (long-term holdings). You can create strategies using various technical indicators, price patterns, and custom conditions."
              },
              {
                question: "Can I share my strategies?",
                answer: "Yes! You can mark strategies as Private (only you can see), Public (available in marketplace for all users), or Invite-only (selective access). Public strategies help the community while invite-only allows you to share with specific users."
              },
              {
                question: "Does AIRA work during market hours only?",
                answer: "The trading engine executes trades only during market hours (9:15 AM - 3:30 PM IST) and respects market holidays. However, you can create strategies, run backtests, and configure settings anytime."
              },
              {
                question: "How many strategies can I run simultaneously?",
                answer: "You can activate multiple strategies simultaneously. The AI trading engine evaluates all active strategies and executes trades when conditions are met, subject to your risk limits and available capital."
              },
            ]}
          />

          {/* Technical Support */}
          <FAQSection
            title="Technical Support"
            faqs={[
              {
                question: "What support channels are available?",
                answer: "Basic plan includes community support via email. Elite plan adds priority email support. Pro plan includes 24/7 phone support and a dedicated account manager. All plans have access to our comprehensive help center and video tutorials."
              },
              {
                question: "How do I connect my Zerodha account?",
                answer: "Go to Settings > API Configuration and enter your Zerodha API credentials (API Key, Secret, and optionally TOTP secret for auto-login). We provide step-by-step instructions for generating these credentials from your Zerodha account."
              },
              {
                question: "Can I use AIRA on mobile?",
                answer: "Yes! AIRA is a Progressive Web App (PWA) that works on all devices. You can install it on your mobile device for a native app-like experience with offline capabilities and push notifications."
              },
              {
                question: "What if I need help creating a strategy?",
                answer: "We provide video tutorials, sample strategies, and detailed documentation. Elite and Pro users get priority support for strategy creation assistance. You can also explore public strategies in the marketplace for inspiration."
              },
            ]}
          />
        </div>

        {/* Still Have Questions */}
        <div className="mt-20 text-center bg-muted/50 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Can&apos;t find what you&apos;re looking for? Get in touch with our team
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}

function FAQSection({ 
  title, 
  faqs 
}: { 
  title: string
  faqs: { question: string; answer: string }[]
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-lg p-6 bg-card">
            <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
            <p className="text-muted-foreground">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
