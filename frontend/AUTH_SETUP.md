# Authentication Setup Guide

This document explains how to configure Supabase authentication for AIRA.

## Prerequisites

1. A Supabase project (create one at https://supabase.com)
2. Node.js 20+ installed

## Supabase Configuration

### 1. Enable Email/Password Authentication

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Enable "Email" provider
4. Configure email templates (optional)

### 2. Enable Google OAuth

1. Go to Authentication > Providers
2. Enable "Google" provider
3. Create OAuth credentials in Google Cloud Console:
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable Google+ API
   - Go to Credentials > Create Credentials > OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs: Add your Supabase callback URL
     - Format: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase Google provider settings

### 3. Configure Redirect URLs

1. Go to Authentication > URL Configuration
2. Add your site URL:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://your-domain.com/auth/callback`

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

Get your Supabase URL and anon key from:
- Project Settings > API > Project URL
- Project Settings > API > Project API keys > anon public

## Testing Authentication

### Email/Password Flow

1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000/signup
3. Create an account with email and password
4. Check your email for confirmation (if email confirmation is enabled)
5. Sign in at http://localhost:3000/login

### Google OAuth Flow

1. Navigate to http://localhost:3000/login
2. Click "Sign in with Google"
3. Complete Google authentication
4. You'll be redirected to /dashboard

## Security Features

### Implemented

- ✅ Email/password authentication
- ✅ Google OAuth integration
- ✅ Protected routes with middleware
- ✅ Session management
- ✅ Automatic token refresh
- ✅ Secure HTTP-only cookies (via Supabase)

### To Be Implemented (Task 2.3)

- ⏳ 30-minute inactivity timeout
- ⏳ CSRF protection
- ⏳ Rate limiting on login (5 attempts per 15 minutes)

## Troubleshooting

### "Invalid login credentials" error

- Check that email/password provider is enabled in Supabase
- Verify the user exists in Authentication > Users
- Check if email confirmation is required

### Google OAuth not working

- Verify Google OAuth credentials are correct
- Check redirect URLs are properly configured
- Ensure Google+ API is enabled in Google Cloud Console

### Middleware redirect loop

- Check that middleware matcher patterns are correct
- Verify session is being properly set
- Clear browser cookies and try again

## Next Steps

After authentication is working:

1. Implement session timeout (Task 2.3)
2. Add CSRF protection (Task 2.3)
3. Implement rate limiting (Task 2.3)
4. Create user profile management
5. Add password reset functionality
