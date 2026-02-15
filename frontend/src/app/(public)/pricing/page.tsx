import { Metadata } from 'next'
import Link from 'next/link'
import { Check, X } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pricing - AIRA AI Trading Platform',
  description: 'Choose the perfect plan for your trading needs. Basic ₹999/month, Elite ₹2,999/month, Pro ₹9,999/month. Start with paper trading free.',
  openGraph: {
    title: 'Pricing - AIRA AI Trading Platform',
    description: 'Flexible pricing plans for every trader',
  },
}

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your trading style. All plans include core features with increasing levels of automation and support.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <PricingCard
            name="Basic"
            price="₹999"
            period="month"
            description="Perfect for getting started with AI trading"
            features={[
              { name: 'Manual daily login', included: true },
              { name: 'Strategy creation with AI', included: true },
              { name: 'Unlimited backtesting', included: true },
              { name: 'Real-time market scanner', included: true },
              { name: 'Paper trading mode', included: true },
              { name: 'AI chart analysis', included: true },
              { name: 'Email notifications', included: true },
              { name: 'Community support', included: true },
              { name: 'Auto-login with TOTP', included: false },
              { name: 'Live trading', included: false },
              { name: 'AI automated trading', included: false },
              { name: 'Priority support', included: false },
            ]}
          />
          
          <PricingCard
            name="Elite"
            price="₹2,999"
            period="month"
            description="For serious traders who want automation"
            features={[
              { name: 'Auto-login with TOTP', included: true },
              { name: 'All Basic features', included: true },
              { name: 'Live trading execution', included: true },
              { name: 'AI automated trading', included: true },
              { name: 'Server-side execution', included: true },
              { name: 'Risk management tools', included: true },
              { name: 'Multi-channel notifications', included: true },
              { name: 'Telegram integration', included: true },
              { name: 'WhatsApp notifications', included: true },
              { name: 'Priority email support', included: true },
              { name: 'Advanced analytics', included: false },
              { name: 'API access', included: false },
            ]}
            highlighted
          />
          
          <PricingCard
            name="Pro"
            price="₹9,999"
            period="month"
            description="Maximum power for professional traders"
            features={[
              { name: 'All Elite features', included: true },
              { name: 'Advanced analytics dashboard', included: true },
              { name: 'Custom strategy development', included: true },
              { name: 'API access for integration', included: true },
              { name: 'Dedicated account manager', included: true },
              { name: 'Priority feature requests', included: true },
              { name: '24/7 phone support', included: true },
              { name: 'Custom integrations', included: true },
              { name: 'White-label options', included: true },
              { name: 'Training sessions', included: true },
              { name: 'Early access to features', included: true },
              { name: 'Custom reporting', included: true },
            ]}
          />
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Detailed Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">Basic</th>
                  <th className="text-center p-4 font-semibold">Elite</th>
                  <th className="text-center p-4 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody>
                <ComparisonRow feature="Strategy Creation" basic="✓" elite="✓" pro="✓" />
                <ComparisonRow feature="Backtesting" basic="✓" elite="✓" pro="✓" />
                <ComparisonRow feature="Market Scanner" basic="✓" elite="✓" pro="✓" />
                <ComparisonRow feature="Paper Trading" basic="✓" elite="✓" pro="✓" />
                <ComparisonRow feature="AI Chart Analysis" basic="✓" elite="✓" pro="✓" />
                <ComparisonRow feature="Auto-Login (TOTP)" basic="✗" elite="✓" pro="✓" />
                <ComparisonRow feature="Live Trading" basic="✗" elite="✓" pro="✓" />
                <ComparisonRow feature="AI Automated Trading" basic="✗" elite="✓" pro="✓" />
                <ComparisonRow feature="Server-Side Execution" basic="✗" elite="✓" pro="✓" />
                <ComparisonRow feature="Telegram Integration" basic="✗" elite="✓" pro="✓" />
                <ComparisonRow feature="WhatsApp Notifications" basic="✗" elite="✓" pro="✓" />
                <ComparisonRow feature="Advanced Analytics" basic="✗" elite="✗" pro="✓" />
                <ComparisonRow feature="API Access" basic="✗" elite="✗" pro="✓" />
                <ComparisonRow feature="Dedicated Support" basic="✗" elite="✗" pro="✓" />
                <ComparisonRow feature="Custom Development" basic="✗" elite="✗" pro="✓" />
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <FAQItem
              question="Can I try AIRA before subscribing?"
              answer="Yes! You can sign up and use paper trading mode to test all features without risking real money. This allows you to explore the platform and create strategies before committing to a paid plan."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major payment methods through Razorpay, including credit cards, debit cards, UPI, net banking, and digital wallets."
            />
            <FAQItem
              question="Can I upgrade or downgrade my plan?"
              answer="Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the end of your current billing cycle."
            />
            <FAQItem
              question="What is your refund policy?"
              answer="We offer a 7-day money-back guarantee. If you&apos;re not satisfied with AIRA within the first 7 days of your subscription, contact us for a full refund."
            />
            <FAQItem
              question="Do I need a Zerodha account?"
              answer="Yes, AIRA currently integrates with Zerodha for trade execution. You'll need an active Zerodha account and API credentials to execute live trades. Paper trading doesn't require broker integration."
            />
            <FAQItem
              question="Is there a setup fee?"
              answer="No, there are no setup fees or hidden charges. You only pay the monthly subscription fee for your chosen plan."
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted/50 rounded-lg p-8 mb-12">
          <h3 className="font-semibold mb-4 text-center">Important Disclaimer</h3>
          <p className="text-sm text-muted-foreground text-center max-w-3xl mx-auto">
            AIRA is a technology platform providing software tools for automated trading. We are not a SEBI registered advisor 
            and do not provide investment advice, recommendations, or tips. All trading strategies, whether created by users 
            or AI-assisted, are executed at the user&apos;s own risk and discretion. Trading in securities is subject to market risks. 
            Past performance does not guarantee future results.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading Smarter?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Choose your plan and start automating your trading strategies today
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

function PricingCard({ 
  name, 
  price, 
  period, 
  description,
  features,
  highlighted = false 
}: { 
  name: string
  price: string
  period: string
  description: string
  features: { name: string; included: boolean }[]
  highlighted?: boolean
}) {
  return (
    <div className={`p-8 rounded-lg border ${highlighted ? 'border-primary shadow-xl scale-105 bg-card' : 'bg-card'}`}>
      {highlighted && (
        <div className="text-center mb-4">
          <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div className="flex items-baseline justify-center mb-2">
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground ml-2">/{period}</span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {feature.included ? (
              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <X className="h-5 w-5 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
            )}
            <span className={`text-sm ${!feature.included && 'text-muted-foreground'}`}>
              {feature.name}
            </span>
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

function ComparisonRow({ 
  feature, 
  basic, 
  elite, 
  pro 
}: { 
  feature: string
  basic: string
  elite: string
  pro: string
}) {
  return (
    <tr className="border-b hover:bg-muted/50">
      <td className="p-4">{feature}</td>
      <td className="p-4 text-center">{basic === '✓' ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />}</td>
      <td className="p-4 text-center">{elite === '✓' ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />}</td>
      <td className="p-4 text-center">{pro === '✓' ? <Check className="h-5 w-5 text-primary mx-auto" /> : <X className="h-5 w-5 text-muted-foreground mx-auto" />}</td>
    </tr>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border rounded-lg p-6 bg-card">
      <h3 className="font-semibold mb-2">{question}</h3>
      <p className="text-sm text-muted-foreground">{answer}</p>
    </div>
  )
}
