# Aira App - Deployment Credentials & Configuration

**⚠️ CONFIDENTIAL - DO NOT COMMIT TO GIT**

## Supabase Configuration

### Project Details
- **Project ID:** twyjeyywtwevuibzdufk
- **Project Name:** Aira App
- **Region:** ap-south-1
- **Status:** Active & Healthy

### API Credentials
- **Project URL:** https://twyjeyywtwevuibzdufk.supabase.co
- **Anon Key (Public):** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eWpleXl3dHdldnVpYnpkdWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDQ1NzcsImV4cCI6MjA4NjcyMDU3N30.LhvfLESx0fimZEFwGc4N9AZHdb8I8amtyt1vJ8VdIHs
- **Publishable Key:** sb_publishable_pSZ0Ht_V7mUwVu2vg6lGmg_s1bdNoSm

### Database Connection
- **Host:** db.twyjeyywtwevuibzdufk.supabase.co
- **Database URL:** postgres://postgres.[password]@db.twyjeyywtwevuibzdufk.supabase.co:5432/postgres
- **Direct URL:** postgres://postgres.[password]@db.twyjeyywtwevuibzdufk.supabase.co:5432/postgres

**Note:** Get the actual database password from Supabase Dashboard → Project Settings → Database

## Railway Configuration

### Project Details
- **Project ID:** 236f1dab-f66b-41c4-bd6e-7183701f67ff
- **Project Name:** AIRA APP
- **Environment ID:** 1dc0dd80-f479-4e01-89db-100ca313140c (production)

### Services
1. **Backend Service**
   - **Service ID:** a1ee5f04-d6ec-4ca8-a24d-893ace6a2f5d
   - **Name:** aira-backend
   - **Source:** /backend directory
   
2. **Frontend Service** (Optional - using Vercel instead)
   - **Service ID:** 97739191-cf1d-4e57-89d5-1a1ec7dceab9
   - **Name:** aira-frontend

### Generated Secrets
- **JWT_SECRET:** wvuVpr7T3c8x2GXUIsdFaZzQf5e9m1JMj6hAgiP0k4NLOCqlynRWKEtDYoSBHb

## Vercel Configuration

### Project Details
- **Project:** Aira App (existing)
- **GitHub Repo:** https://github.com/srj-jakti/AIRA-APP.git
- **Source:** /frontend directory

## Required Environment Variables

### Backend (Railway) - aira-backend service

```env
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.twyjeyywtwevuibzdufk.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.twyjeyywtwevuibzdufk.supabase.co:5432/postgres

# Authentication
JWT_SECRET=wvuVpr7T3c8x2GXUIsdFaZzQf5e9m1JMj6hAgiP0k4NLOCqlynRWKEtDYoSBHb

# Zerodha API (Get from https://kite.zerodha.com/)
ZERODHA_API_KEY=your_zerodha_api_key
ZERODHA_API_SECRET=your_zerodha_api_secret

# Telegram Bot (Get from @BotFather)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

# WhatsApp API (Get from your provider)
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_API_URL=your_whatsapp_api_url

# Razorpay (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Application
NODE_ENV=production
PORT=3000
```

### Frontend (Vercel)

```env
# Backend API
NEXT_PUBLIC_API_URL=https://[railway-backend-url]

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://twyjeyywtwevuibzdufk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eWpleXl3dHdldnVpYnpkdWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDQ1NzcsImV4cCI6MjA4NjcyMDU3N30.LhvfLESx0fimZEFwGc4N9AZHdb8I8amtyt1vJ8VdIHs
```

## Deployment Steps

### Step 1: Get Missing Credentials

You need to provide:
1. **Supabase Database Password** - From Supabase Dashboard
2. **Zerodha API Credentials** - From Zerodha Kite Connect
3. **Telegram Bot Token** - From @BotFather on Telegram
4. **WhatsApp API Credentials** - From your WhatsApp Business API provider
5. **Razorpay Credentials** - From Razorpay Dashboard

### Step 2: Configure Railway Backend

The backend service needs to be connected to your GitHub repository manually:
1. Go to Railway Dashboard: https://railway.app/project/236f1dab-f66b-41c4-bd6e-7183701f67ff
2. Click on "aira-backend" service
3. Click "Connect Repo"
4. Select "srj-jakti/AIRA-APP"
5. Set root directory to `/backend`
6. Configure build command: `npm install && npx prisma generate`
7. Configure start command: `npm start`

### Step 3: Set Environment Variables

Use the Railway dashboard or CLI to set all environment variables listed above.

### Step 4: Deploy Backend

Once configured, Railway will automatically deploy when you push to GitHub.

### Step 5: Configure Vercel Frontend

1. Go to Vercel Dashboard
2. Link to your existing "Aira App" project
3. Configure root directory to `/frontend`
4. Set environment variables
5. Deploy

### Step 6: Update CORS

Update backend CORS settings to allow requests from Vercel frontend URL.

## Next Steps

1. Provide missing API credentials
2. Make GitHub repository public OR connect it manually in Railway dashboard
3. Configure environment variables
4. Deploy and test

## Security Notes

- Never commit this file to Git
- Rotate all secrets regularly
- Use different credentials for staging/production
- Enable 2FA on all service accounts
- Monitor API usage and logs
