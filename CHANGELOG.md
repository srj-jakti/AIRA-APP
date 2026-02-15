# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Legal pages (Privacy Policy, Terms of Service, Refund Policy)
- Centralized error handling and logging system
- Automated backup service with 30-day retention
- CI/CD pipeline with GitHub Actions for staging and production
- Error display components with user-friendly messages
- Loading spinners and success messages
- Backup monitoring and manual trigger functionality
- Restoration instructions documentation
- Request logging middleware
- Admin backup management routes

### Changed
- Improved error messages to be more user-friendly
- Enhanced logging with severity levels (info, warning, error, critical)
- Updated CHANGELOG with recent improvements

### Fixed
- ESLint warnings in error handler

## [1.0.0] - 2026-02-14

**🎉 Initial Release - Production Launch**

### Features

#### Core Trading Platform
- AI-powered trading automation with risk management
- Strategy creation with AI assistance (natural language to strategy)
- Real-time market scanning with alerts
- Comprehensive backtesting engine with performance metrics
- Strategy marketplace (public, private, invite-only)
- Live and paper trading modes
- Market hours enforcement
- Server-side trading persistence

#### AI Features
- AI chart analysis with OpenAI GPT-4
- AI strategy generator with learning engine
- Scheduled AI strategy generation (twice weekly)
- Pattern recognition from platform strategies
- Shareable analysis snapshots with branding

#### Integrations
- Zerodha Kite Connect API integration
- Admin Data API management (1-10 keys with load balancing)
- Telegram bot with commands and notifications
- WhatsApp Business API with OTP verification
- Razorpay payment processing
- Multi-channel notifications (email, push, Telegram, WhatsApp)

#### Admin Panel
- User management and analytics
- Strategy moderation
- Support ticket system
- Admin Data API configuration
- Health monitoring dashboard
- Backup management

#### Security & Compliance
- Supabase authentication (email/password + Google OAuth)
- AES-256 credential encryption
- Session management with 30-minute timeout
- CSRF protection and rate limiting
- SEBI compliance disclaimers
- Legal pages (Privacy Policy, Terms of Service, Refund Policy)

#### Infrastructure
- Automated daily backups with 30-day retention
- Centralized error handling and logging
- CI/CD pipeline with GitHub Actions
- Health monitoring service
- SEO optimization with structured data
- PWA support with offline capabilities

#### User Experience
- Dark/light theme support
- Real-time WebSocket updates
- Responsive design for mobile and desktop
- Loading states and success messages
- User-friendly error messages
- Notification preferences

### Technical Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: PostgreSQL (Supabase)
- **Hosting**: Vercel (frontend), Railway (backend)
- **CI/CD**: GitHub Actions

### Subscription Plans
- **Basic**: ₹999/month - Manual login, 5 active strategies
- **Elite**: ₹2,999/month - Auto-login, 15 active strategies, priority support
- **Pro**: ₹9,999/month - Auto-login, unlimited strategies, dedicated support

### Documentation
- Complete setup and deployment guides
- API documentation
- User guides
- Legal documentation

### Known Limitations
- Single broker support (Zerodha only)
- English language only (Hindi planned for future)
- Basic analytics (advanced features planned)

### Notes
- Platform is SEBI compliant with appropriate disclaimers
- Not a SEBI registered investment advisor
- Users are responsible for their trading decisions
- Automated trading involves substantial risk
