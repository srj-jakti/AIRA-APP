import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface WhatsAppMessage {
  to: string;
  message: string;
  type?: 'text' | 'template';
}

interface OTPVerification {
  phoneNumber: string;
  otp: string;
  expiresAt: Date;
}

class WhatsAppService {
  private apiUrl: string;
  private apiKey: string;
  private otpStore: Map<string, OTPVerification> = new Map();

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    this.apiKey = process.env.WHATSAPP_API_KEY || '';
  }

  /**
   * Generate and send OTP for phone number verification
   */
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP with 10-minute expiry
      this.otpStore.set(phoneNumber, {
        phoneNumber,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      });

      // Send OTP via WhatsApp
      const message = `Your AIRA verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.`;
      
      await this.sendMessage({
        to: phoneNumber,
        message
      });

      return {
        success: true,
        message: 'OTP sent successfully'
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP'
      };
    }
  }

  /**
   * Verify OTP for phone number
   */
  async verifyOTP(phoneNumber: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      const stored = this.otpStore.get(phoneNumber);

      if (!stored) {
        return {
          success: false,
          message: 'OTP not found or expired'
        };
      }

      if (new Date() > stored.expiresAt) {
        this.otpStore.delete(phoneNumber);
        return {
          success: false,
          message: 'OTP expired'
        };
      }

      if (stored.otp !== otp) {
        return {
          success: false,
          message: 'Invalid OTP'
        };
      }

      // OTP verified successfully
      this.otpStore.delete(phoneNumber);
      
      return {
        success: true,
        message: 'Phone number verified successfully'
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP'
      };
    }
  }

  /**
   * Send WhatsApp message
   */
  async sendMessage(params: WhatsAppMessage): Promise<boolean> {
    try {
      // Check rate limits
      if (!this.checkRateLimit(params.to)) {
        console.warn(`Rate limit exceeded for ${params.to}`);
        return false;
      }

      // Format phone number (remove + and spaces)
      const formattedPhone = params.to.replace(/[^0-9]/g, '');

      // Send message via WhatsApp Business API
      const response = await axios.post(
        `${this.apiUrl}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: {
            body: params.message
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('WhatsApp message sent:', response.data);
      return true;
    } catch (error: any) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      return false;
    }
  }

  /**
   * Send trade notification via WhatsApp
   */
  async sendTradeNotification(
    userId: string,
    trade: {
      instrument: string;
      action: 'buy' | 'sell';
      quantity: number;
      price: number;
      profitLoss?: number;
    }
  ): Promise<boolean> {
    try {
      // Get user's WhatsApp number and preferences
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          whatsappNumber: true,
          whatsappConnected: true,
          notificationPreferences: true,
          language: true
        }
      });

      if (!user || !user.whatsappConnected || !user.whatsappNumber) {
        return false;
      }

      // Check notification preferences
      const prefs = user.notificationPreferences as any;
      if (!prefs?.whatsapp?.trades) {
        return false;
      }

      // Check quiet hours
      if (this.isQuietHours(prefs?.quietHours)) {
        return false;
      }

      // Format message based on language
      const message = this.formatTradeMessage(trade, user.language || 'en');

      return await this.sendMessage({
        to: user.whatsappNumber,
        message
      });
    } catch (error) {
      console.error('Error sending trade notification:', error);
      return false;
    }
  }

  /**
   * Send daily P&L summary via WhatsApp
   */
  async sendDailySummary(
    userId: string,
    summary: {
      totalTrades: number;
      profitLoss: number;
      winRate: number;
    }
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          whatsappNumber: true,
          whatsappConnected: true,
          notificationPreferences: true,
          language: true
        }
      });

      if (!user || !user.whatsappConnected || !user.whatsappNumber) {
        return false;
      }

      const prefs = user.notificationPreferences as any;
      if (!prefs?.whatsapp?.dailySummary) {
        return false;
      }

      const message = this.formatDailySummary(summary, user.language || 'en');

      return await this.sendMessage({
        to: user.whatsappNumber,
        message
      });
    } catch (error) {
      console.error('Error sending daily summary:', error);
      return false;
    }
  }

  /**
   * Send limit reached notification via WhatsApp
   */
  async sendLimitNotification(
    userId: string,
    limitType: 'profit' | 'loss',
    amount: number
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          whatsappNumber: true,
          whatsappConnected: true,
          notificationPreferences: true,
          language: true
        }
      });

      if (!user || !user.whatsappConnected || !user.whatsappNumber) {
        return false;
      }

      const prefs = user.notificationPreferences as any;
      if (!prefs?.whatsapp?.limits) {
        return false;
      }

      const message = this.formatLimitMessage(limitType, amount, user.language || 'en');

      return await this.sendMessage({
        to: user.whatsappNumber,
        message
      });
    } catch (error) {
      console.error('Error sending limit notification:', error);
      return false;
    }
  }

  /**
   * Format trade message based on language
   */
  private formatTradeMessage(
    trade: {
      instrument: string;
      action: 'buy' | 'sell';
      quantity: number;
      price: number;
      profitLoss?: number;
    },
    language: string
  ): string {
    const disclaimer = language === 'hi' 
      ? '\n\n⚠️ यह स्वचालित ट्रेडिंग है। AIRA एक सॉफ्टवेयर टूल है, SEBI पंजीकृत सलाहकार नहीं।'
      : '\n\n⚠️ This is automated trading. AIRA is a software tool, not a SEBI registered advisor.';

    if (language === 'hi') {
      const action = trade.action === 'buy' ? 'खरीदा' : 'बेचा';
      let message = `🤖 AIRA ट्रेड अलर्ट\n\n`;
      message += `${action}: ${trade.instrument}\n`;
      message += `मात्रा: ${trade.quantity}\n`;
      message += `कीमत: ₹${trade.price.toFixed(2)}`;
      
      if (trade.profitLoss !== undefined) {
        const plEmoji = trade.profitLoss >= 0 ? '📈' : '📉';
        message += `\n${plEmoji} P&L: ₹${trade.profitLoss.toFixed(2)}`;
      }
      
      return message + disclaimer;
    } else {
      const action = trade.action === 'buy' ? 'Bought' : 'Sold';
      let message = `🤖 AIRA Trade Alert\n\n`;
      message += `${action}: ${trade.instrument}\n`;
      message += `Quantity: ${trade.quantity}\n`;
      message += `Price: ₹${trade.price.toFixed(2)}`;
      
      if (trade.profitLoss !== undefined) {
        const plEmoji = trade.profitLoss >= 0 ? '📈' : '📉';
        message += `\n${plEmoji} P&L: ₹${trade.profitLoss.toFixed(2)}`;
      }
      
      return message + disclaimer;
    }
  }

  /**
   * Format daily summary message
   */
  private formatDailySummary(
    summary: {
      totalTrades: number;
      profitLoss: number;
      winRate: number;
    },
    language: string
  ): string {
    const disclaimer = language === 'hi'
      ? '\n\n⚠️ AIRA एक सॉफ्टवेयर टूल है, SEBI पंजीकृत सलाहकार नहीं।'
      : '\n\n⚠️ AIRA is a software tool, not a SEBI registered advisor.';

    if (language === 'hi') {
      const plEmoji = summary.profitLoss >= 0 ? '📈' : '📉';
      let message = `📊 दैनिक ट्रेडिंग सारांश\n\n`;
      message += `कुल ट्रेड: ${summary.totalTrades}\n`;
      message += `${plEmoji} P&L: ₹${summary.profitLoss.toFixed(2)}\n`;
      message += `जीत दर: ${summary.winRate.toFixed(1)}%`;
      
      return message + disclaimer;
    } else {
      const plEmoji = summary.profitLoss >= 0 ? '📈' : '📉';
      let message = `📊 Daily Trading Summary\n\n`;
      message += `Total Trades: ${summary.totalTrades}\n`;
      message += `${plEmoji} P&L: ₹${summary.profitLoss.toFixed(2)}\n`;
      message += `Win Rate: ${summary.winRate.toFixed(1)}%`;
      
      return message + disclaimer;
    }
  }

  /**
   * Format limit notification message
   */
  private formatLimitMessage(
    limitType: 'profit' | 'loss',
    amount: number,
    language: string
  ): string {
    if (language === 'hi') {
      const type = limitType === 'profit' ? 'लाभ' : 'हानि';
      let message = `⚠️ दैनिक ${type} सीमा पहुंच गई\n\n`;
      message += `राशि: ₹${Math.abs(amount).toFixed(2)}\n`;
      message += `AI ट्रेडिंग स्वचालित रूप से बंद कर दी गई है।\n`;
      message += `कल फिर से शुरू होगी।`;
      
      return message;
    } else {
      const type = limitType === 'profit' ? 'Profit' : 'Loss';
      let message = `⚠️ Daily ${type} Limit Reached\n\n`;
      message += `Amount: ₹${Math.abs(amount).toFixed(2)}\n`;
      message += `AI Trading has been automatically stopped.\n`;
      message += `Will resume tomorrow.`;
      
      return message;
    }
  }

  /**
   * Check if current time is within quiet hours
   */
  private isQuietHours(quietHours: any): boolean {
    if (!quietHours?.enabled) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = quietHours.start.split(':').map(Number);
    const [endHour, endMin] = quietHours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  /**
   * Check rate limits (max 10 messages per hour per number)
   */
  private rateLimitStore: Map<string, number[]> = new Map();

  private checkRateLimit(phoneNumber: string): boolean {
    const now = Date.now();
    const hourAgo = now - 60 * 60 * 1000;
    
    let timestamps = this.rateLimitStore.get(phoneNumber) || [];
    timestamps = timestamps.filter(t => t > hourAgo);
    
    if (timestamps.length >= 10) {
      return false;
    }
    
    timestamps.push(now);
    this.rateLimitStore.set(phoneNumber, timestamps);
    
    return true;
  }
}

export const whatsappService = new WhatsAppService();
