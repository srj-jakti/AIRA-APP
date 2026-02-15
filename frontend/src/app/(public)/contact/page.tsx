'use client'

import { Mail, MessageSquare, Phone } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    
    // TODO: Implement actual form submission to backend
    // For now, simulate submission
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions or need assistance? We&apos;re here to help
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <ContactInfo
                  icon={<Mail className="h-6 w-6 text-primary" />}
                  title="Email"
                  content="support@aira.trading"
                  description="We&apos;ll respond within 24 hours"
                />
                <ContactInfo
                  icon={<MessageSquare className="h-6 w-6 text-primary" />}
                  title="Support"
                  content="Help Center"
                  description="Browse our documentation and guides"
                />
                <ContactInfo
                  icon={<Phone className="h-6 w-6 text-primary" />}
                  title="Phone"
                  content="Pro Plan Only"
                  description="24/7 phone support for Pro subscribers"
                />
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-semibold mb-3">Business Hours</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                <p>Saturday: 10:00 AM - 4:00 PM IST</p>
                <p>Sunday: Closed</p>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Pro plan subscribers have access to 24/7 support
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Partnership Opportunity</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                {status === 'success' && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 dark:text-green-400">
                    Thank you for your message! We&apos;ll get back to you soon.
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400">
                    Something went wrong. Please try again or email us directly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our Privacy Policy
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Other Ways to Get Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HelpCard
              title="Documentation"
              description="Browse our comprehensive guides and tutorials"
              link="/docs"
              linkText="View Docs"
            />
            <HelpCard
              title="FAQ"
              description="Find answers to frequently asked questions"
              link="/faq"
              linkText="Read FAQ"
            />
            <HelpCard
              title="Community"
              description="Join our community forum to connect with other traders"
              link="/community"
              linkText="Join Community"
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-20 max-w-4xl mx-auto bg-muted/50 rounded-lg p-8">
          <p className="text-sm text-muted-foreground text-center">
            <strong className="text-foreground">Important:</strong> AIRA is a technology platform providing software tools. 
            We do not provide investment advice, recommendations, or tips. For questions about trading strategies or 
            market analysis, please consult with a SEBI registered financial advisor.
          </p>
        </div>
      </div>
    </div>
  )
}

function ContactInfo({ 
  icon, 
  title, 
  content, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  content: string
  description: string
}) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm font-medium mb-1">{content}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function HelpCard({ 
  title, 
  description, 
  link, 
  linkText 
}: { 
  title: string
  description: string
  link: string
  linkText: string
}) {
  return (
    <div className="p-6 border rounded-lg bg-card text-center">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <a
        href={link}
        className="text-sm text-primary hover:underline font-medium"
      >
        {linkText} →
      </a>
    </div>
  )
}
