/**
 * Telegram Routes
 * API endpoints for Telegram integration
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { telegramBotService } from '../services/telegramBot';

const router = Router();
const prisma = new PrismaClient();

/**
 * Get Telegram connection status
 */
router.get('/telegram/status/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        telegramConnected: true,
        telegramChatId: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: {
        connected: user.telegramConnected,
        chatId: user.telegramChatId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Generate connection code
 */
router.post('/telegram/generate-code', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Generate connection code
    const code = telegramBotService.generateConnectionCode(userId);

    res.json({
      success: true,
      data: {
        code,
        expiresIn: 600, // 10 minutes in seconds
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Disconnect Telegram
 */
router.post('/telegram/disconnect', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    await telegramBotService.disconnectUser(userId);

    res.json({
      success: true,
      message: 'Telegram disconnected successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Send test notification
 */
router.post('/telegram/test-notification', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    // Send test trade notification
    const testTrade = {
      action: 'buy',
      quantity: 10,
      instrument: 'RELIANCE',
      entryPrice: 2500,
      status: 'open',
      mode: 'paper',
      strategy: { name: 'Test Strategy' },
    };

    await telegramBotService.sendTradeNotification(userId, testTrade);

    res.json({
      success: true,
      message: 'Test notification sent',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as telegramRouter };
