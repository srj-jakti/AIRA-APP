/**
 * AI Strategy Generator Service
 * Generates new strategies based on learned patterns from the Learning Engine
 * Automatically backtests and validates generated strategies
 */

import { PrismaClient } from '@prisma/client';
import { learningEngine } from './learningEngine';

const prisma = new PrismaClient();

interface GeneratedStrategy {
  name: string;
  description: string;
  category: string;
  entryConditions: any[];
  exitConditions: any[];
  stopLoss: any;
  target: any;
  trailingStopLoss?: any;
  trailingTarget?: any;
  timeframe: string;
}

interface ValidationCriteria {
  minWinRate: number; // 55%
  minProfitFactor: number; // 1.5
  maxDrawdown: number; // 15%
}

const DEFAULT_CRITERIA: ValidationCriteria = {
  minWinRate: 55,
  minProfitFactor: 1.5,
  maxDrawdown: 15,
};

export class AIStrategyGeneratorService {
  /**
   * Generate strategies based on learned patterns
   */
  async generateStrategies(count: number = 5): Promise<GeneratedStrategy[]> {
    console.log(`Generating ${count} AI strategies...`);

    // Get learned patterns
    const patterns = await learningEngine.analyzeStrategyPatterns();

    if (patterns.length === 0) {
      console.log('No patterns available for strategy generation');
      return [];
    }

    const generatedStrategies: GeneratedStrategy[] = [];

    // Generate strategies for each pattern
    for (const pattern of patterns) {
      if (generatedStrategies.length >= count) break;

      const strategy = this.generateStrategyFromPattern(pattern);
      generatedStrategies.push(strategy);
    }

    console.log(`Generated ${generatedStrategies.length} strategies`);
    return generatedStrategies;
  }

  /**
   * Generate a strategy from a pattern
   */
  private generateStrategyFromPattern(pattern: any): GeneratedStrategy {
    const { category, commonIndicators, characteristics } = pattern;

    // Build entry conditions using common indicators
    const entryConditions = this.buildEntryConditions(
      commonIndicators,
      characteristics.entryComplexity
    );

    // Build exit conditions
    const exitConditions = this.buildExitConditions(commonIndicators);

    // Build risk management
    const stopLoss = this.buildStopLoss(category);
    const target = this.buildTarget(category);
    const trailing =
      characteristics.riskManagement === 'advanced'
        ? this.buildTrailing(category)
        : null;

    // Generate descriptive name
    const name = this.generateStrategyName(category, commonIndicators);
    const description = this.generateStrategyDescription(
      category,
      commonIndicators,
      characteristics
    );

    return {
      name,
      description,
      category,
      entryConditions,
      exitConditions,
      stopLoss,
      target,
      trailingStopLoss: trailing?.stopLoss,
      trailingTarget: trailing?.target,
      timeframe: characteristics.timeframe,
    };
  }

  /**
   * Build entry conditions based on indicators
   */
  private buildEntryConditions(
    indicators: string[],
    complexity: string
  ): any[] {
    const conditions: any[] = [];

    // Use top 2-3 indicators based on complexity
    const indicatorCount = complexity === 'simple' ? 2 : complexity === 'moderate' ? 3 : 4;
    const selectedIndicators = indicators.slice(0, indicatorCount);

    selectedIndicators.forEach((indicator) => {
      switch (indicator) {
        case 'RSI':
          conditions.push({
            indicator: 'RSI',
            operator: '>',
            value: 50,
            timeframe: '5m',
          });
          break;
        case 'MACD':
          conditions.push({
            indicator: 'MACD',
            operator: 'crosses_above',
            value: 'signal',
            timeframe: '5m',
          });
          break;
        case 'EMA':
          conditions.push({
            indicator: 'EMA',
            operator: 'crosses_above',
            value: 'EMA_50',
            timeframe: '5m',
          });
          break;
        case 'Volume':
          conditions.push({
            indicator: 'Volume',
            operator: '>',
            value: 'avg_volume',
            timeframe: '5m',
          });
          break;
        default:
          conditions.push({
            indicator,
            operator: '>',
            value: 50,
            timeframe: '5m',
          });
      }
    });

    return conditions;
  }

  /**
   * Build exit conditions
   */
  private buildExitConditions(indicators: string[]): any[] {
    const conditions: any[] = [];

    // Use opposite conditions for exit
    if (indicators.includes('RSI')) {
      conditions.push({
        indicator: 'RSI',
        operator: '<',
        value: 50,
        timeframe: '5m',
      });
    }

    if (indicators.includes('MACD')) {
      conditions.push({
        indicator: 'MACD',
        operator: 'crosses_below',
        value: 'signal',
        timeframe: '5m',
      });
    }

    return conditions;
  }

  /**
   * Build stop loss configuration
   */
  private buildStopLoss(category: string): any {
    const stopLossPercentages: Record<string, number> = {
      Scalping: 0.5,
      Intraday: 1.0,
      'Swing Trading': 2.0,
      Investment: 5.0,
    };

    return {
      type: 'percentage',
      value: stopLossPercentages[category] || 1.0,
    };
  }

  /**
   * Build target configuration
   */
  private buildTarget(category: string): any {
    const targetPercentages: Record<string, number> = {
      Scalping: 1.0,
      Intraday: 2.0,
      'Swing Trading': 5.0,
      Investment: 10.0,
    };

    return {
      type: 'percentage',
      value: targetPercentages[category] || 2.0,
    };
  }

  /**
   * Build trailing configuration
   */
  private buildTrailing(category: string): any {
    return {
      stopLoss: {
        enabled: true,
        type: 'percentage',
        value: 0.5,
        activationLevel: 1.0,
      },
      target: {
        enabled: true,
        type: 'percentage',
        value: 0.5,
        activationLevel: 1.5,
      },
    };
  }

  /**
   * Generate strategy name
   */
  private generateStrategyName(category: string, indicators: string[]): string {
    const indicatorStr = indicators.slice(0, 2).join('-');
    const timestamp = Date.now().toString().slice(-4);
    return `AI ${category} ${indicatorStr} ${timestamp}`;
  }

  /**
   * Generate strategy description
   */
  private generateStrategyDescription(
    category: string,
    indicators: string[],
    characteristics: any
  ): string {
    return `AI-generated ${category} strategy using ${indicators.join(', ')} indicators. ` +
      `Optimized for ${characteristics.timeframe} timeframe with ${characteristics.entryComplexity} entry logic. ` +
      `Generated by AIRA Learning Engine based on analysis of profitable strategies.`;
  }

  /**
   * Automatically backtest a generated strategy
   */
  async backtestStrategy(strategy: GeneratedStrategy): Promise<any> {
    console.log(`Backtesting strategy: ${strategy.name}`);

    // Create temporary strategy in database
    const tempStrategy = await prisma.strategy.create({
      data: {
        userId: 'ai-generator',
        name: strategy.name,
        description: strategy.description,
        category: strategy.category,
        visibility: 'PRIVATE',
        entryConditions: strategy.entryConditions,
        exitConditions: strategy.exitConditions,
        stopLoss: strategy.stopLoss,
        target: strategy.target,
        trailingStopLoss: strategy.trailingStopLoss || {},
        trailingTarget: strategy.trailingTarget || {},
        isActive: false,
      },
    });

    // Trigger backtest
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1); // 1 year backtest

    try {
      const response = await fetch(
        `${process.env.API_URL || 'http://localhost:3001'}/api/v1/backtest`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            strategyId: tempStrategy.id,
            instrument: 'NIFTY',
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            initialCapital: 100000,
          }),
        }
      );

      const backtestResult = await response.json();

      // Delete temporary strategy
      await prisma.strategy.delete({
        where: { id: tempStrategy.id },
      });

      return (backtestResult as any).data;
    } catch (error) {
      console.error('Backtest failed:', error);
      // Delete temporary strategy
      await prisma.strategy.delete({
        where: { id: tempStrategy.id },
      });
      return null;
    }
  }

  /**
   * Validate strategy meets performance criteria
   */
  validateStrategy(
    backtestResults: any,
    criteria: ValidationCriteria = DEFAULT_CRITERIA
  ): boolean {
    if (!backtestResults) return false;

    const { winRate, profitFactor, maxDrawdown } = backtestResults;

    const meetsWinRate = winRate >= criteria.minWinRate;
    const meetsProfitFactor = profitFactor >= criteria.minProfitFactor;
    const meetsDrawdown = maxDrawdown <= criteria.maxDrawdown;

    console.log('Validation results:', {
      winRate: `${winRate}% (min: ${criteria.minWinRate}%)`,
      profitFactor: `${profitFactor} (min: ${criteria.minProfitFactor})`,
      maxDrawdown: `${maxDrawdown}% (max: ${criteria.maxDrawdown}%)`,
      passes: meetsWinRate && meetsProfitFactor && meetsDrawdown,
    });

    return meetsWinRate && meetsProfitFactor && meetsDrawdown;
  }

  /**
   * Publish strategy to marketplace
   */
  async publishStrategy(
    strategy: GeneratedStrategy,
    backtestResults: any
  ): Promise<void> {
    console.log(`Publishing strategy: ${strategy.name}`);

    await prisma.strategy.create({
      data: {
        userId: 'ai-generator',
        name: strategy.name,
        description: strategy.description,
        category: strategy.category,
        visibility: 'PUBLIC',
        entryConditions: strategy.entryConditions,
        exitConditions: strategy.exitConditions,
        stopLoss: strategy.stopLoss,
        target: strategy.target,
        trailingStopLoss: strategy.trailingStopLoss || {},
        trailingTarget: strategy.trailingTarget || {},
        isActive: false,
        // Store backtest results
        // backtestResults: backtestResults, // Would need to add this field to schema
      },
    });

    console.log(`Strategy published: ${strategy.name}`);
  }

  /**
   * Monitor AI-generated strategies performance
   */
  async monitorAIStrategies(): Promise<void> {
    console.log('Monitoring AI-generated strategies...');

    const aiStrategies = await prisma.strategy.findMany({
      where: {
        userId: 'ai-generator',
        visibility: 'PUBLIC',
      },
      include: {
        trades: {
          where: {
            status: 'closed',
            mode: 'live',
          },
        },
      },
    });

    console.log(`Monitoring ${aiStrategies.length} AI strategies`);

    // Calculate performance for each strategy
    aiStrategies.forEach((strategy: any) => {
      const trades = strategy.trades;
      if (trades.length === 0) return;

      const winningTrades = trades.filter((t: any) => t.profitLoss && t.profitLoss > 0);
      const winRate = (winningTrades.length / trades.length) * 100;
      const totalPnL = trades.reduce((sum: number, t: any) => sum + (t.profitLoss || 0), 0);

      console.log(`${strategy.name}: ${trades.length} trades, ${winRate.toFixed(1)}% win rate, ₹${totalPnL.toFixed(2)} P&L`);

      // If performance degrades significantly, consider unpublishing
      if (trades.length >= 20 && winRate < 45) {
        console.log(`⚠️ ${strategy.name} underperforming - consider unpublishing`);
      }
    });
  }
}

export const aiStrategyGeneratorService = new AIStrategyGeneratorService();
