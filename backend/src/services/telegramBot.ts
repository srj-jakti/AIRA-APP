/**
 * Telegram Bot Service
 * Provides AIRA access through Telegram with commands and notifications
 */

import TelegramBot from 'node-telegram-bot-api';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface TelegramUser {
  userId: string;
  chatId: string;
  language: 'en' | 'hi';
}

// Store active connection codes (in production, use Redis)
const connectionCodes = new Map<string, { userId: string; expiresAt: Date }>();

export class TelegramBotService {
  private bot: TelegramBot | null = null;
  private isInitialized = false;

  /**
   * Initialize the Telegram bot
   */
  initialize(): void {
    const token = process.env.TELEGRAM_BOT_TOKEN;

    if (!token) {
      console.warn('TELEGRAM_BOT_TOKEN not configured. Telegram bot disabled.');
      return;
    }

    try {
      this.bot = new TelegramBot(token, { polling: true });
      this.setupCommands();
      this.isInitialized = true;
      console.log('✓ Telegram bot initialized');
    } catch (error) {
      console.error('Failed to initialize Telegram bot:', error);
    }
  }

  /**
   * Setup bot commands
   */
  private setupCommands(): void {
    if (!this.bot) return;

    // /start command
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      await this.handleStart(chatId);
    });

    // /connect command
    this.bot.onText(/\/connect (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const code = match?.[1];
      if (code) {
        await this.handleConnect(chatId, code);
      }
    });

    // /balance command
    this.bot.onText(/\/balance/, async (msg) => {
      const chatId = msg.chat.id;
      await this.handleBalance(chatId);
    });

    // /positions command
    this.bot.onText(/\/positions/, async (msg) => {
      const chatId = msg.chat.id;
      await this.handlePositions(chatId);
    });

    // /strategies command
    this.bot.onText(/\/strategies/, async (msg) => {
      const chatId = msg.chat.id;
      await this.handleStrategies(chatId);
    });

    // /ai command
    this.bot.onText(/\/ai (on|off)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const action = match?.[1];
      if (action) {
        await this.handleAIToggle(chatId, action as 'on' | 'off');
      }
    });

    // /market command
    this.bot.onText(/\/market/, async (msg) => {
      const chatId = msg.chat.id;
      await this.handleMarket(chatId);
    });

    // /language command
    this.bot.onText(/\/language (en|hi)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const lang = match?.[1];
      if (lang) {
        await this.handleLanguage(chatId, lang as 'en' | 'hi');
      }
    });

    // /help command
    this.bot.onText(/\/help/, async (msg) => {
      const chatId = msg.chat.id;
      await this.handleHelp(chatId);
    });

    console.log('✓ Telegram bot commands registered');
  }

  /**
   * Handle /start command
   */
  private async handleStart(chatId: number): Promise<void> {
    const message = `
🤖 *Welcome to AIRA - AI Trading Platform*

I'm your AI trading assistant on Telegram!

To get started, you need to connect your AIRA account:

1. Open AIRA web app
2. Go to Settings → Telegram
3. Copy your connection code
4. Send me: \`/connect YOUR_CODE\`

Once connected, you can:
• Check your balance
• View positions
• Manage strategies
• Control AI trading
• Get market updates

Type /help to see all commands.

_Disclaimer: AIRA is a trading tool, not financial advice. Trade at your own risk._
    `;

    await this.sendMessage(chatId, message);
  }

  /**
   * Handle /connect command
   */
  private async handleConnect(chatId: number, code: string): Promise<void> {
    // Validate connection code
    const connection = connectionCodes.get(code);

    if (!connection) {
      await this.sendMessage(
        chatId,
        '❌ Invalid or expired connection code.\n\nPlease generate a new code in the AIRA web app.'
      );
      return;
    }

    if (connection.expiresAt < new Date()) {
      connectionCodes.delete(code);
      await this.sendMessage(
        chatId,
        '❌ Connection code expired.\n\nPlease generate a new code in the AIRA web app.'
      );
      return;
    }

    // Connect user
    try {
      await prisma.user.update({
        where: { id: connection.userId },
        data: {
          telegramChatId: chatId.toString(),
          telegramConnected: true,
        },
      });

      connectionCodes.delete(code);

      await this.sendMessage(
        chatId,
        '✅ *Successfully connected!*\n\nYour AIRA account is now linked to Telegram.\n\nType /help to see available commands.'
      );
    } catch (error) {
      console.error('Failed to connect Telegram:', error);
      await this.sendMessage(
        chatId,
        '❌ Failed to connect. Please try again or contact support.'
      );
    }
  }

  /**
   * Handle /balance command
   */
  private async handleBalance(chatId: number): Promise<void> {
    const user = await this.getAuthenticatedUser(chatId);
    if (!user) return;

    // Mock balance data - would fetch from broker API
    const balance = {
      available: 50000,
      used: 15000,
      total: 65000,
      pnl: 2450,
    };

    const message = `
💰 *Account Balance*

Available: ₹${balance.available.toLocaleString()}
Used: ₹${balance.used.toLocaleString()}
Total: ₹${balance.total.toLocaleString()}

Today's P&L: ${balance.pnl >= 0 ? '+' : ''}₹${balance.pnl.toLocaleString()}
    `;

    await this.sendMessage(chatId, message);
  }

  /**
   * Handle /positions command
   */
  private async handlePositions(chatId: number): Promise<void> {
    const user = await this.getAuthenticatedUser(chatId);
    if (!user) return;

    // Fetch user's open positions
    const positions = await prisma.trade.findMany({
      where: {
        userId: user.userId,
        status: 'open',
      },
      take: 10,
    });

    if (positions.length === 0) {
      await this.sendMessage(chatId, '📊 No open positions');
      return;
    }

    let message = '📊 *Open Positions*\n\n';

    positions.forEach((position, index) => {
      const pnl = position.profitLoss || 0;
      message += `${index + 1}. *${position.instrument}*\n`;
      message += `   ${position.action.toUpperCase()} ${position.quantity} @ ₹${position.entryPrice}\n`;
      message += `   P&L: ${pnl >= 0 ? '+' : ''}₹${pnl.toFixed(2)}\n\n`;
    });

    await this.sendMessage(chatId, message);
  }

  /**
   * Handle /strategies command
   */
  private async handleStrategies(chatId: number): Promise<void> {
    const user = await this.getAuthenticatedUser(chatId);
    if (!user) return;

    // Fetch user's active strategies
    const strategies = await prisma.strategy.findMany({
      where: {
        userId: user.userId,
        isActive: true,
      },
      take: 10,
    });

    if (strategies.length === 0) {
      await this.sendMessage(chatId, '📈 No active strategies');
      return;
    }

    let message = '📈 *Active Strategies*\n\n';

    strategies.forEach((strategy, index) => {
      message += `${index + 1}. *${strategy.name}*\n`;
      message += `   Category: ${strategy.category}\n`;
      message += `   Visibility: ${strategy.visibility}\n\n`;
    });

    await this.sendMessage(chatId, message);
  }

  /**
   * Handle /ai command
   */
  private async handleAIToggle(
    chatId: number,
    action: 'on' | 'off'
  ): Promise<void> {
    const user = await this.getAuthenticatedUser(chatId);
    if (!user) return;

    try {
      await prisma.riskSettings.upsert({
        where: { userId: user.userId },
        create: {
          userId: user.userId,
          aiTradingEnabled: action === 'on',
          dailyProfitLimit: 5000,
          dailyLossLimit: 2000,
          maxPositionSize: 10,
          maxOpenPositions: 5,
          allowedInstruments: [],
        },
        update: {
          aiTradingEnabled: action === 'on',
        },
      });

      const message =
        action === 'on'
          ? '🤖 *AI Trading Enabled*\n\nAIRA will now execute trades automatically based on your active strategies.\n\n⚠️ Monitor your positions regularly.'
          : '🛑 *AI Trading Disabled*\n\nAutomatic trading has been stopped. Your positions remain open.';

      await this.sendMessage(chatId, message);
    } catch (error) {
      console.error('Failed to toggle AI trading:', error);
      await this.sendMessage(chatId, '❌ Failed to update AI trading status.');
    }
  }

  /**
   * Handle /market command
   */
  private async handleMarket(chatId: number): Promise<void> {
    const user = await this.getAuthenticatedUser(chatId);
    if (!user) return;

    // Check market status
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay();

    const isWeekend = day === 0 || day === 6;
    const isMarketHours =
      !isWeekend &&
      ((hours === 9 && minutes >= 15) || (hours > 9 && hours < 15) || (hours === 15 && minutes <= 30));

    const status = isMarketHours ? '🟢 OPEN' : '🔴 CLOSED';
    const nextOpen = isMarketHours
      ? 'Closes at 3:30 PM IST'
      : isWeekend
      ? 'Opens Monday 9:15 AM IST'
      : hours < 9 || (hours === 9 && minutes < 15)
      ? 'Opens today at 9:15 AM IST'
      : 'Opens tomorrow at 9:15 AM IST';

    const message = `
📊 *Market Status*

Status: ${status}
${nextOpen}

_Market hours: 9:15 AM - 3:30 PM IST (Mon-Fri)_
    `;

    await this.sendMessage(chatId, message);
  }

  /**
   * Handle /language command
   */
  private async handleLanguage(
    chatId: number,
    language: 'en' | 'hi'
  ): Promise<void> {
    const user = await this.getAuthenticatedUser(chatId);
    if (!user) return;

    try {
      await prisma.user.update({
        where: { id: user.userId },
        data: { language },
      });

      const message =
        language === 'en'
          ? '✅ Language set to English'
          : '✅ भाषा हिंदी में सेट की गई';

      await this.sendMessage(chatId, message);
    } catch (error) {
      console.error('Failed to update language:', error);
      await this.sendMessage(chatId, '❌ Failed to update language.');
    }
  }

  /**
   * Handle /help command
   */
  private async handleHelp(chatId: number): Promise<void> {
    const message = `
📚 *AIRA Telegram Bot Commands*

*Account*
/balance - View account balance
/positions - View open positions
/strategies - View active strategies

*Trading*
/ai on - Enable AI trading
/ai off - Disable AI trading

*Information*
/market - Check market status
/language en - Set language to English
/language hi - Set language to Hindi

*Help*
/help - Show this help message

_Need more help? Visit the AIRA web app or contact support._
    `;

    await this.sendMessage(chatId, message);
  }

  /**
   * Get authenticated user from chat ID
   */
  private async getAuthenticatedUser(
    chatId: number
  ): Promise<TelegramUser | null> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          telegramChatId: chatId.toString(),
          telegramConnected: true,
        },
      });

      if (!user) {
        await this.sendMessage(
          chatId,
          '❌ Not connected.\n\nPlease use /start to connect your AIRA account.'
        );
        return null;
      }

      return {
        userId: user.id,
        chatId: chatId.toString(),
        language: (user.language === 'hi' ? 'hi' : 'en') as 'en' | 'hi',
      };
    } catch (error) {
      console.error('Failed to authenticate user:', error);
      await this.sendMessage(chatId, '❌ Authentication failed. Please try again.');
      return null;
    }
  }

  /**
   * Send message to user
   */
  private async sendMessage(chatId: number, text: string): Promise<void> {
    if (!this.bot) return;

    try {
      await this.bot.sendMessage(chatId, text, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }

  /**
   * Generate connection code for user
   */
  generateConnectionCode(userId: string): string {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minute expiry

    connectionCodes.set(code, { userId, expiresAt });

    // Clean up expired codes
    setTimeout(() => {
      connectionCodes.delete(code);
    }, 10 * 60 * 1000);

    return code;
  }

  /**
   * Send trade notification to user
   */
  async sendTradeNotification(
    userId: string,
    trade: any
  ): Promise<void> {
    if (!this.bot || !this.isInitialized) return;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.telegramChatId || !user.telegramConnected) {
        return;
      }

      const action = trade.action.toUpperCase();
      const pnl = trade.profitLoss || 0;
      const pnlText = pnl >= 0 ? `+₹${pnl.toFixed(2)}` : `-₹${Math.abs(pnl).toFixed(2)}`;

      const message = `
🔔 *Trade ${trade.status === 'open' ? 'Opened' : 'Closed'}*

${action} ${trade.quantity} ${trade.instrument}
Entry: ₹${trade.entryPrice}
${trade.exitPrice ? `Exit: ₹${trade.exitPrice}` : ''}
${trade.status === 'closed' ? `P&L: ${pnlText}` : ''}

Strategy: ${trade.strategy?.name || 'Unknown'}
Mode: ${trade.mode === 'live' ? 'Live' : 'Paper'}
      `;

      await this.bot.sendMessage(parseInt(user.telegramChatId), message, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error('Failed to send trade notification:', error);
    }
  }

  /**
   * Send daily market prediction
   */
  async sendDailyPrediction(userId: string, prediction: string): Promise<void> {
    if (!this.bot || !this.isInitialized) return;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.telegramChatId || !user.telegramConnected) {
        return;
      }

      const message = `
🔮 *Daily Market Prediction*

${prediction}

_Disclaimer: This is AI-generated analysis for informational purposes only. Not financial advice._
      `;

      await this.bot.sendMessage(parseInt(user.telegramChatId), message, {
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error('Failed to send daily prediction:', error);
    }
  }

  /**
   * Disconnect user
   */
  async disconnectUser(userId: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          telegramChatId: null,
          telegramConnected: false,
        },
      });
    } catch (error) {
      console.error('Failed to disconnect Telegram user:', error);
    }
  }
}

export const telegramBotService = new TelegramBotService();
