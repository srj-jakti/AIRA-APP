import { Router } from 'express';
import { razorpayService } from '../services/razorpayService';

const router = Router();

/**
 * Get subscription plans
 */
router.get('/razorpay/plans', (req, res) => {
  try {
    const plans = razorpayService.getSubscriptionPlans();
    res.json({ success: true, plans });
  } catch (error) {
    console.error('Error getting plans:', error);
    res.status(500).json({ error: 'Failed to get plans' });
  }
});

/**
 * Create payment order
 */
router.post('/razorpay/create-order', async (req, res) => {
  try {
    const { userId, planId } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({ error: 'User ID and plan ID are required' });
    }

    const result = await razorpayService.createOrder(userId, planId);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

/**
 * Verify payment
 */
router.post('/razorpay/verify-payment', async (req, res) => {
  try {
    const { userId, orderId, paymentId, signature } = req.body;

    if (!userId || !orderId || !paymentId || !signature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await razorpayService.handlePaymentSuccess(
      userId,
      orderId,
      paymentId,
      signature
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

/**
 * Get payment history
 */
router.get('/razorpay/payment-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await razorpayService.getPaymentHistory(userId);
    res.json({ success: true, payments });
  } catch (error) {
    console.error('Error getting payment history:', error);
    res.status(500).json({ error: 'Failed to get payment history' });
  }
});

/**
 * Get subscription details
 */
router.get('/razorpay/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const subscription = await razorpayService.getSubscriptionDetails(userId);
    
    if (subscription) {
      res.json({ success: true, subscription });
    } else {
      res.status(404).json({ error: 'Subscription not found' });
    }
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

/**
 * Request refund
 */
router.post('/razorpay/refund', async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    const result = await razorpayService.processRefund(paymentId, amount);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
});

/**
 * Razorpay webhook endpoint
 */
router.post('/razorpay/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const payload = req.body;

    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    const result = await razorpayService.handleWebhook(signature, payload);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Failed to handle webhook' });
  }
});

export const razorpayRouter = router;
