import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Start scanner
 */
router.post('/scanner/start', async (req: Request, res: Response) => {
  try {
    // Scanner is controlled via WebSocket
    // This endpoint is for REST API compatibility
    res.json({
      success: true,
      message: 'Scanner start command sent. Use WebSocket for real-time updates.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Stop scanner
 */
router.post('/scanner/stop', async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      message: 'Scanner stop command sent.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get scanner status
 */
router.get('/scanner/status', async (req: Request, res: Response) => {
  try {
    // Status is available via WebSocket
    res.json({
      success: true,
      message: 'Use WebSocket connection for real-time scanner status.',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as scannerRouter };
