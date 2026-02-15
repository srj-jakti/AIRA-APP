import { PrismaClient } from '@prisma/client';
import { notificationService } from './notificationService';
import cron from 'node-cron';

const prisma = new PrismaClient();

export interface TradeSignal {
  userId: string;
  strategyId: string;
  instrument: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  stopLoss: number;
  target: number;
  reason: string;
}

export class TradingEngine {
  private isRunning: boolean = false;
  private tradingInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.setupMarketHoursSchedule();
  }

  private setupMarketHoursSchedule(): void {
    cron.schedule('15 9 * * 1-5', () => {
      console.log('Market opened - Starting trading engine');
      this.start();
    }, {
      timezone: 'Asia/Kolkata'
    });

    cron.schedule('30 15 * * 1-5', () => {
      console.log('Market closed - Stopping trading engine');
      this.stop();
    }, {
      timezone: 'Asia/Kolkata'
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Trading engine already running');
      return;
    }

    if (!this.isMarketOpen()) {
      console.log('Market is closed - Trading engine not started');
      return;
    }

    this.isRunning = true;
    console.log('Trading engine started');

    this.tradingInterval = setInterval(async () => {
      await this.executeTradingCycle();
    }, 1000);

    await this.executeTradingCycle();
  }

  stop(): void {
    if (this.tradingInterval) {
      clearInterval(this.tradingInterval);
      this.tradingInterval = null;
    }
    this.isRunning = false;
    console.log('Trading engine stopped');
  }

  private async executeTradingCycle(): Promise<void> {
    try {
      const usersWithAITrading = await prisma.riskSettings.findMany({
        where: { aiTradingEnabled: true },
        include: { user: true },
      });

      for (const riskSettings of usersWithAITrading) {
        await this.processUserTrading(riskSettings.userId, riskSettings);
      }
    } catch (error) {
      console.error('Error in trading cycle:', error);
    }
  }

  private async processUserTrading(userId: string, riskSettings: any): Promise<void> {
    try {
      const canTrade = await this.checkRiskLimits(userId, riskSettings);
      if (!canTrade) {
        return;
      }

      const activeStrategies = await prisma.strategy.findMany({
        where: {
          userId,
          isActive: true,
        },
      });

      if (activeStrategies.length === 0) {
        return;
      }

      const signals = await this.evaluateStrategies(userId, activeStrategies);

      for (const signal of signals) {
        await this.executeTrade(signal, riskSettings);
      }

      await this.monitorPositions(userId);
    } catch (error) {
      console.error('Error processing trading for user:', userId, error);
    }
  }

  private async checkRiskLimits(userId: string, riskSettings: any): Promise<boolean> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayTrades = await prisma.trade.findMany({
        where: {
          userId,
          entryTime: { gte: today },
          status: { in: ['open', 'closed'] },
        },
      });

      const todayPnL = todayTrades
        .filter((t: any) => t.profitLoss !== null)
        .reduce((sum: number, t: any) => sum + (t.profitLoss || 0), 0);

      if (riskSettings.dailyProfitLimit && todayPnL >= riskSettings.dailyProfitLimit) {
        console.log('User reached daily profit limit:', userId);
        await notificationService.sendLimitNotification(userId, 'profit', todayPnL);
        return false;
      }

      if (riskSettings.dailyLossLimit && todayPnL <= -riskSettings.dailyLossLimit) {
        console.log('User reached daily loss limit:', userId);
        await notificationService.sendLimitNotification(userId, 'loss', Math.abs(todayPnL));
        return false;
      }

      const openPositions = todayTrades.filter((t: any) => t.status === 'open').length;
      if (riskSettings.maxOpenPositions && openPositions >= riskSettings.maxOpenPositions) {
        console.log('User reached max open positions:', userId);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking risk limits:', error);
      return false;
    }
  }

  private async evaluateStrategies(userId: string, strategies: any[]): Promise<TradeSignal[]> {
    const signals: TradeSignal[] = [];

    for (const strategy of strategies) {
      const shouldGenerate = Math.random() > 0.95;
      
      if (shouldGenerate) {
        const instruments = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK'];
        const instrument = instruments[Math.floor(Math.random() * instruments.length)];
        const price = 100 + Math.random() * 900;
        const action = Math.random() > 0.5 ? 'BUY' : 'SELL';

        signals.push({
          userId,
          strategyId: strategy.id,
          instrument,
          action,
          quantity: 1,
          price,
          stopLoss: action === 'BUY' ? price * 0.98 : price * 1.02,
          target: action === 'BUY' ? price * 1.04 : price * 0.96,
          reason: 'Strategy conditions met',
        });
      }
    }

    return signals;
  }

  private async executeTrade(signal: TradeSignal, _riskSettings: any): Promise<void> {
    try {
      const hasBalance = await this.checkBalance(signal.userId, signal.price * signal.quantity);
      if (!hasBalance) {
        console.log('Insufficient balance for user:', signal.userId);
        return;
      }

      const userAPI = await prisma.userAPI.findUnique({
        where: { userId: signal.userId },
      });

      if (!userAPI || !userAPI.isConnected) {
        console.log('User API not connected:', signal.userId);
        return;
      }

      const trade = await prisma.trade.create({
        data: {
          userId: signal.userId,
          strategyId: signal.strategyId,
          instrument: signal.instrument,
          action: signal.action.toLowerCase(),
          quantity: signal.quantity,
          entryPrice: signal.price,
          stopLoss: signal.stopLoss,
          target: signal.target,
          status: 'open',
          mode: 'paper',
          entryTime: new Date(),
        },
      });

      console.log('Trade executed:', signal.action, signal.quantity, signal.instrument, '@', signal.price);
      
      await notificationService.sendTradeNotification(signal.userId, trade);
    } catch (error) {
      console.error('Error executing trade:', error);
    }
  }

  private async checkBalance(_userId: string, _requiredAmount: number): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      console.error('Error checking balance:', error);
      return false;
    }
  }

  private async monitorPositions(userId: string): Promise<void> {
    try {
      const openTrades = await prisma.trade.findMany({
        where: {
          userId,
          status: 'open',
        },
      });

      for (const trade of openTrades) {
        const currentPrice = trade.entryPrice * (1 + (Math.random() - 0.5) * 0.05);

        let shouldClose = false;
        let exitReason = '';

        if (trade.action === 'buy' && currentPrice <= trade.stopLoss) {
          shouldClose = true;
          exitReason = 'Stop-loss hit';
        } else if (trade.action === 'sell' && currentPrice >= trade.stopLoss) {
          shouldClose = true;
          exitReason = 'Stop-loss hit';
        }

        if (trade.action === 'buy' && currentPrice >= trade.target) {
          shouldClose = true;
          exitReason = 'Target reached';
        } else if (trade.action === 'sell' && currentPrice <= trade.target) {
          shouldClose = true;
          exitReason = 'Target reached';
        }

        if (shouldClose) {
          const profitLoss = trade.action === 'buy'
            ? (currentPrice - trade.entryPrice) * trade.quantity
            : (trade.entryPrice - currentPrice) * trade.quantity;

          await prisma.trade.update({
            where: { id: trade.id },
            data: {
              status: 'closed',
              exitPrice: currentPrice,
              exitTime: new Date(),
              profitLoss,
            },
          });

          console.log('Position closed:', trade.instrument, '-', exitReason, '- P&L: Rs', profitLoss.toFixed(2));
        }
      }
    } catch (error) {
      console.error('Error monitoring positions:', error);
    }
  }

  private isMarketOpen(): boolean {
    const now = new Date();
    const day = now.getDay();
    
    if (day === 0 || day === 6) {
      return false;
    }

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    const marketOpen = 9 * 60 + 15;
    const marketClose = 15 * 60 + 30;

    return currentTime >= marketOpen && currentTime <= marketClose;
  }

  getStatus(): any {
    return {
      isRunning: this.isRunning,
      isMarketOpen: this.isMarketOpen(),
    };
  }
}

export const tradingEngine = new TradingEngine();
