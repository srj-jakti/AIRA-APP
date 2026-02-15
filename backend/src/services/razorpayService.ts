import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  receipt: string;
}

interface SubscriptionPlan {
  id: string;
  name: 'basic' | 'elite' | 'pro';
  price: number;
  duration: number; // days
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { id: 'basic', name: 'basic', price: 99900, duration: 30 }, // ₹999 for 30 days
  { id: 'elite', name: 'elite', price: 299900, duration: 30 }, // ₹2,999 for 30 days
  { id: 'pro', name: 'pro', price: 999900, duration: 30 }, // ₹9,999 for 30 days
];

class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || ''
    });
  }

  /**
   * Get subscription plans
   */
  getSubscriptionPlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  }

  /**
   * Get plan by ID
   */
  getPlanById(planId: string): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
  }

  /**
   * Create payment order
   */
  async createOrder(
    userId: string,
    planId: string
  ): Promise<{ success: boolean; order?: PaymentOrder; error?: string }> {
    try {
      const plan = this.getPlanById(planId);
      
      if (!plan) {
        return { success: false, error: 'Invalid plan' };
      }

      // Create Razorpay order
      const options = {
        amount: plan.price, // amount in paise
        currency: 'INR',
        receipt: `receipt_${userId}_${Date.now()}`,
        notes: {
          userId,
          planId: plan.id,
          planName: plan.name
        }
      };

      const order = await this.razorpay.orders.create(options);

      // Store order in database
      await prisma.payment.create({
        data: {
          userId,
          orderId: order.id,
          amount: plan.price / 100, // convert to rupees
          currency: 'INR',
          status: 'created',
          planId: plan.id,
          planName: plan.name,
          receipt: `receipt_${Date.now()}`
        }
      });

      return {
        success: true,
        order: {
          orderId: order.id,
          amount: plan.price,
          currency: 'INR',
          receipt: order.receipt || options.receipt
        }
      };
    } catch (error: any) {
      console.error('Error creating order:', error);
      return {
        success: false,
        error: error.message || 'Failed to create order'
      };
    }
  }

  /**
   * Verify payment signature
   */
  verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
  ): boolean {
    try {
      const text = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(text)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  }

  /**
   * Handle successful payment
   */
  async handlePaymentSuccess(
    userId: string,
    orderId: string,
    paymentId: string,
    signature: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Verify signature
      if (!this.verifyPaymentSignature(orderId, paymentId, signature)) {
        return { success: false, message: 'Invalid payment signature' };
      }

      // Get payment details
      const payment = await prisma.payment.findUnique({
        where: { orderId }
      });

      if (!payment) {
        return { success: false, message: 'Payment not found' };
      }

      if (payment.status === 'completed') {
        return { success: false, message: 'Payment already processed' };
      }

      // Update payment status
      await prisma.payment.update({
        where: { orderId },
        data: {
          status: 'completed',
          paymentId,
          signature,
          completedAt: new Date()
        }
      });

      // Activate subscription
      const plan = this.getPlanById(payment.planId);
      if (!plan) {
        return { success: false, message: 'Invalid plan' };
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + plan.duration);

      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionPlan: plan.name,
          subscriptionExpiresAt: expiresAt
        }
      });

      // Send confirmation email (implement later)
      // await emailService.sendPaymentConfirmation(userId, payment);

      return {
        success: true,
        message: 'Subscription activated successfully'
      };
    } catch (error: any) {
      console.error('Error handling payment success:', error);
      return {
        success: false,
        message: error.message || 'Failed to process payment'
      };
    }
  }

  /**
   * Handle payment failure
   */
  async handlePaymentFailure(
    orderId: string,
    errorCode?: string,
    errorMessage?: string
  ): Promise<void> {
    try {
      await prisma.payment.update({
        where: { orderId },
        data: {
          status: 'failed',
          errorCode,
          errorMessage
        }
      });
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  /**
   * Get payment history for user
   */
  async getPaymentHistory(userId: string): Promise<any[]> {
    try {
      const payments = await prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });

      return payments;
    } catch (error) {
      console.error('Error getting payment history:', error);
      return [];
    }
  }

  /**
   * Process refund
   */
  async processRefund(
    paymentId: string,
    amount?: number
  ): Promise<{ success: boolean; message: string; refundId?: string }> {
    try {
      const payment = await prisma.payment.findFirst({
        where: { paymentId }
      });

      if (!payment) {
        return { success: false, message: 'Payment not found' };
      }

      if (payment.status !== 'completed') {
        return { success: false, message: 'Payment not completed' };
      }

      // Create refund via Razorpay
      const refundAmount = amount || payment.amount * 100; // convert to paise
      
      const refund = await this.razorpay.payments.refund(paymentId, {
        amount: refundAmount,
        notes: {
          reason: 'User requested refund'
        }
      });

      // Update payment status
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'refunded',
          refundId: refund.id,
          refundAmount: refundAmount / 100
        }
      });

      // Revoke subscription if full refund
      if (!amount || amount === payment.amount) {
        await prisma.user.update({
          where: { id: payment.userId },
          data: {
            subscriptionPlan: 'basic',
            subscriptionExpiresAt: null
          }
        });
      }

      return {
        success: true,
        message: 'Refund processed successfully',
        refundId: refund.id
      };
    } catch (error: any) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        message: error.message || 'Failed to process refund'
      };
    }
  }

  /**
   * Handle Razorpay webhook
   */
  async handleWebhook(
    signature: string,
    payload: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Verify webhook signature
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
        .update(JSON.stringify(payload))
        .digest('hex');

      if (signature !== expectedSignature) {
        return { success: false, message: 'Invalid webhook signature' };
      }

      const event = payload.event;
      const paymentEntity = payload.payload.payment.entity;

      switch (event) {
        case 'payment.captured':
          // Payment successful
          await this.handlePaymentSuccess(
            paymentEntity.notes.userId,
            paymentEntity.order_id,
            paymentEntity.id,
            '' // signature already verified
          );
          break;

        case 'payment.failed':
          // Payment failed
          await this.handlePaymentFailure(
            paymentEntity.order_id,
            paymentEntity.error_code,
            paymentEntity.error_description
          );
          break;

        case 'refund.created':
          // Refund initiated
          console.log('Refund created:', paymentEntity);
          break;

        default:
          console.log('Unhandled webhook event:', event);
      }

      return { success: true, message: 'Webhook processed' };
    } catch (error: any) {
      console.error('Error handling webhook:', error);
      return {
        success: false,
        message: error.message || 'Failed to process webhook'
      };
    }
  }

  /**
   * Check if subscription is active
   */
  async isSubscriptionActive(userId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          subscriptionPlan: true,
          subscriptionExpiresAt: true
        }
      });

      if (!user) {
        return false;
      }

      if (user.subscriptionPlan === 'basic') {
        return true; // Basic plan never expires
      }

      if (!user.subscriptionExpiresAt) {
        return false;
      }

      return new Date() < user.subscriptionExpiresAt;
    } catch (error) {
      console.error('Error checking subscription:', error);
      return false;
    }
  }

  /**
   * Get subscription details
   */
  async getSubscriptionDetails(userId: string): Promise<any> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          subscriptionPlan: true,
          subscriptionExpiresAt: true
        }
      });

      if (!user) {
        return null;
      }

      const plan = SUBSCRIPTION_PLANS.find(p => p.name === user.subscriptionPlan);
      const isActive = await this.isSubscriptionActive(userId);

      return {
        plan: user.subscriptionPlan,
        planDetails: plan,
        expiresAt: user.subscriptionExpiresAt,
        isActive,
        daysRemaining: user.subscriptionExpiresAt
          ? Math.ceil((user.subscriptionExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : null
      };
    } catch (error) {
      console.error('Error getting subscription details:', error);
      return null;
    }
  }
}

export const razorpayService = new RazorpayService();
