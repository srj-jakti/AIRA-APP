import { AuthUser } from './auth'

export type SubscriptionPlan = 'basic' | 'elite' | 'pro' | 'admin'

/**
 * Check if a user has admin privileges
 */
export function isAdmin(user: AuthUser | null): boolean {
  if (!user) return false
  return (user.user_metadata as any)?.subscription_plan === 'admin'
}

/**
 * Check if a user has a specific subscription plan or higher
 */
export function hasSubscriptionPlan(
  user: AuthUser | null,
  requiredPlan: SubscriptionPlan
): boolean {
  if (!user) return false
  
  const planHierarchy: SubscriptionPlan[] = ['basic', 'elite', 'pro', 'admin']
  const userPlan = (user.user_metadata as any)?.subscription_plan || 'basic'
  const userPlanIndex = planHierarchy.indexOf(userPlan as SubscriptionPlan)
  const requiredPlanIndex = planHierarchy.indexOf(requiredPlan)
  
  return userPlanIndex >= requiredPlanIndex
}

/**
 * Get user's subscription plan
 */
export function getUserPlan(user: AuthUser | null): SubscriptionPlan {
  if (!user) return 'basic'
  return ((user.user_metadata as any)?.subscription_plan as SubscriptionPlan) || 'basic'
}

/**
 * Check if a route is admin-only
 */
export function isAdminRoute(pathname: string): boolean {
  const adminRoutes = [
    '/settings/admin',
    '/admin',
  ]
  return adminRoutes.some(route => pathname.startsWith(route))
}
