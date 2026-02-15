import { Router, Request, Response } from 'express';
import { tradingEngine } from '../services/tradingEngine';

const router = Router();

/**
 * Start trading engine manually
 */
router.post('/trading/start', async (req: Request, res: Response) => {
  try {
    await tradingEngine.start();
    res.json({
      success: true,
      message: 'Trading engine started',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Stop trading engine manually
 */
router.post('/trading/stop', async (req: Request, res: Response) => {
  try {
    tradingEngine.stop();
    res.json({
      success: true,
      message: 'Trading engine stopped',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get trading engine status
 */
router.get('/trading/status', async (req: Request, res: Response) => {
  try {
    const status = tradingEngine.getStatus();
    res.json({
      success: true,
      data: status,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as tradingRouter };
