import { Request, Response, NextFunction } from 'express'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    subscription_plan: string
  }
}

/**
 * Middleware to verify user authentication
 */
export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      })
    }

    const token = authHeader.substring(7)

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({
        error: 'Invalid or expired token',
        code: 'AUTH_INVALID',
      })
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email!,
      subscription_plan: user.user_metadata?.subscription_plan || 'basic',
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({
      error: 'Authentication error',
      code: 'AUTH_ERROR',
    })
  }
}

/**
 * Middleware to verify admin access
 */
export async function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // First check authentication
  await requireAuth(req, res, () => {
    // Check if user has admin subscription
    if (req.user?.subscription_plan !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required',
        code: 'ADMIN_REQUIRED',
      })
    }

    next()
  })
}

/**
 * Middleware to verify subscription plan
 */
export function requireSubscription(requiredPlan: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    await requireAuth(req, res, () => {
      const planHierarchy = ['basic', 'elite', 'pro', 'admin']
      const userPlanIndex = planHierarchy.indexOf(req.user?.subscription_plan || 'basic')
      const requiredPlanIndex = planHierarchy.indexOf(requiredPlan)

      if (userPlanIndex < requiredPlanIndex) {
        return res.status(403).json({
          error: `${requiredPlan} subscription required`,
          code: 'SUBSCRIPTION_REQUIRED',
          required_plan: requiredPlan,
          current_plan: req.user?.subscription_plan,
        })
      }

      next()
    })
  }
}
