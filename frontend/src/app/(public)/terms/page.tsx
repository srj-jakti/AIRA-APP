'use client'

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated: February 14, 2026</p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using AIRA ("the Platform"), you agree to be bound by these Terms of Service.
            If you do not agree to these terms, do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Description of Service</h2>
          <p>
            AIRA is an AI-powered trading platform that provides:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Automated trading strategy creation and execution</li>
            <li>AI-powered market analysis and insights</li>
            <li>Backtesting and performance tracking</li>
            <li>Market scanning and alert generation</li>
            <li>Integration with Zerodha trading API</li>
          </ul>
          <p className="mt-4">
            <strong>IMPORTANT:</strong> AIRA is a technology platform only. We are NOT a SEBI registered investment advisor,
            broker, or financial planner. We do not provide investment advice, recommendations, or tips.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Eligibility</h2>
          <p>You must:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Be at least 18 years of age</li>
            <li>Have a valid Zerodha trading account</li>
            <li>Be legally permitted to trade securities in India</li>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. User Responsibilities</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4.1 Trading Decisions</h3>
          <p>
            You are solely responsible for all trading decisions made through the Platform, whether executed manually
            or automatically by AI strategies. You acknowledge that:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Trading involves substantial risk of loss</li>
            <li>Past performance does not guarantee future results</li>
            <li>AI-generated strategies may not be profitable</li>
            <li>You may lose some or all of your invested capital</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4.2 Account Security</h3>
          <p>You agree to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Keep your login credentials confidential</li>
            <li>Notify us immediately of unauthorized access</li>
            <li>Not share your account with others</li>
            <li>Use strong, unique passwords</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">4.3 API Credentials</h3>
          <p>
            You are responsible for the security of your Zerodha API credentials. We encrypt and store them securely,
            but you must ensure they are not compromised at your end.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Subscription Plans and Payments</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.1 Plans</h3>
          <p>We offer three subscription tiers:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Basic (₹999/month):</strong> Manual login, 5 active strategies, basic features</li>
            <li><strong>Elite (₹2,999/month):</strong> Auto-login, 15 active strategies, priority support</li>
            <li><strong>Pro (₹9,999/month):</strong> Auto-login, unlimited strategies, dedicated support</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.2 Billing</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Subscriptions are billed monthly in advance</li>
            <li>Payments are processed securely through Razorpay</li>
            <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
            <li>Subscription auto-renews unless cancelled</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">5.3 Cancellation</h3>
          <p>
            You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.
            No refunds are provided for partial months.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Prohibited Activities</h2>
          <p>You may not:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Use the Platform for illegal activities</li>
            <li>Attempt to hack, reverse engineer, or compromise the Platform</li>
            <li>Share or resell access to the Platform</li>
            <li>Use automated scripts to abuse the Platform</li>
            <li>Manipulate or falsify trading data</li>
            <li>Violate any securities laws or regulations</li>
            <li>Impersonate others or provide false information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. Intellectual Property</h2>
          <p>
            All content, features, and functionality of the Platform are owned by AIRA and protected by copyright,
            trademark, and other intellectual property laws. You may not copy, modify, distribute, or create
            derivative works without our written permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">8. Disclaimers and Limitations</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">8.1 No Investment Advice</h3>
          <p>
            AIRA does not provide investment advice, recommendations, or tips. All content is for informational
            purposes only. Consult a SEBI registered advisor before making investment decisions.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">8.2 No Guarantees</h3>
          <p>
            We do not guarantee:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Profitability of any strategy</li>
            <li>Accuracy of AI predictions or analysis</li>
            <li>Uninterrupted or error-free service</li>
            <li>Prevention of all security breaches</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">8.3 Service Availability</h3>
          <p>
            The Platform may be unavailable due to maintenance, technical issues, or factors beyond our control.
            We are not liable for losses resulting from service interruptions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">9. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, AIRA SHALL NOT BE LIABLE FOR:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Trading losses or missed opportunities</li>
            <li>Errors in AI analysis or strategy execution</li>
            <li>Data loss or security breaches</li>
            <li>Third-party service failures (Zerodha, payment processors, etc.)</li>
            <li>Indirect, incidental, or consequential damages</li>
          </ul>
          <p className="mt-4">
            Our total liability shall not exceed the amount you paid for the subscription in the past 12 months.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">10. Indemnification</h2>
          <p>
            You agree to indemnify and hold AIRA harmless from any claims, losses, or damages arising from:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Your use of the Platform</li>
            <li>Your trading activities</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any laws or regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">11. Termination</h2>
          <p>
            We may suspend or terminate your account at any time for:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Violation of these Terms</li>
            <li>Fraudulent or illegal activity</li>
            <li>Non-payment of subscription fees</li>
            <li>Abuse of the Platform or support services</li>
          </ul>
          <p className="mt-4">
            Upon termination, your access will be revoked, and we may delete your data after a retention period.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
            jurisdiction of courts in [Your City], India.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">13. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. We will notify you of significant changes via email or
            platform notification. Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">14. Contact Information</h2>
          <p>For questions about these Terms, contact us at:</p>
          <ul className="list-none space-y-2 ml-4 mt-4">
            <li><strong>Email:</strong> legal@aira.trading</li>
            <li><strong>Support:</strong> Use the in-app support ticket system</li>
          </ul>
        </section>

        <div className="mt-12 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-3">SEBI Compliance Disclaimer</h3>
          <p className="text-sm text-red-900 dark:text-red-200">
            AIRA is a technology platform providing trading tools and automation. We are NOT a SEBI registered
            investment advisor, research analyst, or portfolio manager. We do not provide investment advice,
            stock recommendations, or tips. All trading decisions are made by you or your configured AI strategies.
            Trading in securities markets involves substantial risk. You should carefully consider your financial
            situation and consult a SEBI registered advisor before trading.
          </p>
        </div>
      </div>
    </div>
  )
}
