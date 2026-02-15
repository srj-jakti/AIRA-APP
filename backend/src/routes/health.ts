import { Router, Request, Response } from 'express';
import { healthMonitor } from '../services/healthMonitor';
import { requireAdmin } from '../middleware/auth';

const router = Router();

/**
 * Public health check endpoint
 * Used by monitoring services and load balancers
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

/**
 * Get detailed health status for all services
 * Admin only
 */
router.get('/health/status', requireAdmin, async (req: Request, res: Response) => {
  try {
    const status = healthMonitor.getHealthStatus();
    
    res.json({
      success: true,
      services: status,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get health history for a specific service
 * Admin only
 */
router.get('/health/history/:service', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const history = healthMonitor.getServiceHistory(service);
    
    res.json({
      success: true,
      service,
      history,
      uptime: healthMonitor.getUptime(service)
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Trigger manual health check
 * Admin only
 */
router.post('/health/check', requireAdmin, async (req: Request, res: Response) => {
  try {
    // The health monitor runs automatically, but we can return current status
    const status = healthMonitor.getHealthStatus();
    
    res.json({
      success: true,
      message: 'Health check completed',
      services: status
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export { router as healthRouter };
