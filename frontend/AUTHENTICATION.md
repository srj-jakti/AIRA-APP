# Authentication Implementation

## Overview

This document describes the Supabase authentication implementation for AIRA, completed as part of Task 2.2.

## Features Implemented

### ✅ Email/Password Authentication
- User signup with email, password, and name
- User login with email and password
- Password validation (minimum 6 characters)
- Secure password storage via Supabase Auth

### ✅ Google OAuth Integration
- "Sign in with Google" button on login page
- "Sign up with Google" button on signup page
- Automatic account creation/linking for OAuth users
- Seamless redirect flow via `/auth/callback`

### ✅ Protected Routes Middleware
- Automatic redirect to `/login` for unauthenticated users accessing protected routes
- Automatic redirect to `/dashboard` for authenticated users accessing auth pages
- Protected routes: `/dashboard`, `/strategy`, `/scanner`, `/analysis`, `/settings`
- Public routes: `/`, `/login`, `/signup`

### ✅ Authentication Context
- Global auth state management via React Context
- Real-time auth state updates
- Loading states during authentication
- User session management

## File Structure

```
frontend/src/
├── lib/
│   ├── supabase.ts          # Supabase client initialization
│   └── auth.ts              # Authentication functions
├── contexts/
│   └── AuthContext.tsx      # Auth context provider
├── middleware.ts            # Route protection middleware
└── app/
    ├── (auth)/
    │   ├── login/
    │   │   └── page.tsx     # Login page
    │   ├── signup/
    │   │   └── page.tsx     # Signup page
    │   └── layout.tsx       # Auth layout
    ├── (dashboard)/
    │   ├── dashboard/
    │   │   └── page.tsx     # Dashboard page
    │   └── layout.tsx       # Dashboard layout
    └── auth/
        └── callback/
            └── route.ts     # OAuth callback handler
```

## Authentication Flow

### Email/Password Signup
1. User fills signup form (name, email, password, confirm password)
2. User accepts terms and conditions
3. Form validation (password match, length, terms accepted)
4. Call `signUp()` function
5. Supabase creates user account
6. User is redirected to dashboard
7. Email confirmation sent (if enabled in Supabase)

### Email/Password Login
1. User fills login form (email, password)
2. Call `signIn()` function
3. Supabase validates credentials
4. Session created and stored in cookies
5. User is redirected to dashboard

### Google OAuth Flow
1. User clicks "Sign in with Google"
2. User must accept terms (for signup)
3. Call `signInWithGoogle()` function
4. Redirect to Google OAuth consent screen
5. User authorizes AIRA
6. Google redirects to `/auth/callback` with code
7. Code exchanged for session
8. User is redirected to dashboard

### Protected Route Access
1. User navigates to protected route (e.g., `/dashboard`)
2. Middleware checks for active session
3. If no session: redirect to `/login?redirect=/dashboard`
4. If session exists: allow access
5. After login: redirect to original destination

## API Functions

### `signUp({ email, password, name })`
Creates a new user account with email and password.

### `signIn({ email, password })`
Authenticates user with email and password.

### `signInWithGoogle()`
Initiates Google OAuth flow.

### `signOut()`
Signs out the current user and clears session.

### `getCurrentUser()`
Returns the currently authenticated user or null.

### `getSession()`
Returns the current session or null.

### `onAuthStateChange(callback)`
Subscribes to auth state changes.

## Security Features

### Implemented
- ✅ Secure session management via HTTP-only cookies (Supabase default)
- ✅ Automatic token refresh
- ✅ Protected routes with middleware
- ✅ Terms acceptance required for signup
- ✅ Password strength validation
- ✅ OAuth state verification

### To Be Implemented (Task 2.3)
- ⏳ 30-minute inactivity timeout
- ⏳ CSRF protection
- ⏳ Rate limiting (5 login attempts per 15 minutes)

## Environment Variables

Required environment variables in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Configuration Required

### 1. Enable Email Provider
- Go to Authentication > Providers
- Enable "Email" provider
- Configure email templates (optional)

### 2. Enable Google OAuth
- Go to Authentication > Providers
- Enable "Google" provider
- Add Google OAuth credentials:
  - Client ID from Google Cloud Console
  - Client Secret from Google Cloud Console

### 3. Configure Redirect URLs
- Go to Authentication > URL Configuration
- Add site URLs:
  - Development: `http://localhost:3000`
  - Production: `https://your-domain.com`
- Add redirect URLs:
  - `http://localhost:3000/auth/callback`
  - `https://your-domain.com/auth/callback`

## Testing

### Manual Testing Checklist

#### Email/Password Signup
- [ ] Can create account with valid email and password
- [ ] Password validation works (min 6 characters)
- [ ] Password confirmation validation works
- [ ] Terms acceptance is required
- [ ] Redirects to dashboard after signup
- [ ] Error messages display for invalid input

#### Email/Password Login
- [ ] Can login with valid credentials
- [ ] Error message for invalid credentials
- [ ] Redirects to dashboard after login
- [ ] "Forgot password" link is present

#### Google OAuth
- [ ] "Sign in with Google" button works
- [ ] Google consent screen appears
- [ ] Redirects to dashboard after OAuth
- [ ] User profile data is retrieved (name, email)
- [ ] Terms acceptance required for signup

#### Protected Routes
- [ ] Cannot access `/dashboard` without login
- [ ] Redirected to `/login` when accessing protected route
- [ ] Redirect parameter preserved in URL
- [ ] Redirected to original destination after login
- [ ] Can access protected routes when logged in

#### Session Management
- [ ] Session persists across page refreshes
- [ ] Can sign out successfully
- [ ] Redirected to home page after sign out
- [ ] Session cleared after sign out

## Compliance

### SEBI Disclaimers
Disclaimers are displayed on:
- ✅ Login page footer
- ✅ Signup page (terms acceptance)
- ✅ Home page

Disclaimer text:
> "AIRA is a software platform providing autonomous trading tools. We do not provide trading advice, recommendations, or tips. Users are solely responsible for their trading decisions."

## Dependencies

```json
{
  "@supabase/supabase-js": "^2.43.4",
  "@supabase/ssr": "^0.5.2"
}
```

## Known Issues

None at this time.

## Future Enhancements

1. Two-factor authentication (2FA)
2. Password reset flow
3. Email verification flow
4. Social login with more providers (Facebook, Apple)
5. Biometric authentication for PWA
6. Remember me functionality
7. Session management dashboard

## Requirements Validated

This implementation validates the following requirements:

- **Requirement 3.1**: Users can configure personal API credentials (foundation for user accounts)
- **Requirement 49.1**: Login page displays "Sign in with Google" button
- **Requirement 49.2**: Signup page displays "Sign up with Google" button
- **Requirement 49.3**: Google OAuth 2.0 authentication works correctly

## Related Tasks

- **Task 2.1**: ✅ Create Prisma schema (completed)
- **Task 2.2**: ✅ Implement Supabase authentication (this task)
- **Task 2.3**: ⏳ Implement session management and security (next)
- **Task 2.4**: ⏳ Write property test for session timeout
- **Task 2.5**: ⏳ Write property test for login rate limiting
