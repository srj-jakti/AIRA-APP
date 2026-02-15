/**
 * AI Strategy Routes
 * API endpoints for AI-generated strategies
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { aiStrategyScheduler } from '../services/aiStrategyScheduler';

const router = Router();
const prisma = new PrismaClient();

/**
 * Get all AI-generated strategies
 */
router.get('/ai-strategies', async (req: Request, res: Response) => {
  try {
    const strategies = await prisma.strategy.findMany({
      where: {
        userId: 'ai-generator',
        visibility: 'PUBLIC',
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ success: true, data: strategies });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Manually trigger pattern analysis (admin only)
 */
router.post('/ai-strategies/analyze', async (req: Request, res: Response) => {
  try {
    // In production, add admin authentication check here

    await aiStrategyScheduler.triggerPatternAnalysis();

    res.json({
      success: true,
      message: 'Pattern analysis triggered successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Manually trigger strategy generation (admin only)
 */
router.post('/ai-strategies/generate', async (req: Request, res: Response) => {
  try {
    // In production, add admin authentication check here

    const { count = 5 } = req.body;

    await aiStrategyScheduler.triggerStrategyGeneration(count);

    res.json({
      success: true,
      message: `Strategy generation triggered for ${count} strategies`,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Manually trigger performance monitoring (admin only)
 */
router.post('/ai-strategies/monitor', async (req: Request, res: Response) => {
  try {
    // In production, add admin authentication check here

    await aiStrategyScheduler.triggerPerformanceMonitoring();

    res.json({
      success: true,
      message: 'Performance monitoring triggered successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get AI strategy statistics
 */
router.get('/ai-strategies/stats', async (req: Request, res: Response) => {
  try {
    const totalStrategies = await prisma.strategy.count({
      where: {
        userId: 'ai-generator',
        visibility: 'PUBLIC',
      },
    });

    const activeStrategies = await prisma.strategy.count({
      where: {
        userId: 'ai-generator',
        visibility: 'PUBLIC',
        isActive: true,
      },
    });

    // Get strategies with trades
    const strategiesWithTrades = await prisma.strategy.findMany({
      where: {
        userId: 'ai-generator',
        visibility: 'PUBLIC',
      },
      include: {
        trades: {
          where: {
            status: 'closed',
            mode: 'live',
          },
        },
      },
    });

    let totalTrades = 0;
    let totalPnL = 0;
    let winningTrades = 0;

    strategiesWithTrades.forEach((strategy: any) => {
      strategy.trades.forEach((trade: any) => {
        totalTrades++;
        totalPnL += trade.profitLoss || 0;
        if (trade.profitLoss && trade.profitLoss > 0) {
          winningTrades++;
        }
      });
    });

    const avgWinRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalStrategies,
        activeStrategies,
        totalTrades,
        totalPnL,
        avgWinRate: avgWinRate.toFixed(2),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as aiStrategyRouter };
