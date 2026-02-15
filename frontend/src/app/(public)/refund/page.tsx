'use client'

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Refund Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated: February 14, 2026</p>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Overview</h2>
          <p>
            This Refund Policy outlines the terms and conditions for refunds on AIRA subscription plans.
            We strive to provide excellent service, but we understand that circumstances may require a refund.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Subscription Plans</h2>
          <p>AIRA offers three monthly subscription plans:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Basic:</strong> ₹999/month</li>
            <li><strong>Elite:</strong> ₹2,999/month</li>
            <li><strong>Pro:</strong> ₹9,999/month</li>
          </ul>
          <p className="mt-4">
            All subscriptions are billed monthly in advance and auto-renew unless cancelled.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Refund Eligibility</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.1 7-Day Money-Back Guarantee</h3>
          <p>
            We offer a 7-day money-back guarantee for first-time subscribers. If you are not satisfied with the
            Platform within 7 days of your initial subscription payment, you may request a full refund.
          </p>
          <p className="mt-4">
            <strong>Conditions:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Applies only to your first subscription payment</li>
            <li>Request must be made within 7 days of payment</li>
            <li>Account must not have been used for abusive or fraudulent activities</li>
            <li>Does not apply to subscription renewals</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.2 Technical Issues</h3>
          <p>
            If you experience significant technical issues that prevent you from using the Platform, and we are
            unable to resolve them within a reasonable timeframe, you may be eligible for a prorated refund.
          </p>
          <p className="mt-4">
            <strong>Conditions:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Issue must be reported through our support ticket system</li>
            <li>You must provide reasonable cooperation in troubleshooting</li>
            <li>Issue must be on our end, not due to your internet, device, or third-party services</li>
            <li>Refund amount will be prorated based on unused days in the billing period</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">3.3 Service Downtime</h3>
          <p>
            If the Platform experiences extended downtime (more than 48 consecutive hours) due to issues on our end,
            affected users may receive a prorated credit or refund for the downtime period.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Non-Refundable Situations</h2>
          <p>
            Refunds will NOT be provided in the following situations:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li><strong>Trading Losses:</strong> We do not refund subscriptions due to trading losses or unprofitable strategies</li>
            <li><strong>Change of Mind:</strong> After the 7-day guarantee period, refunds are not provided for change of mind</li>
            <li><strong>Partial Month Usage:</strong> No refunds for unused portion of a billing period (except technical issues)</li>
            <li><strong>Subscription Renewals:</strong> The 7-day guarantee does not apply to renewal payments</li>
            <li><strong>Account Violations:</strong> No refunds if your account is terminated for Terms of Service violations</li>
            <li><strong>Third-Party Issues:</strong> Issues with Zerodha, payment processors, or your internet connection</li>
            <li><strong>User Error:</strong> Mistakes in strategy configuration or risk settings</li>
            <li><strong>Market Conditions:</strong> Unfavorable market conditions or volatility</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. How to Request a Refund</h2>
          <p>To request a refund:</p>
          <ol className="list-decimal list-inside space-y-3 ml-4">
            <li>
              <strong>Submit a Support Ticket:</strong> Go to Settings → Support and create a new ticket with category "Billing & Payments"
            </li>
            <li>
              <strong>Provide Details:</strong> Include your payment ID, reason for refund, and any relevant details
            </li>
            <li>
              <strong>Wait for Review:</strong> Our team will review your request within 2-3 business days
            </li>
            <li>
              <strong>Receive Decision:</strong> You will be notified of the decision via email and support ticket
            </li>
          </ol>
          <p className="mt-4">
            Alternatively, you can email us at: <strong>billing@aira.trading</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">6. Refund Processing</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.1 Timeline</h3>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Approved refunds are processed within 5-7 business days</li>
            <li>Refunds are issued to the original payment method</li>
            <li>Bank processing may take an additional 5-10 business days</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.2 Prorated Refunds</h3>
          <p>
            When applicable, prorated refunds are calculated as:
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4 font-mono text-sm">
            Refund Amount = (Subscription Price / 30) × Unused Days
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">6.3 Payment Gateway Fees</h3>
          <p>
            Payment gateway fees (charged by Razorpay) are non-refundable. Refund amounts may be reduced by
            these fees, typically 2-3% of the transaction amount.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">7. Cancellation vs Refund</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">7.1 Cancellation</h3>
          <p>
            You can cancel your subscription at any time from Settings → Payment. Cancellation takes effect at
            the end of the current billing period. You will retain access until then, but no refund is provided
            for the remaining days.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">7.2 Immediate Termination with Refund</h3>
          <p>
            If you want to terminate immediately and request a refund, you must submit a support ticket explaining
            the reason. Refunds are subject to the eligibility criteria outlined in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">8. Chargebacks</h2>
          <p>
            If you initiate a chargeback with your bank or credit card company without first contacting us:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Your account will be immediately suspended</li>
            <li>We will provide evidence to the payment processor</li>
            <li>Unjustified chargebacks may result in permanent account termination</li>
            <li>You may be liable for chargeback fees and legal costs</li>
          </ul>
          <p className="mt-4">
            <strong>Please contact us first</strong> to resolve any billing disputes before initiating a chargeback.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">9. Free Trials and Promotional Offers</h2>
          <p>
            If we offer free trials or promotional discounts:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Free trials can be cancelled anytime before the trial ends to avoid charges</li>
            <li>Promotional discounts are non-refundable</li>
            <li>Special terms may apply to specific promotions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">10. Changes to This Policy</h2>
          <p>
            We may update this Refund Policy periodically. Changes will be posted on this page with an updated
            "Last Updated" date. Significant changes will be communicated via email or platform notification.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">11. Contact Us</h2>
          <p>
            For refund requests or questions about this policy:
          </p>
          <ul className="list-none space-y-2 ml-4 mt-4">
            <li><strong>Email:</strong> billing@aira.trading</li>
            <li><strong>Support Tickets:</strong> Settings → Support (in-app)</li>
            <li><strong>Response Time:</strong> 2-3 business days</li>
          </ul>
        </section>

        <div className="mt-12 p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-200 mb-3">Important Reminder</h3>
          <p className="text-sm text-yellow-900 dark:text-yellow-200">
            AIRA is a technology platform providing trading tools. We do not guarantee profits or refund subscriptions
            due to trading losses. All trading involves substantial risk. The 7-day money-back guarantee is for
            evaluating the Platform's features and functionality, not for testing trading strategies with real money.
            We recommend using paper trading mode during your evaluation period.
          </p>
        </div>
      </div>
    </div>
  )
}
