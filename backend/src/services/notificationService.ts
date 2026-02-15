import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { telegramBotService } from './telegramBot';
import { whatsappService } from './whatsappService';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

interface Notification {
  userId: string;
  type: 'trade' | 'dailySummary' | 'limit' | 'systemAlert' | 'marketing';
  title: string;
  message: string;
  data?: any;
}

interface NotificationPreferences {
  email: {
    trades: boolean;
    dailySummary: boolean;
    limits: boolean;
    systemAlerts: boolean;
    marketing: boolean;
  };
  push: {
    trades: boolean;
    dailySummary: boolean;
    limits: boolean;
    systemAlerts: boolean;
    marketing: boolean;
  };
  telegram: {
    trades: boolean;
    dailySummary: boolean;
    limits: boolean;
    systemAlerts: boolean;
    marketing: boolean;
  };
  whatsapp: {
    trades: boolean;
    dailySummary: boolean;
    limits: boolean;
    systemAlerts: boolean;
    marketing: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
  };
}

export class NotificationService {
  /**
   * Send notification to user via all enabled channels
   */
  async sendNotification(notification: Notification): Promise<void> {
    try {
      // Get user preferences
      const preferences = await this.getPreferences(notification.userId);
      
      // Check quiet hours
      if (this.isQuietHours(preferences.quietHours)) {
        console.log(`Skipping notification for user ${notification.userId} - quiet hours`);
        return;
      }

      // Send to enabled channels
      const promises: Promise<void>[] = [];

      if (this.shouldSend(preferences.email, notification.type)) {
        promises.push(this.sendEmail(notification));
      }

      if (this.shouldSend(preferences.push, notification.type)) {
        promises.push(this.sendPush(notification));
      }

      if (this.shouldSend(preferences.telegram, notification.type)) {
        promises.push(this.sendTelegram(notification));
      }

      if (this.shouldSend(preferences.whatsapp, notification.type)) {
        promises.push(this.sendWhatsApp(notification));
      }

      // Send all notifications in parallel
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  /**
   * Check if notification should be sent based on preferences
   */
  private shouldSend(channelPrefs: any, type: string): boolean {
    return channelPrefs[type] === true;
  }

  /**
   * Check if current time is within quiet hours
   */
  private isQuietHours(quietHours: { enabled: boolean; start: string; end: string }): boolean {
    if (!quietHours.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return currentTime >= quietHours.start && currentTime <= quietHours.end;
  }

  /**
   * Send email notification using Supabase
   */
  private async sendEmail(notification: Notification): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: notification.userId },
        select: { email: true, name: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // In production, use Supabase Auth email or a service like SendGrid
      // For now, log the email
      console.log(`Email to ${user.email}: ${notification.title}`);
      console.log(`Message: ${notification.message}`);

      // Implement retry logic with exponential backoff
      await this.retryWithBackoff(async () => {
        // Send email via Supabase or email service
        // await supabase.auth.admin.sendEmail(...)
      });
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Send push notification
   */
  private async sendPush(notification: Notification): Promise<void> {
    try {
      // In production, use Web Push API or Firebase Cloud Messaging
      console.log(`Push notification to user ${notification.userId}: ${notification.title}`);
      
      await this.retryWithBackoff(async () => {
        // Send push notification
        // Implementation depends on push service used
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  /**
   * Send Telegram message
   */
  private async sendTelegram(notification: Notification): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: notification.userId },
        select: { telegramChatId: true, telegramConnected: true },
      });

      if (!user || !user.telegramConnected || !user.telegramChatId) {
        return;
      }

      console.log(`Telegram to ${user.telegramChatId}: ${notification.title}`);
      
      await this.retryWithBackoff(async () => {
        // Use Telegram bot service to send message
        if (notification.type === 'trade' && notification.data?.trade) {
          await telegramBotService.sendTradeNotification(
            notification.userId,
            notification.data.trade
          );
        } else if (notification.type === 'dailySummary' && notification.data?.prediction) {
          await telegramBotService.sendDailyPrediction(
            notification.userId,
            notification.data.prediction
          );
        }
        // For other notification types, the bot service would need additional methods
      });
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      throw error;
    }
  }

  /**
   * Send WhatsApp message
   */
  private async sendWhatsApp(notification: Notification): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: notification.userId },
        select: { whatsappNumber: true, whatsappConnected: true },
      });

      if (!user || !user.whatsappConnected || !user.whatsappNumber) {
        return;
      }

      console.log(`WhatsApp to ${user.whatsappNumber}: ${notification.title}`);
      
      await this.retryWithBackoff(async () => {
        // Use WhatsApp service to send message
        if (notification.type === 'trade' && notification.data?.trade) {
          await whatsappService.sendTradeNotification(
            notification.userId,
            notification.data.trade
          );
        } else if (notification.type === 'dailySummary' && notification.data?.summary) {
          await whatsappService.sendDailySummary(
            notification.userId,
            notification.data.summary
          );
        } else if (notification.type === 'limit' && notification.data?.limitType && notification.data?.amount) {
          await whatsappService.sendLimitNotification(
            notification.userId,
            notification.data.limitType,
            notification.data.amount
          );
        }
      });
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

  /**
   * Get user notification preferences
   */
  async getPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { notificationPreferences: true },
      });

      if (!user || !user.notificationPreferences) {
        // Return default preferences
        return this.getDefaultPreferences();
      }

      return user.notificationPreferences as NotificationPreferences;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Update user notification preferences
   */
  async updatePreferences(userId: string, preferences: NotificationPreferences): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          notificationPreferences: preferences as any,
        },
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  /**
   * Get default notification preferences
   */
  private getDefaultPreferences(): NotificationPreferences {
    return {
      email: {
        trades: true,
        dailySummary: true,
        limits: true,
        systemAlerts: true,
        marketing: false,
      },
      push: {
        trades: true,
        dailySummary: false,
        limits: true,
        systemAlerts: true,
        marketing: false,
      },
      telegram: {
        trades: false,
        dailySummary: false,
        limits: false,
        systemAlerts: false,
        marketing: false,
      },
      whatsapp: {
        trades: false,
        dailySummary: false,
        limits: false,
        systemAlerts: false,
        marketing: false,
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
      },
    };
  }

  /**
   * Retry with exponential backoff
   */
  private async retryWithBackoff(
    fn: () => Promise<void>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await fn();
        return;
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  /**
   * Send trade notification
   */
  async sendTradeNotification(userId: string, trade: any): Promise<void> {
    const message = `Trade ${trade.action.toUpperCase()}: ${trade.quantity} ${trade.instrument} @ ₹${trade.entryPrice.toFixed(2)}`;
    
    await this.sendNotification({
      userId,
      type: 'trade',
      title: 'Trade Executed',
      message,
      data: trade,
    });
  }

  /**
   * Send daily summary notification
   */
  async sendDailySummary(userId: string, summary: any): Promise<void> {
    const message = `Today's P&L: ₹${summary.pnl.toFixed(2)} | Trades: ${summary.trades} | Win Rate: ${summary.winRate.toFixed(1)}%`;
    
    await this.sendNotification({
      userId,
      type: 'dailySummary',
      title: 'Daily Trading Summary',
      message,
      data: summary,
    });
  }

  /**
   * Send limit reached notification
   */
  async sendLimitNotification(userId: string, limitType: string, amount: number): Promise<void> {
    const message = `${limitType} limit reached: ₹${amount.toFixed(2)}. Trading has been stopped.`;
    
    await this.sendNotification({
      userId,
      type: 'limit',
      title: 'Trading Limit Reached',
      message,
      data: { limitType, amount },
    });
  }

  /**
   * Send system alert notification
   */
  async sendSystemAlert(userId: string, alert: string): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'systemAlert',
      title: 'System Alert',
      message: alert,
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
