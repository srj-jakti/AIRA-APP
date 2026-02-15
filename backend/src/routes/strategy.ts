import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateStrategyFromDescription, validateStrategyStructure } from '../services/aiStrategyGenerator';

const router = Router();
const prisma = new PrismaClient();

/**
 * Get all strategies for a user
 */
router.get('/strategies/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { visibility } = req.query;

    const where: any = { userId };
    if (visibility) {
      where.visibility = visibility;
    }

    const strategies = await prisma.strategy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: strategies });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get active strategies for a user
 */
router.get('/strategies/user/:userId/active', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const strategies = await prisma.strategy.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: strategies });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get public strategies (marketplace)
 */
router.get('/strategies/public', async (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    const where: any = { visibility: 'PUBLIC' };
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    const strategies = await prisma.strategy.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ success: true, data: strategies });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get strategy by ID
 */
router.get('/strategies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const strategy = await prisma.strategy.findUnique({
      where: { id },
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found',
      });
    }

    res.json({ success: true, data: strategy });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Generate strategy from natural language description using AI
 */
router.post('/strategies/generate', async (req: Request, res: Response) => {
  try {
    const { description, category, userId } = req.body;

    if (!description || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Description and user ID are required',
      });
    }

    // Generate strategy using OpenAI
    const generatedStrategy = await generateStrategyFromDescription({
      description,
      category,
      userId,
    });

    // Validate structure
    if (!validateStrategyStructure(generatedStrategy)) {
      return res.status(500).json({
        success: false,
        error: 'Generated strategy has invalid structure',
      });
    }

    res.json({
      success: true,
      data: generatedStrategy,
      message: 'Strategy generated successfully. Review and save to create.',
    });
  } catch (error: any) {
    console.error('Error in AI strategy generation:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate strategy',
    });
  }
});

/**
 * Create new strategy
 */
router.post('/strategies', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      name,
      description,
      category,
      visibility,
      entryConditions,
      exitConditions,
      stopLoss,
      target,
      trailingStopLoss,
      trailingTarget,
      autoBacktest = true,
    } = req.body;

    if (!userId || !name || !category) {
      return res.status(400).json({
        success: false,
        error: 'User ID, name, and category are required',
      });
    }

    const strategy = await prisma.strategy.create({
      data: {
        userId,
        name,
        description: description || '',
        category,
        visibility: visibility || 'PRIVATE',
        entryConditions: entryConditions || {},
        exitConditions: exitConditions || {},
        stopLoss: stopLoss || {},
        target: target || {},
        trailingStopLoss: trailingStopLoss || {},
        trailingTarget: trailingTarget || {},
        isActive: false,
      },
    });

    // Trigger automatic backtest if requested
    if (autoBacktest) {
      // Run backtest asynchronously (don't wait for completion)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1); // 1 year backtest

      // This would be done via a job queue in production
      setTimeout(async () => {
        try {
          const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/v1/backtest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              strategyId: strategy.id,
              instrument: 'NIFTY', // Default instrument
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              initialCapital: 100000,
            }),
          });
          console.log('Backtest triggered for strategy:', strategy.id);
        } catch (error) {
          console.error('Failed to trigger backtest:', error);
        }
      }, 1000);
    }

    res.json({ 
      success: true, 
      data: strategy,
      message: autoBacktest ? 'Strategy created. Backtest running in background.' : 'Strategy created successfully.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update strategy
 */
router.put('/strategies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.userId;
    delete updateData.createdAt;

    const strategy = await prisma.strategy.update({
      where: { id },
      data: updateData,
    });

    res.json({ success: true, data: strategy });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Activate/Deactivate strategy
 */
router.post('/strategies/:id/toggle', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const strategy = await prisma.strategy.update({
      where: { id },
      data: { isActive },
    });

    res.json({ success: true, data: strategy });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Delete strategy
 */
router.delete('/strategies/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.strategy.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get strategy performance
 */
router.get('/strategies/:id/performance', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Mock performance data - will be replaced with actual calculations
    const performance = {
      totalTrades: 24,
      winRate: 62.5,
      profitFactor: 1.8,
      totalPnL: 2450,
      averagePnL: 102,
      maxDrawdown: 450,
      sharpeRatio: 1.5,
    };

    res.json({ success: true, data: performance });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Share strategy (invite-only)
 */
router.post('/strategies/:id/share', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userIds, grantedBy } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({
        success: false,
        error: 'User IDs array is required',
      });
    }

    if (!grantedBy) {
      return res.status(400).json({
        success: false,
        error: 'Granter user ID is required',
      });
    }

    // Verify strategy exists and is invite-only
    const strategy = await prisma.strategy.findUnique({
      where: { id },
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found',
      });
    }

    if (strategy.visibility !== 'INVITE_ONLY') {
      return res.status(400).json({
        success: false,
        error: 'Strategy must be invite-only to share',
      });
    }

    // Verify granter is the owner
    if (strategy.userId !== grantedBy) {
      return res.status(403).json({
        success: false,
        error: 'Only strategy owner can share',
      });
    }

    // Create share records
    const shares = await Promise.all(
      userIds.map((userId: string) =>
        prisma.strategyShare.upsert({
          where: {
            strategyId_userId: {
              strategyId: id,
              userId,
            },
          },
          create: {
            strategyId: id,
            userId,
            grantedBy,
          },
          update: {
            revokedAt: null, // Re-grant if previously revoked
          },
        })
      )
    );

    res.json({
      success: true,
      message: `Strategy shared with ${shares.length} users`,
      data: shares,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Revoke strategy access
 */
router.post('/strategies/:id/revoke', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, revokedBy } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    if (!revokedBy) {
      return res.status(400).json({
        success: false,
        error: 'Revoker user ID is required',
      });
    }

    // Verify strategy exists
    const strategy = await prisma.strategy.findUnique({
      where: { id },
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found',
      });
    }

    // Verify revoker is the owner
    if (strategy.userId !== revokedBy) {
      return res.status(403).json({
        success: false,
        error: 'Only strategy owner can revoke access',
      });
    }

    // Update share record to mark as revoked
    await prisma.strategyShare.updateMany({
      where: {
        strategyId: id,
        userId,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: 'Strategy access revoked',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get users with access to strategy
 */
router.get('/strategies/:id/shared-with', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const shares = await prisma.strategyShare.findMany({
      where: {
        strategyId: id,
        revokedAt: null,
      },
      select: {
        userId: true,
        grantedAt: true,
      },
    });

    res.json({ success: true, data: shares });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Check if user has access to strategy
 */
router.get('/strategies/:id/access/:userId', async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;

    const strategy = await prisma.strategy.findUnique({
      where: { id },
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found',
      });
    }

    // Owner always has access
    if (strategy.userId === userId) {
      return res.json({ success: true, hasAccess: true, reason: 'owner' });
    }

    // Public strategies are accessible to all
    if (strategy.visibility === 'PUBLIC') {
      return res.json({ success: true, hasAccess: true, reason: 'public' });
    }

    // Private strategies only accessible to owner
    if (strategy.visibility === 'PRIVATE') {
      return res.json({ success: true, hasAccess: false, reason: 'private' });
    }

    // Invite-only: check if user has been granted access
    if (strategy.visibility === 'INVITE_ONLY') {
      const share = await prisma.strategyShare.findFirst({
        where: {
          strategyId: id,
          userId,
          revokedAt: null,
        },
      });

      return res.json({
        success: true,
        hasAccess: !!share,
        reason: share ? 'invited' : 'not_invited',
      });
    }

    res.json({ success: true, hasAccess: false, reason: 'unknown' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as strategyRouter };
