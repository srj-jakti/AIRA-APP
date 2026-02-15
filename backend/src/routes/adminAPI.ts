import { Router, Request, Response } from 'express';
import { AdminDataAPIManager } from '../services/adminDataAPI';
import { requireAdmin } from '../middleware/auth';

const router = Router();
const adminAPIManager = new AdminDataAPIManager(process.env.ENCRYPTION_KEY || 'default-key');

// Initialize Admin APIs on startup
adminAPIManager.loadAllAPIs().catch(console.error);

/**
 * Get all Admin Data APIs
 */
router.get('/admin-apis', requireAdmin, async (req: Request, res: Response) => {
  try {
    const apis = await adminAPIManager.getAllAdminAPIs();
    res.json({ success: true, data: apis });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Add new Admin Data API
 */
router.post('/admin-apis', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { apiKey, apiSecret, totpSecret, userId, password } = req.body;

    if (!apiKey || !apiSecret || !totpSecret || !userId || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    const id = await adminAPIManager.addAdminAPI({
      apiKey,
      apiSecret,
      totpSecret,
      userId,
      password,
    });

    res.json({ success: true, data: { id } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update Admin Data API
 */
router.put('/admin-apis/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    await adminAPIManager.updateAdminAPI(id, updates);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Delete Admin Data API
 */
router.delete('/admin-apis/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await adminAPIManager.deleteAdminAPI(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Test Admin Data API connection
 */
router.post('/admin-apis/:id/test', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const isConnected = await adminAPIManager.testConnection(id);
    res.json({ success: true, connected: isConnected });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Get Admin API statistics
 */
router.get('/admin-apis/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    const totalClients = adminAPIManager.getClientCount();
    const activeClients = adminAPIManager.getActiveClientCount();
    
    res.json({ 
      success: true, 
      data: {
        total: totalClients,
        active: activeClients,
        inactive: totalClients - activeClients,
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as adminAPIRouter, adminAPIManager };
