'use client'

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated: February 14, 2026</p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Introduction</h2>
          <p>
            AIRA ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our AI-powered trading platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.1 Personal Information</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Name and email address</li>
            <li>Account credentials (encrypted)</li>
            <li>Payment information (processed securely through Razorpay)</li>
            <li>Phone number (for WhatsApp notifications, if enabled)</li>
            <li>Telegram ID (for Telegram notifications, if enabled)</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.2 Trading Information</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Zerodha API credentials (encrypted with AES-256)</li>
            <li>Trading strategies and configurations</li>
            <li>Trade history and performance data</li>
            <li>Risk settings and preferences</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">2.3 Usage Information</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Device information and browser type</li>
            <li>IP address and location data</li>
            <li>Usage patterns and feature interactions</li>
            <li>Error logs and performance metrics</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>To provide and maintain our trading platform services</li>
            <li>To execute trades on your behalf through Zerodha API</li>
            <li>To send notifications about trades, alerts, and account activity</li>
            <li>To process subscription payments</li>
            <li>To improve our AI algorithms and platform features</li>
            <li>To provide customer support</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your information:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>AES-256 encryption for all API credentials</li>
            <li>Secure HTTPS connections for all data transmission</li>
            <li>Regular security audits and monitoring</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Automated daily backups stored in separate geographic locations</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the Internet is 100% secure. While we strive to protect your data,
            we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Data Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share your data with:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Zerodha:</strong> To execute trades on your behalf</li>
            <li><strong>Razorpay:</strong> To process payments</li>
            <li><strong>OpenAI:</strong> To provide AI-powered analysis (anonymized data only)</li>
            <li><strong>Service Providers:</strong> Hosting (Railway, Vercel), database (Supabase), monitoring (Sentry)</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Export your trading data</li>
            <li>Opt-out of marketing communications</li>
            <li>Disable specific notification channels</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to provide services.
            After account deletion, we may retain certain data for legal compliance, dispute resolution, and
            fraud prevention for up to 7 years as required by Indian financial regulations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">8. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to maintain your session, remember preferences, and analyze usage.
            You can control cookies through your browser settings, but disabling them may affect platform functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">9. Third-Party Links</h2>
          <p>
            Our platform may contain links to third-party websites. We are not responsible for the privacy practices
            of these external sites. Please review their privacy policies before providing any information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">10. Children's Privacy</h2>
          <p>
            Our platform is not intended for users under 18 years of age. We do not knowingly collect information
            from children. If you believe we have collected data from a minor, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of significant changes via email
            or platform notification. Continued use of the platform after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">12. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at:
          </p>
          <ul className="list-none space-y-2 ml-4 mt-4">
            <li><strong>Email:</strong> privacy@aira.trading</li>
            <li><strong>Support:</strong> Use the in-app support ticket system</li>
          </ul>
        </section>

        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>Important:</strong> AIRA is a technology platform and not a SEBI registered investment advisor.
            We do not provide investment advice, recommendations, or tips. All trading decisions are your responsibility.
          </p>
        </div>
      </div>
    </div>
  )
}
