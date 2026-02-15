# Aira App - Production Deployment Plan

**Date:** February 15, 2026  
**GitHub Repo:** https://github.com/srj-jakti/AIRA-APP.git

## Infrastructure Overview

### 1. Supabase (Database & Auth)
- **Project:** Aira App (twyjeyywtwevuibzdufk)
- **Region:** ap-south-1
- **Database:** PostgreSQL 17.6.1
- **Host:** db.twyjeyywtwevuibzdufk.supabase.co
- **Status:** ✅ Active and Healthy

### 2. Railway (Backend API)
- **Project:** AIRA APP (236f1dab-f66b-41c4-bd6e-7183701f67ff)
- **Status:** ✅ Connected
- **Deploy:** Node.js/Express backend from `/backend`

### 3. Vercel (Frontend)
- **Project:** Aira App (existing)
- **Status:** ✅ Connected
- **Deploy:** Next.js frontend from `/frontend`

## Deployment Steps

### Phase 1: Setup Supabase Database ✅
1. Database schema already exists (Prisma schema)
2. Need to apply migrations
3. Configure authentication
4. Get connection strings

### Phase 2: Deploy Backend to Railway
1. Create service from GitHub repo
2. Configure build settings
3. Set environment variables
4. Deploy and get backend URL

### Phase 3: Deploy Frontend to Vercel
1. Link to existing Vercel project
2. Configure build settings
3. Set environment variables (backend URL)
4. Deploy and get frontend URL

### Phase 4: Connect Everything
1. Update frontend with backend URL
2. Update backend with Supabase credentials
3. Configure CORS
4. Test end-to-end

## Environment Variables Needed

### Backend (Railway)
```
DATABASE_URL=<supabase-connection-string>
DIRECT_URL=<supabase-direct-connection>
JWT_SECRET=<generate-secure-secret>
ZERODHA_API_KEY=<your-zerodha-key>
ZERODHA_API_SECRET=<your-zerodha-secret>
TELEGRAM_BOT_TOKEN=<your-telegram-token>
WHATSAPP_API_KEY=<your-whatsapp-key>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
NODE_ENV=production
PORT=3000
```

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=<railway-backend-url>
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

## Execution Status

- [ ] Phase 1: Supabase Setup
- [ ] Phase 2: Railway Backend Deployment
- [ ] Phase 3: Vercel Frontend Deployment
- [ ] Phase 4: Integration & Testing

## Next Actions

Starting deployment process...
