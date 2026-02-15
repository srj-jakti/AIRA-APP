import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * Middleware to check if user is admin
 */
const isAdmin = async (req: any, res: any, next: any) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionPlan: true }
    });

    if (!user || user.subscriptionPlan !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ error: 'Failed to verify admin status' });
  }
};

/**
 * Get admin dashboard analytics
 */
router.post('/admin/analytics', isAdmin, async (req, res) => {
  try {
    // Total users
    const totalUsers = await prisma.user.count();
    
    // Users by subscription plan
    const usersByPlan = await prisma.user.groupBy({
      by: ['subscriptionPlan'],
      _count: true
    });

    // Active users (logged in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: sevenDaysAgo
        }
      }
    });

    // Total trades
    const totalTrades = await prisma.trade.count();

    // Total strategies
    const totalStrategies = await prisma.strategy.count();

    // Strategies by visibility
    const strategiesByVisibility = await prisma.strategy.groupBy({
      by: ['visibility'],
      _count: true
    });

    // Revenue calculation (completed payments)
    const payments = await prisma.payment.findMany({
      where: { status: 'completed' },
      select: { amount: true, createdAt: true }
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Monthly revenue
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyRevenue = payments
      .filter(p => {
        const date = new Date(p.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, p) => sum + p.amount, 0);

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Active strategies
    const activeStrategies = await prisma.strategy.count({
      where: {
        // Add your active strategy criteria
      }
    });

    res.json({
      success: true,
      analytics: {
        totalUsers,
        activeUsers,
        newUsers,
        usersByPlan: usersByPlan.map(item => ({
          plan: item.subscriptionPlan,
          count: item._count
        })),
        totalTrades,
        totalStrategies,
        activeStrategies,
        strategiesByVisibility: strategiesByVisibility.map(item => ({
          visibility: item.visibility,
          count: item._count
        })),
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue
        }
      }
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

/**
 * Get all users with pagination
 */
router.post('/admin/users', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.body;
    
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { email: { contains: search, mode: 'insensitive' as any } },
        { name: { contains: search, mode: 'insensitive' as any } }
      ]
    } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          subscriptionPlan: true,
          subscriptionExpiresAt: true,
          createdAt: true,
          updatedAt: true,
          telegramConnected: true,
          whatsappConnected: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

/**
 * Get user details
 */
router.post('/admin/users/:userId', isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            strategies: true,
            trades: true,
            payments: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error getting user details:', error);
    res.status(500).json({ error: 'Failed to get user details' });
  }
});

/**
 * Update user subscription plan
 */
router.post('/admin/users/:userId/subscription', isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { plan, expiresAt } = req.body;

    if (!['basic', 'elite', 'pro', 'admin'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionPlan: plan,
        subscriptionExpiresAt: expiresAt ? new Date(expiresAt) : null
      }
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

/**
 * Delete user
 */
router.post('/admin/users/:userId/delete', isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete user and all related data (cascade)
    await prisma.user.delete({
      where: { id: userId }
    });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

/**
 * Get all strategies for moderation
 */
router.post('/admin/strategies', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, visibility = 'all' } = req.body;
    
    const skip = (page - 1) * limit;

    const where = visibility !== 'all' ? { visibility } : {};

    const [strategies, total] = await Promise.all([
      prisma.strategy.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.strategy.count({ where })
    ]);

    res.json({
      success: true,
      strategies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting strategies:', error);
    res.status(500).json({ error: 'Failed to get strategies' });
  }
});

/**
 * Update strategy visibility
 */
router.post('/admin/strategies/:strategyId/visibility', isAdmin, async (req, res) => {
  try {
    const { strategyId } = req.params;
    const { visibility } = req.body;

    if (!['private', 'public', 'invite-only'].includes(visibility)) {
      return res.status(400).json({ error: 'Invalid visibility' });
    }

    const strategy = await prisma.strategy.update({
      where: { id: strategyId },
      data: { visibility }
    });

    res.json({ success: true, strategy });
  } catch (error) {
    console.error('Error updating strategy visibility:', error);
    res.status(500).json({ error: 'Failed to update strategy visibility' });
  }
});

/**
 * Delete strategy
 */
router.post('/admin/strategies/:strategyId/delete', isAdmin, async (req, res) => {
  try {
    const { strategyId } = req.params;

    await prisma.strategy.delete({
      where: { id: strategyId }
    });

    res.json({ success: true, message: 'Strategy deleted successfully' });
  } catch (error) {
    console.error('Error deleting strategy:', error);
    res.status(500).json({ error: 'Failed to delete strategy' });
  }
});

/**
 * Get system health status
 */
router.post('/admin/health', isAdmin, async (req, res) => {
  try {
    // Check database
    const dbHealth = await prisma.$queryRaw`SELECT 1`;
    
    // Get service status (mock for now)
    const services = {
      database: {
        status: dbHealth ? 'healthy' : 'down',
        responseTime: 10,
        uptime: 99.9
      },
      backend: {
        status: 'healthy',
        responseTime: 5,
        uptime: 99.8
      },
      tradingEngine: {
        status: 'healthy',
        responseTime: 15,
        uptime: 99.7
      },
      zerodha: {
        status: 'healthy',
        responseTime: 50,
        uptime: 99.5
      },
      openai: {
        status: 'healthy',
        responseTime: 200,
        uptime: 99.9
      }
    };

    res.json({ success: true, services });
  } catch (error) {
    console.error('Error getting health status:', error);
    res.status(500).json({ error: 'Failed to get health status' });
  }
});

/**
 * Get all support tickets (admin)
 */
router.post('/admin/support/tickets', isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.body;
    
    const skip = (page - 1) * limit;

    const where = status !== 'all' ? { status } : {};

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.supportTicket.count({ where })
    ]);

    res.json({
      success: true,
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error getting support tickets:', error);
    res.status(500).json({ error: 'Failed to get support tickets' });
  }
});

/**
 * Get single ticket (admin)
 */
router.post('/admin/support/tickets/:ticketId', isAdmin, async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            subscriptionPlan: true
          }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error getting ticket:', error);
    res.status(500).json({ error: 'Failed to get ticket' });
  }
});

/**
 * Reply to ticket (admin)
 */
router.post('/admin/support/tickets/:ticketId/reply', isAdmin, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { userId, message, isInternal = false } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId }
    });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Add message to ticket
    const messages = Array.isArray(ticket.messages) ? ticket.messages : [];
    const newMessage = {
      id: Date.now().toString(),
      senderId: userId,
      senderType: 'admin',
      message,
      isInternal,
      createdAt: new Date().toISOString()
    };

    const updatedTicket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        messages: [...messages, newMessage],
        status: isInternal ? ticket.status : 'in_progress',
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    res.json({ success: true, ticket: updatedTicket });
  } catch (error) {
    console.error('Error replying to ticket:', error);
    res.status(500).json({ error: 'Failed to reply to ticket' });
  }
});

/**
 * Update ticket status (admin)
 */
router.post('/admin/support/tickets/:ticketId/status', isAdmin, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status,
        resolvedAt: status === 'resolved' || status === 'closed' ? new Date() : null
      }
    });

    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

/**
 * Assign ticket to admin
 */
router.post('/admin/support/tickets/:ticketId/assign', isAdmin, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { assignedTo } = req.body;

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { assignedTo }
    });

    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ error: 'Failed to assign ticket' });
  }
});

export const adminRouter = router;
