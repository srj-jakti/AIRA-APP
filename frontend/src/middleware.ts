import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check session timeout
  if (session) {
    const lastActivity = req.cookies.get('last_activity')?.value
    const now = Date.now()

    if (lastActivity) {
      const timeSinceLastActivity = now - parseInt(lastActivity)
      
      // If session has been inactive for more than 30 minutes, sign out
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        await supabase.auth.signOut()
        const redirectUrl = new URL('/login', req.url)
        redirectUrl.searchParams.set('reason', 'timeout')
        redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
    }

    // Update last activity timestamp
    response.cookies.set('last_activity', now.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_TIMEOUT / 1000,
    })
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/strategy', '/scanner', '/analysis', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // Admin-only routes
  const adminRoutes = ['/settings/admin', '/admin']
  const isAdminRoute = adminRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // Public auth routes that should redirect to dashboard if already logged in
  const authRoutes = ['/login', '/signup']
  const isAuthRoute = authRoutes.some(route => req.nextUrl.pathname.startsWith(route))

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check admin access for admin routes
  if (isAdminRoute && session) {
    const { data: { user } } = await supabase.auth.getUser()
    const subscriptionPlan = user?.user_metadata?.subscription_plan || 'basic'
    
    if (subscriptionPlan !== 'admin') {
      // Return 403 Forbidden for non-admin users
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // Redirect to dashboard if accessing auth routes with active session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/strategy/:path*',
    '/scanner/:path*',
    '/analysis/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/login',
    '/signup',
  ],
}
