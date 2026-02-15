import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();

interface ScanResult {
  instrument: string;
  price: number;
  change: number;
  changePercent: number;
  strategyId: string;
  strategyName: string;
  signal: 'BUY' | 'SELL';
  confidence: number;
  matchReason: string;
  timestamp: Date;
}

export class MarketScanner {
  private io: Server;
  private isScanning: boolean = false;
  private scanInterval: NodeJS.Timeout | null = null;
  private instruments: string[] = [
    'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK',
    'SBIN', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 'LT',
    'AXISBANK', 'HINDUNILVR', 'MARUTI', 'BAJFINANCE', 'ASIANPAINT',
  ];

  constructor(io: Server) {
    this.io = io;
  }

  /**
   * Start scanning market
   */
  async startScanning(): Promise<void> {
    if (this.isScanning) {
      console.log('Scanner already running');
      return;
    }

    this.isScanning = true;
    console.log('Market scanner started');

    // Scan every 5 seconds
    this.scanInterval = setInterval(async () => {
      await this.scanMarket();
    }, 5000);

    // Run initial scan
    await this.scanMarket();
  }

  /**
   * Stop scanning market
   */
  stopScanning(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    this.isScanning = false;
    console.log('Market scanner stopped');
  }

  /**
   * Scan market for strategy matches
   */
  private async scanMarket(): Promise<void> {
    try {
      // Get all active strategies
      const activeStrategies = await prisma.strategy.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          userId: true,
          entryConditions: true,
          category: true,
        },
      });

      if (activeStrategies.length === 0) {
        return;
      }

      const scanResults: ScanResult[] = [];

      // Scan each instrument
      for (const instrument of this.instruments) {
        const marketData = await this.getMarketData(instrument);

        // Evaluate against each strategy
        for (const strategy of activeStrategies) {
          const match = this.evaluateInstrument(instrument, marketData, strategy);
          
          if (match) {
            scanResults.push({
              instrument,
              price: marketData.price,
              change: marketData.change,
              changePercent: marketData.changePercent,
              strategyId: strategy.id,
              strategyName: strategy.name,
              signal: match.signal,
              confidence: match.confidence,
              matchReason: match.reason,
              timestamp: new Date(),
            });
          }
        }
      }

      // Emit results to connected clients
      if (scanResults.length > 0) {
        this.io.emit('scanner:results', scanResults);
      }

      // Emit scan status
      this.io.emit('scanner:status', {
        isScanning: this.isScanning,
        lastScan: new Date(),
        instrumentsScanned: this.instruments.length,
        strategiesActive: activeStrategies.length,
        matchesFound: scanResults.length,
      });
    } catch (error) {
      console.error('Error scanning market:', error);
    }
  }

  /**
   * Get market data for instrument
   */
  private async getMarketData(instrument: string): Promise<any> {
    // In production, this would fetch real-time data from Zerodha
    // For now, return mock data
    const basePrice = 100 + Math.random() * 900;
    const change = (Math.random() - 0.5) * 10;
    
    return {
      instrument,
      price: basePrice,
      change,
      changePercent: (change / basePrice) * 100,
      volume: Math.floor(Math.random() * 1000000),
      high: basePrice + Math.random() * 5,
      low: basePrice - Math.random() * 5,
      open: basePrice + (Math.random() - 0.5) * 3,
    };
  }

  /**
   * Evaluate instrument against strategy
   */
  private evaluateInstrument(
    instrument: string,
    marketData: any,
    strategy: any
  ): { signal: 'BUY' | 'SELL'; confidence: number; reason: string } | null {
    // Simplified evaluation logic
    // In production, this would parse strategy conditions and evaluate indicators
    
    const entryConditions = strategy.entryConditions;
    
    // Mock evaluation - randomly match some instruments
    const shouldMatch = Math.random() > 0.95; // 5% match rate
    
    if (!shouldMatch) {
      return null;
    }

    // Determine signal based on price movement
    const signal = marketData.changePercent > 0 ? 'BUY' : 'SELL';
    const confidence = 60 + Math.random() * 30; // 60-90% confidence

    // Generate match reason
    const reasons = [
      'RSI crossed below 30 (oversold)',
      'MACD bullish crossover detected',
      'Price broke above resistance',
      'Volume spike with price increase',
      'Moving average golden cross',
      'Bollinger Band squeeze breakout',
    ];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];

    return { signal, confidence, reason };
  }

  /**
   * Get scanner status
   */
  getStatus(): any {
    return {
      isScanning: this.isScanning,
      instrumentsCount: this.instruments.length,
    };
  }

  /**
   * Add instruments to scan
   */
  addInstruments(instruments: string[]): void {
    this.instruments = [...new Set([...this.instruments, ...instruments])];
  }

  /**
   * Remove instruments from scan
   */
  removeInstruments(instruments: string[]): void {
    this.instruments = this.instruments.filter(i => !instruments.includes(i));
  }
}
