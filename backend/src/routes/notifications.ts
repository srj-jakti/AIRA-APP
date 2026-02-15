import { Router, Request, Response } from 'express';
import { notificationService } from '../services/notificationService';

const router = Router();

/**
 * Get user notification preferences
 */
router.get('/notifications/preferences/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const preferences = await notificationService.getPreferences(userId);
    
    res.json({
      success: true,
      data: preferences,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Update user notification preferences
 */
router.put('/notifications/preferences/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const preferences = req.body;
    
    await notificationService.updatePreferences(userId, preferences);
    
    res.json({
      success: true,
      message: 'Preferences updated successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Send test notification
 */
router.post('/notifications/test/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    await notificationService.sendNotification({
      userId,
      type: 'systemAlert',
      title: 'Test Notification',
      message: 'This is a test notification from AIRA. If you received this, your notifications are working!',
    });
    
    res.json({
      success: true,
      message: 'Test notification sent',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as notificationsRouter };
