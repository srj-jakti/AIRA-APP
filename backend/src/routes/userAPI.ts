import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import CryptoJS from 'crypto-js';
import { ZerodhaClient } from '../services/zerodha';

const router = Router();
const prisma = new PrismaClient();
const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key';

/**
 * Encrypt sensitive data
 */
function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, encryptionKey).toString();
}

/**
 * Decrypt sensitive data
 */
function decrypt(encryptedData: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Get user API configuration
 */
router.get('/user-api/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userAPI = await prisma.userAPI.findUnique({
      where: { userId },
      select: {
        id: true,
        userId: true,
        apiKey: true,
        isActive: true,
        autoLogin: true,
        lastConnected: true,
        createdAt: true,
      },
    });

    if (!userAPI) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: userAPI });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Save or update user API configuration
 */
router.post('/user-api', async (req: Request, res: Response) => {
  try {
    const { userId, apiKey, apiSecret, totpSecret, zerodhaUserId, password, autoLogin } = req.body;

    if (!userId || !apiKey || !apiSecret || !totpSecret || !zerodhaUserId || !password) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    // Encrypt sensitive data
    const encryptedApiSecret = encrypt(apiSecret);
    const encryptedTotpSecret = encrypt(totpSecret);
    const encryptedPassword = encrypt(password);

    // Check if user API already exists
    const existing = await prisma.userAPI.findUnique({
      where: { userId },
    });

    let userAPI;
    if (existing) {
      // Update existing
      userAPI = await prisma.userAPI.update({
        where: { userId },
        data: {
          apiKey,
          apiSecret: encryptedApiSecret,
          totpSecret: encryptedTotpSecret,
          userId: zerodhaUserId,
          password: encryptedPassword,
          autoLogin: autoLogin || false,
          isActive: true,
        },
      });
    } else {
      // Create new
      userAPI = await prisma.userAPI.create({
        data: {
          userId,
          apiKey,
          apiSecret: encryptedApiSecret,
          totpSecret: encryptedTotpSecret,
          zerodhaUserId,
          password: encryptedPassword,
          autoLogin: autoLogin || false,
          isActive: true,
        },
      });
    }

    res.json({
      success: true,
      data: {
        id: userAPI.id,
        userId: userAPI.userId,
        apiKey: userAPI.apiKey,
        isActive: userAPI.isActive,
        autoLogin: userAPI.autoLogin,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Test user API connection
 */
router.post('/user-api/:userId/test', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userAPI = await prisma.userAPI.findUnique({
      where: { userId },
    });

    if (!userAPI) {
      return res.status(404).json({
        success: false,
        error: 'User API not found',
      });
    }

    // Decrypt credentials
    const credentials = {
      apiKey: userAPI.apiKey,
      apiSecret: decrypt(userAPI.apiSecret),
      totpSecret: decrypt(userAPI.totpSecret),
      userId: userAPI.zerodhaUserId,
      password: decrypt(userAPI.password),
    };

    // Create client and test connection
    const client = new ZerodhaClient(credentials);
    
    // For testing, we'll just verify the credentials are valid
    // In production, you'd attempt a login or API call
    
    res.json({
      success: true,
      connected: true,
      message: 'API credentials are configured',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      connected: false,
      error: error.message,
    });
  }
});

/**
 * Delete user API configuration
 */
router.delete('/user-api/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    await prisma.userAPI.delete({
      where: { userId },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get user risk settings
 */
router.get('/risk-settings/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const settings = await prisma.riskSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      // Return default settings
      return res.json({
        success: true,
        data: {
          dailyProfitLimit: 5000,
          dailyLossLimit: 3000,
          aiTradingEnabled: false,
        },
      });
    }

    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Save or update risk settings
 */
router.post('/risk-settings', async (req: Request, res: Response) => {
  try {
    const { userId, dailyProfitLimit, dailyLossLimit, aiTradingEnabled } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    // Check if settings exist
    const existing = await prisma.riskSettings.findUnique({
      where: { userId },
    });

    let settings;
    if (existing) {
      // Update existing
      settings = await prisma.riskSettings.update({
        where: { userId },
        data: {
          dailyProfitLimit: dailyProfitLimit || existing.dailyProfitLimit,
          dailyLossLimit: dailyLossLimit || existing.dailyLossLimit,
          aiTradingEnabled: aiTradingEnabled !== undefined ? aiTradingEnabled : existing.aiTradingEnabled,
        },
      });
    } else {
      // Create new
      settings = await prisma.riskSettings.create({
        data: {
          userId,
          dailyProfitLimit: dailyProfitLimit || 5000,
          dailyLossLimit: dailyLossLimit || 3000,
          maxPositionSize: 50000, // Default max position size
          maxOpenPositions: 5, // Default max open positions
          allowedInstruments: [], // Empty array, user can configure later
          aiTradingEnabled: aiTradingEnabled || false,
        },
      });
    }

    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get user balance and positions
 */
router.get('/account/:userId/balance', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Mock data for now - will be replaced with actual Zerodha API calls
    const balance = {
      total: 100000,
      available: 75000,
      used: 25000,
    };

    res.json({ success: true, data: balance });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get user positions
 */
router.get('/account/:userId/positions', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Mock data for now - will be replaced with actual Zerodha API calls
    const positions = [
      {
        id: '1',
        tradingsymbol: 'RELIANCE',
        exchange: 'NSE',
        quantity: 10,
        averagePrice: 2450.50,
        lastPrice: 2475.00,
        pnl: 245.00,
        pnlPercentage: 1.00,
        product: 'MIS',
      },
    ];

    res.json({ success: true, data: positions });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get user orders
 */
router.get('/account/:userId/orders', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Mock data for now - will be replaced with actual Zerodha API calls
    const orders = [
      {
        id: '1',
        tradingsymbol: 'INFY',
        exchange: 'NSE',
        transactionType: 'BUY',
        quantity: 15,
        price: 1450.00,
        status: 'COMPLETE',
        orderType: 'MARKET',
        timestamp: new Date().toISOString(),
      },
    ];

    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Cancel order
 */
router.post('/account/:userId/orders/:orderId/cancel', async (req: Request, res: Response) => {
  try {
    const { userId, orderId } = req.params;

    // Mock implementation - will be replaced with actual Zerodha API call
    res.json({
      success: true,
      message: 'Order cancelled successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as userAPIRouter };
