# Aira App - Complete Deployment Instructions

## Current Status

✅ **Supabase** - Configured and ready  
✅ **Railway** - Project and services created  
✅ **Vercel** - Project exists and connected  
⚠️ **GitHub** - Repository is private (needs manual connection)

## Quick Deployment Guide

### Phase 1: Connect Railway to GitHub (Manual Step Required)

Since your repository is private, you need to connect it manually:

1. **Open Railway Dashboard**
   - Go to: https://railway.app/project/236f1dab-f66b-41c4-bd6e-7183701f67ff
   - Login with your account

2. **Configure Backend Service**
   - Click on "aira-backend" service
   - Click "Settings" → "Source"
   - Click "Connect Repo"
   - Authorize Railway to access your GitHub
   - Select repository: `srj-jakti/AIRA-APP`
   - Set **Root Directory**: `/backend`
   - Set **Build Command**: `npm install && npx prisma generate && npm run build`
   - Set **Start Command**: `npm start`
   - Click "Deploy"

3. **Get Backend URL**
   - After deployment, go to "Settings" → "Networking"
   - Click "Generate Domain"
   - Copy the generated URL (e.g., `https://aira-backend-production.up.railway.app`)

### Phase 2: Set Environment Variables

#### A. Get Supabase Database Password

1. Go to: https://supabase.com/dashboard/project/twyjeyywtwevuibzdufk
2. Click "Project Settings" → "Database"
3. Copy the database password
4. Construct connection strings:
   ```
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.twyjeyywtwevuibzdufk.supabase.co:6543/postgres?pgbouncer=true
   DIRECT_URL=postgresql://postgres:[PASSWORD]@db.twyjeyywtwevuibzdufk.supabase.co:5432/postgres
   ```

#### B. Configure Railway Backend Variables

In Railway Dashboard → aira-backend → Variables, add:

```env
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.twyjeyywtwevuibzdufk.supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres:[YOUR_PASSWORD]@db.twyjeyywtwevuibzdufk.supabase.co:5432/postgres
JWT_SECRET=wvuVpr7T3c8x2GXUIsdFaZzQf5e9m1JMj6hAgiP0k4NLOCqlynRWKEtDYoSBHb
NODE_ENV=production
PORT=3000
```

**Optional API Keys** (add when you have them):
```env
ZERODHA_API_KEY=your_key
ZERODHA_API_SECRET=your_secret
TELEGRAM_BOT_TOKEN=your_token
WHATSAPP_API_KEY=your_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

### Phase 3: Deploy Frontend to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your "Aira App" project

2. **Configure Project Settings**
   - Go to Project Settings → General
   - Set **Root Directory**: `frontend`
   - Set **Framework Preset**: Next.js
   - Set **Build Command**: `npm run build`
   - Set **Output Directory**: `.next`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add these variables for all environments (Production, Preview, Development):
   
   ```env
   NEXT_PUBLIC_API_URL=https://[your-railway-backend-url]
   NEXT_PUBLIC_SUPABASE_URL=https://twyjeyywtwevuibzdufk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eWpleXl3dHdldnVpYnpkdWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDQ1NzcsImV4cCI6MjA4NjcyMDU3N30.LhvfLESx0fimZEFwGc4N9AZHdb8I8amtyt1vJ8VdIHs
   ```

4. **Deploy**
   - Go to Deployments tab
   - Click "Redeploy" or push to GitHub to trigger deployment

#### Option B: Using Vercel CLI

```bash
cd frontend
vercel --prod
```

### Phase 4: Initialize Database

After backend is deployed, run database migrations:

1. **Option A: Using Railway CLI**
   ```bash
   railway link
   railway run npx prisma migrate deploy
   railway run npx prisma db seed
   ```

2. **Option B: Using Supabase Dashboard**
   - Go to SQL Editor in Supabase Dashboard
   - Run your migration SQL files manually

### Phase 5: Configure CORS

Update your backend to allow requests from Vercel:

1. Edit `backend/src/index.ts` (if not already configured)
2. Add Vercel URL to CORS origins:
   ```typescript
   const corsOptions = {
     origin: [
       'https://your-vercel-app.vercel.app',
       'http://localhost:3000'
     ],
     credentials: true
   };
   ```
3. Commit and push to trigger redeployment

### Phase 6: Test Deployment

1. **Test Backend**
   - Visit: `https://[railway-backend-url]/health`
   - Should return: `{"status": "ok"}`

2. **Test Frontend**
   - Visit: `https://[vercel-frontend-url]`
   - Should load the landing page

3. **Test Integration**
   - Try signing up/logging in
   - Check if API calls work
   - Verify database connections

## Troubleshooting

### Backend Won't Deploy

**Check:**
- Build logs in Railway dashboard
- Environment variables are set correctly
- Database connection string is correct
- Node version compatibility (use Node 18+)

**Fix:**
- Add `"engines": {"node": "18.x"}` to backend/package.json
- Check Prisma schema matches database

### Frontend Won't Deploy

**Check:**
- Build logs in Vercel dashboard
- Root directory is set to `frontend`
- Environment variables are set
- Next.js version compatibility

**Fix:**
- Ensure all dependencies are in package.json
- Check for TypeScript errors
- Verify API URL is correct

### Database Connection Fails

**Check:**
- Database password is correct
- Connection string format is correct
- Supabase project is active
- IP allowlist (Supabase allows all by default)

**Fix:**
- Get fresh connection string from Supabase dashboard
- Use connection pooling URL (port 6543) for DATABASE_URL
- Use direct connection URL (port 5432) for DIRECT_URL

### CORS Errors

**Check:**
- Backend CORS configuration includes Vercel URL
- Credentials are enabled in CORS
- Frontend is using correct API URL

**Fix:**
- Update CORS origins in backend
- Redeploy backend after changes
- Clear browser cache

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Authentication working
- [ ] API endpoints responding
- [ ] WebSocket connections working (if applicable)
- [ ] Payment integration tested (Razorpay)
- [ ] Notification services configured (Telegram, WhatsApp)
- [ ] Trading API connected (Zerodha)

## URLs Reference

- **Supabase Dashboard:** https://supabase.com/dashboard/project/twyjeyywtwevuibzdufk
- **Railway Dashboard:** https://railway.app/project/236f1dab-f66b-41c4-bd6e-7183701f67ff
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repository:** https://github.com/srj-jakti/AIRA-APP

## Next Steps

1. ✅ Follow Phase 1 to connect Railway to GitHub
2. ✅ Get Supabase database password
3. ✅ Configure environment variables
4. ✅ Deploy backend
5. ✅ Deploy frontend
6. ✅ Test everything
7. ✅ Configure custom domain (optional)

## Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs in Railway/Vercel dashboards
3. Verify all environment variables are set correctly
4. Ensure database migrations are applied

---

**Ready to deploy!** Start with Phase 1 and work through each phase systematically.
