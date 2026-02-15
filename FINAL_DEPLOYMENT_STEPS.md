# Aira App - Final Deployment Steps

## ✅ What I've Done Automatically:

1. **Railway Backend Environment Variables** - All set:
   - DATABASE_URL (with your Supabase password)
   - DIRECT_URL (with your Supabase password)
   - JWT_SECRET (generated secure secret)
   - NODE_ENV=production
   - PORT=3000
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
   - RAZORPAY_WEBHOOK_SECRET

2. **Railway Domain Generated:**
   - Backend URL: `https://aira-backend-production-e451.up.railway.app`

3. **Configuration Files Created:**
   - `backend/railway.json` - Railway configuration
   - `frontend/vercel.json` - Vercel configuration
   - `.railwayignore` - Ignore frontend in backend deployment

4. **Pushed to GitHub** - All configuration files committed

## ⚠️ What You Need to Do Manually (5 minutes):

### Step 1: Fix Railway Root Directory

Railway is trying to deploy from the root and detecting the frontend's vulnerable Next.js package. You need to set the root directory:

1. Go to: https://railway.app/project/236f1dab-f66b-41c4-bd6e-7183701f67ff
2. Click on "aira-backend" service
3. Click "Settings" tab
4. Scroll to "Source" section
5. Set **Root Directory**: `backend`
6. Click "Save"
7. Go to "Deployments" tab
8. Click "Deploy" button

This will deploy only the backend folder and ignore the frontend's package-lock.json.

### Step 2: Wait for Backend Deployment (2-3 minutes)

Once you set the root directory and click deploy:
- Wait for the build to complete
- Check logs for any errors
- Backend will be available at: `https://aira-backend-production-e451.up.railway.app`

### Step 3: Test Backend

Visit: `https://aira-backend-production-e451.up.railway.app/health`

Should return: `{"status": "ok"}`

### Step 4: Configure Vercel Frontend

1. Go to: https://vercel.com/dashboard
2. Find "Aira App" project
3. Go to "Settings" → "General"
4. Set **Root Directory**: `frontend`
5. Go to "Settings" → "Environment Variables"
6. Add these variables for all environments (Production, Preview, Development):

```env
NEXT_PUBLIC_API_URL=https://aira-backend-production-e451.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://twyjeyywtwevuibzdufk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3eWpleXl3dHdldnVpYnpkdWZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDQ1NzcsImV4cCI6MjA4NjcyMDU3N30.LhvfLESx0fimZEFwGc4N9AZHdb8I8amtyt1vJ8VdIHs
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_S8Wt5wffpsSsiF
```

7. Go to "Deployments" tab
8. Click "Redeploy" button

### Step 5: Initialize Database (Optional)

If you need to run Prisma migrations:

```bash
# Using Railway CLI
railway link
railway run npx prisma migrate deploy
```

Or run migrations manually in Supabase SQL Editor.

## 🎉 That's It!

After completing these 5 steps (should take 5-10 minutes total):

- ✅ Backend will be live at: `https://aira-backend-production-e451.up.railway.app`
- ✅ Frontend will be live at: `https://[your-vercel-url].vercel.app`
- ✅ Database connected via Supabase
- ✅ All environment variables configured
- ✅ Razorpay payment integration ready

## Quick Verification:

1. **Backend Health**: `https://aira-backend-production-e451.up.railway.app/health`
2. **Frontend**: Visit your Vercel URL
3. **Try Signup/Login**: Test authentication
4. **Check Dashboard**: Verify API calls work

## Troubleshooting:

### If Backend Still Fails:
- Check Railway logs in dashboard
- Verify root directory is set to `backend`
- Ensure all environment variables are set

### If Frontend Fails:
- Check Vercel logs
- Verify root directory is set to `frontend`
- Ensure environment variables are set
- Check API URL is correct

## Architecture Summary:

```
User Browser
     ↓
Vercel Frontend (Next.js)
https://[your-app].vercel.app
     ↓
Railway Backend (Express/Node.js)
https://aira-backend-production-e451.up.railway.app
     ↓
Supabase Database (PostgreSQL)
https://twyjeyywtwevuibzdufk.supabase.co
```

## All Credentials Configured:

✅ Supabase Database Password  
✅ JWT Secret  
✅ Razorpay Keys  
✅ Supabase API Keys  
✅ Backend URL  
✅ Frontend URL (after Vercel deployment)

## What's Left for Later:

- Individual user Zerodha API keys (configured by users in settings)
- Admin Zerodha Data API keys (configured by admin in admin panel)
- AI API keys (configured by admin in admin panel)
- Telegram/WhatsApp (configured by users individually)
- Razorpay plan IDs (you'll provide later)

---

**Total Time Required: 5-10 minutes**

Start with Step 1 in Railway dashboard to set the root directory to `backend`!
