import { ZerodhaClient } from './zerodha';

interface BacktestConfig {
  strategyId: string;
  instrument: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  entryConditions: any;
  exitConditions: any;
  stopLoss: any;
  target: any;
  trailingStopLoss?: any;
  trailingTarget?: any;
}

interface Trade {
  entryTime: Date;
  exitTime: Date;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profitLoss: number;
  profitLossPercent: number;
  type: 'long' | 'short';
  exitReason: 'target' | 'stopLoss' | 'signal' | 'trailing';
}

interface BacktestResults {
  strategyId: string;
  instrument: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  totalReturnPercent: number;
  
  // Trade Statistics
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  
  // Profit/Loss
  grossProfit: number;
  grossLoss: number;
  netProfit: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  
  // Risk Metrics
  maxDrawdown: number;
  maxDrawdownPercent: number;
  sharpeRatio: number;
  
  // Equity Curve
  equityCurve: Array<{ date: Date; equity: number }>;
  
  // Trade List
  trades: Trade[];
}

export class BacktestEngine {
  private zerodhaClient: ZerodhaClient;
  private slippagePercent = 0.1; // 0.1% slippage
  private commissionPerTrade = 20; // ₹20 per trade

  constructor(zerodhaClient: ZerodhaClient) {
    this.zerodhaClient = zerodhaClient;
  }

  /**
   * Run backtest for a strategy
   */
  async runBacktest(config: BacktestConfig): Promise<BacktestResults> {
    // Fetch historical data
    const historicalData = await this.fetchHistoricalData(
      config.instrument,
      config.startDate,
      config.endDate
    );

    if (!historicalData || historicalData.length === 0) {
      throw new Error('No historical data available for backtest');
    }

    // Initialize backtest state
    let capital = config.initialCapital;
    let position: any = null;
    const trades: Trade[] = [];
    const equityCurve: Array<{ date: Date; equity: number }> = [];
    let maxEquity = capital;
    let maxDrawdown = 0;

    // Simulate trading
    for (let i = 1; i < historicalData.length; i++) {
      const currentBar = historicalData[i];
      const previousBars = historicalData.slice(0, i);

      // Check if we should enter a position
      if (!position) {
        const shouldEnter = this.evaluateEntryConditions(
          config.entryConditions,
          currentBar,
          previousBars
        );

        if (shouldEnter) {
          // Calculate position size (use 100% of capital for simplicity)
          const quantity = Math.floor(capital / currentBar.close);
          
          if (quantity > 0) {
            const entryPrice = this.applySlippage(currentBar.close, 'buy');
            const cost = entryPrice * quantity + this.commissionPerTrade;

            if (cost <= capital) {
              position = {
                entryTime: currentBar.date,
                entryPrice,
                quantity,
                stopLoss: this.calculateStopLoss(entryPrice, config.stopLoss),
                target: this.calculateTarget(entryPrice, config.target),
                trailingStopLoss: config.trailingStopLoss?.enabled ? {
                  ...config.trailingStopLoss,
                  currentStop: this.calculateStopLoss(entryPrice, config.stopLoss),
                } : null,
              };
              capital -= cost;
            }
          }
        }
      }

      // Check if we should exit position
      if (position) {
        let exitPrice: number | null = null;
        let exitReason: string = '';

        // Check stop loss
        if (currentBar.low <= position.stopLoss) {
          exitPrice = position.stopLoss;
          exitReason = 'stopLoss';
        }

        // Check target
        if (!exitPrice && currentBar.high >= position.target) {
          exitPrice = position.target;
          exitReason = 'target';
        }

        // Check trailing stop loss
        if (!exitPrice && position.trailingStopLoss) {
          const { currentStop, value, triggerAt } = position.trailingStopLoss;
          const profitPercent = ((currentBar.close - position.entryPrice) / position.entryPrice) * 100;

          if (profitPercent >= triggerAt) {
            const newStop = currentBar.close * (1 - value / 100);
            if (newStop > currentStop) {
              position.trailingStopLoss.currentStop = newStop;
            }
          }

          if (currentBar.low <= position.trailingStopLoss.currentStop) {
            exitPrice = position.trailingStopLoss.currentStop;
            exitReason = 'trailing';
          }
        }

        // Check exit conditions
        if (!exitPrice) {
          const shouldExit = this.evaluateExitConditions(
            config.exitConditions,
            currentBar,
            previousBars
          );

          if (shouldExit) {
            exitPrice = currentBar.close;
            exitReason = 'signal';
          }
        }

        // Execute exit
        if (exitPrice) {
          const actualExitPrice = this.applySlippage(exitPrice, 'sell');
          const proceeds = actualExitPrice * position.quantity - this.commissionPerTrade;
          const profitLoss = proceeds - (position.entryPrice * position.quantity);
          
          capital += proceeds;

          trades.push({
            entryTime: position.entryTime,
            exitTime: currentBar.date,
            entryPrice: position.entryPrice,
            exitPrice: actualExitPrice,
            quantity: position.quantity,
            profitLoss,
            profitLossPercent: (profitLoss / (position.entryPrice * position.quantity)) * 100,
            type: 'long',
            exitReason: exitReason as any,
          });

          position = null;
        }
      }

      // Update equity curve
      const currentEquity = capital + (position ? position.quantity * currentBar.close : 0);
      equityCurve.push({
        date: currentBar.date,
        equity: currentEquity,
      });

      // Track drawdown
      if (currentEquity > maxEquity) {
        maxEquity = currentEquity;
      }
      const drawdown = maxEquity - currentEquity;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }

    // Close any open position at the end
    if (position) {
      const lastBar = historicalData[historicalData.length - 1];
      const exitPrice = this.applySlippage(lastBar.close, 'sell');
      const proceeds = exitPrice * position.quantity - this.commissionPerTrade;
      const profitLoss = proceeds - (position.entryPrice * position.quantity);
      
      capital += proceeds;

      trades.push({
        entryTime: position.entryTime,
        exitTime: lastBar.date,
        entryPrice: position.entryPrice,
        exitPrice,
        quantity: position.quantity,
        profitLoss,
        profitLossPercent: (profitLoss / (position.entryPrice * position.quantity)) * 100,
        type: 'long',
        exitReason: 'signal',
      });
    }

    // Calculate metrics
    return this.calculateMetrics(config, trades, equityCurve, capital, maxDrawdown);
  }

  /**
   * Fetch historical data from Zerodha
   */
  private async fetchHistoricalData(
    instrument: string,
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    try {
      // In production, we would:
      // 1. Look up instrument token from instrument name
      // 2. Call Zerodha API with proper parameters
      // For now, return mock data for testing
      
      // Mock historical data structure
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const data = [];
      let currentDate = new Date(startDate);
      let price = 100;

      for (let i = 0; i < days; i++) {
        // Skip weekends
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
          const change = (Math.random() - 0.5) * 5;
          price += change;
          
          data.push({
            date: new Date(currentDate),
            open: price,
            high: price + Math.random() * 2,
            low: price - Math.random() * 2,
            close: price,
            volume: Math.floor(Math.random() * 1000000),
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      return [];
    }
  }

  /**
   * Evaluate entry conditions
   */
  private evaluateEntryConditions(
    conditions: any,
    currentBar: any,
    previousBars: any[]
  ): boolean {
    // Simplified evaluation - would need full implementation
    // This would parse the conditions JSON and evaluate indicators
    return Math.random() > 0.95; // Mock: 5% entry rate
  }

  /**
   * Evaluate exit conditions
   */
  private evaluateExitConditions(
    conditions: any,
    currentBar: any,
    previousBars: any[]
  ): boolean {
    // Simplified evaluation
    return Math.random() > 0.98; // Mock: 2% exit rate
  }

  /**
   * Calculate stop loss price
   */
  private calculateStopLoss(entryPrice: number, stopLossConfig: any): number {
    if (stopLossConfig.type === 'percentage') {
      return entryPrice * (1 - stopLossConfig.value / 100);
    } else if (stopLossConfig.type === 'points') {
      return entryPrice - stopLossConfig.value;
    }
    return entryPrice * 0.98; // Default 2% stop loss
  }

  /**
   * Calculate target price
   */
  private calculateTarget(entryPrice: number, targetConfig: any): number {
    if (targetConfig.type === 'percentage') {
      return entryPrice * (1 + targetConfig.value / 100);
    } else if (targetConfig.type === 'points') {
      return entryPrice + targetConfig.value;
    }
    return entryPrice * 1.04; // Default 4% target
  }

  /**
   * Apply slippage to price
   */
  private applySlippage(price: number, side: 'buy' | 'sell'): number {
    const slippage = price * (this.slippagePercent / 100);
    return side === 'buy' ? price + slippage : price - slippage;
  }

  /**
   * Calculate backtest metrics
   */
  private calculateMetrics(
    config: BacktestConfig,
    trades: Trade[],
    equityCurve: Array<{ date: Date; equity: number }>,
    finalCapital: number,
    maxDrawdown: number
  ): BacktestResults {
    const winningTrades = trades.filter(t => t.profitLoss > 0);
    const losingTrades = trades.filter(t => t.profitLoss < 0);

    const grossProfit = winningTrades.reduce((sum, t) => sum + t.profitLoss, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profitLoss, 0));
    const netProfit = finalCapital - config.initialCapital;

    const averageWin = winningTrades.length > 0 ? grossProfit / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? grossLoss / losingTrades.length : 0;

    const largestWin = winningTrades.length > 0 
      ? Math.max(...winningTrades.map(t => t.profitLoss)) 
      : 0;
    const largestLoss = losingTrades.length > 0 
      ? Math.min(...losingTrades.map(t => t.profitLoss)) 
      : 0;

    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;

    // Calculate Sharpe Ratio (simplified)
    const returns = trades.map(t => t.profitLossPercent);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = stdDev > 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;

    return {
      strategyId: config.strategyId,
      instrument: config.instrument,
      startDate: config.startDate,
      endDate: config.endDate,
      initialCapital: config.initialCapital,
      finalCapital,
      totalReturn: netProfit,
      totalReturnPercent: (netProfit / config.initialCapital) * 100,
      
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      
      grossProfit,
      grossLoss,
      netProfit,
      profitFactor,
      averageWin,
      averageLoss,
      largestWin,
      largestLoss,
      
      maxDrawdown,
      maxDrawdownPercent: (maxDrawdown / config.initialCapital) * 100,
      sharpeRatio,
      
      equityCurve,
      trades,
    };
  }
}
