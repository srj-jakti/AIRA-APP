import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { BacktestEngine } from '../services/backtestEngine';
import { ZerodhaClient } from '../services/zerodha';

const router = Router();
const prisma = new PrismaClient();

/**
 * Run backtest for a strategy
 */
router.post('/backtest', async (req: Request, res: Response) => {
  try {
    const {
      strategyId,
      instrument,
      startDate,
      endDate,
      initialCapital = 100000,
    } = req.body;

    if (!strategyId || !instrument || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Strategy ID, instrument, start date, and end date are required',
      });
    }

    // Fetch strategy
    const strategy = await prisma.strategy.findUnique({
      where: { id: strategyId },
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found',
      });
    }

    // Initialize Zerodha client (would use admin API key)
    const zerodhaClient = new ZerodhaClient({
      apiKey: process.env.ZERODHA_API_KEY || '',
      apiSecret: process.env.ZERODHA_API_SECRET || '',
      totpSecret: process.env.ZERODHA_TOTP_SECRET || '',
      userId: process.env.ZERODHA_USER_ID || '',
      password: process.env.ZERODHA_PASSWORD || '',
    });

    // Initialize backtest engine
    const backtestEngine = new BacktestEngine(zerodhaClient);

    // Run backtest
    const results = await backtestEngine.runBacktest({
      strategyId,
      instrument,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      initialCapital,
      entryConditions: strategy.entryConditions,
      exitConditions: strategy.exitConditions,
      stopLoss: strategy.stopLoss,
      target: strategy.target,
      trailingStopLoss: strategy.trailingStopLoss,
      trailingTarget: strategy.trailingTarget,
    });

    // Store backtest results in strategy
    await prisma.strategy.update({
      where: { id: strategyId },
      data: {
        backtestResults: results as any,
      },
    });

    res.json({
      success: true,
      data: results,
    });
  } catch (error: any) {
    console.error('Error running backtest:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to run backtest',
    });
  }
});

/**
 * Get backtest results for a strategy
 */
router.get('/backtest/:strategyId', async (req: Request, res: Response) => {
  try {
    const { strategyId } = req.params;

    const strategy = await prisma.strategy.findUnique({
      where: { id: strategyId },
      select: {
        id: true,
        name: true,
        backtestResults: true,
      },
    });

    if (!strategy) {
      return res.status(404).json({
        success: false,
        error: 'Strategy not found',
      });
    }

    if (!strategy.backtestResults) {
      return res.status(404).json({
        success: false,
        error: 'No backtest results available for this strategy',
      });
    }

    res.json({
      success: true,
      data: strategy.backtestResults,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export { router as backtestRouter };
