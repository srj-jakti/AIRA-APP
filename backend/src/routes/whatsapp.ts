import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { whatsappService } from '../services/whatsappService';

const router = Router();
const prisma = new PrismaClient();

/**
 * Send OTP to phone number for verification
 */
router.post('/whatsapp/send-otp', async (req, res) => {
  try {
    const { userId, phoneNumber } = req.body;

    if (!userId || !phoneNumber) {
      return res.status(400).json({ error: 'User ID and phone number are required' });
    }

    // Validate phone number format (should start with country code)
    if (!phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    const result = await whatsappService.sendOTP(phoneNumber);

    res.json(result);
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

/**
 * Verify OTP and connect WhatsApp
 */
router.post('/whatsapp/verify-otp', async (req, res) => {
  try {
    const { userId, phoneNumber, otp } = req.body;

    if (!userId || !phoneNumber || !otp) {
      return res.status(400).json({ error: 'User ID, phone number, and OTP are required' });
    }

    const result = await whatsappService.verifyOTP(phoneNumber, otp);

    if (result.success) {
      // Update user's WhatsApp connection status
      await prisma.user.update({
        where: { id: userId },
        data: {
          whatsappNumber: phoneNumber,
          whatsappConnected: true
        }
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

/**
 * Get WhatsApp connection status
 */
router.get('/whatsapp/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        whatsappNumber: true,
        whatsappConnected: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      connected: user.whatsappConnected,
      phoneNumber: user.whatsappNumber
    });
  } catch (error) {
    console.error('Error getting WhatsApp status:', error);
    res.status(500).json({ error: 'Failed to get WhatsApp status' });
  }
});

/**
 * Disconnect WhatsApp
 */
router.post('/whatsapp/disconnect', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        whatsappNumber: null,
        whatsappConnected: false
      }
    });

    res.json({ success: true, message: 'WhatsApp disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting WhatsApp:', error);
    res.status(500).json({ error: 'Failed to disconnect WhatsApp' });
  }
});

/**
 * Test WhatsApp notification
 */
router.post('/whatsapp/test-notification', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        whatsappNumber: true,
        whatsappConnected: true,
        language: true
      }
    });

    if (!user || !user.whatsappConnected || !user.whatsappNumber) {
      return res.status(400).json({ error: 'WhatsApp not connected' });
    }

    const testMessage = user.language === 'hi'
      ? '🤖 AIRA टेस्ट संदेश\n\nयह एक परीक्षण संदेश है। आपका WhatsApp सफलतापूर्वक कनेक्ट हो गया है!\n\n⚠️ AIRA एक सॉफ्टवेयर टूल है, SEBI पंजीकृत सलाहकार नहीं।'
      : '🤖 AIRA Test Message\n\nThis is a test message. Your WhatsApp is successfully connected!\n\n⚠️ AIRA is a software tool, not a SEBI registered advisor.';

    const success = await whatsappService.sendMessage({
      to: user.whatsappNumber,
      message: testMessage
    });

    if (success) {
      res.json({ success: true, message: 'Test notification sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send test notification' });
    }
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

/**
 * Update WhatsApp notification preferences
 */
router.post('/whatsapp/preferences', async (req, res) => {
  try {
    const { userId, preferences } = req.body;

    if (!userId || !preferences) {
      return res.status(400).json({ error: 'User ID and preferences are required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { notificationPreferences: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentPrefs = user.notificationPreferences as any || {};
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        notificationPreferences: {
          ...currentPrefs,
          whatsapp: preferences
        }
      }
    });

    res.json({ success: true, message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

export const whatsappRouter = router;
