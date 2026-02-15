# AIRA - AI Trading Platform

AIRA is an AI-powered trading platform that integrates with broker APIs to provide real-time market data, automated trading execution, strategy creation with AI assistance, backtesting capabilities, and comprehensive market analysis.

## Project Structure

This is a monorepo containing:

- `frontend/` - Next.js 14 web application with PWA support
- `backend/` - Express.js backend services with TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Railway account (for backend deployment)
- Vercel account (for frontend deployment)

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# Run development servers
npm run dev
```

### Development

```bash
# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Run tests
npm test

# Run linting
npm lint
```

## Tech Stack

### Frontend
- Next.js 14 with App Router
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Lightweight Charts (TradingView)

### Backend
- Node.js 20
- Express.js
- TypeScript
- Prisma ORM
- Socket.io
- BullMQ

### Infrastructure
- Database: Supabase (PostgreSQL)
- Backend Hosting: Railway
- Frontend Hosting: Vercel
- CI/CD: GitHub Actions

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel
```

### Backend (Railway)
```bash
cd backend
railway up
```

## License

Proprietary - All rights reserved
