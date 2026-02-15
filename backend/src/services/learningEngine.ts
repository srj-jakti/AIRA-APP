/**
 * Learning Engine Service
 * Analyzes platform strategies and trading results to identify patterns
 * Uses clustering and statistical analysis to find characteristics of profitable strategies
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface StrategyFeatures {
  strategyId: string;
  category: string;
  indicators: string[];
  timeframe: string;
  entryConditionCount: number;
  exitConditionCount: number;
  hasStopLoss: boolean;
  hasTarget: boolean;
  hasTrailing: boolean;
  
  // Performance metrics
  winRate?: number;
  profitFactor?: number;
  totalTrades?: number;
  avgProfitPerTrade?: number;
  maxDrawdown?: number;
  sharpeRatio?: number;
}

interface StrategyPattern {
  id: string;
  name: string;
  category: string;
  commonIndicators: string[];
  avgWinRate: number;
  avgProfitFactor: number;
  sampleSize: number;
  characteristics: {
    timeframe: string;
    entryComplexity: 'simple' | 'moderate' | 'complex';
    riskManagement: 'basic' | 'advanced';
  };
}

export class LearningEngine {
  /**
   * Analyze all platform strategies and extract features
   */
  async analyzeStrategyPatterns(): Promise<StrategyPattern[]> {
    console.log('Starting strategy pattern analysis...');

    // Fetch all strategies with their performance data
    const strategies = await prisma.strategy.findMany({
      where: {
        isActive: true,
      },
      include: {
        trades: {
          where: {
            status: 'closed',
          },
        },
      },
    });

    console.log(`Analyzing ${strategies.length} strategies...`);

    // Extract features from each strategy
    const features: StrategyFeatures[] = strategies.map((strategy) =>
      this.extractFeatures(strategy)
    );

    // Filter strategies with sufficient data (at least 10 trades)
    const validFeatures = features.filter(
      (f) => f.totalTrades && f.totalTrades >= 10
    );

    console.log(`${validFeatures.length} strategies have sufficient data`);

    // Group strategies by category
    const categorizedStrategies = this.groupByCategory(validFeatures);

    // Identify patterns within each category
    const patterns: StrategyPattern[] = [];
    for (const [category, categoryStrategies] of Object.entries(
      categorizedStrategies
    )) {
      const categoryPatterns = this.identifyPatternsInCategory(
        category,
        categoryStrategies
      );
      patterns.push(...categoryPatterns);
    }

    console.log(`Identified ${patterns.length} patterns`);

    // Store patterns in database for future reference
    await this.storePatternsInDatabase(patterns);

    return patterns;
  }

  /**
   * Extract features from a strategy
   */
  private extractFeatures(strategy: any): StrategyFeatures {
    const entryConditions = Array.isArray(strategy.entryConditions)
      ? strategy.entryConditions
      : [];
    const exitConditions = Array.isArray(strategy.exitConditions)
      ? strategy.exitConditions
      : [];

    // Extract indicators used
    const indicators = new Set<string>();
    [...entryConditions, ...exitConditions].forEach((condition: any) => {
      if (condition.indicator) {
        indicators.add(condition.indicator);
      }
    });

    // Calculate performance metrics from trades
    const trades = strategy.trades || [];
    const closedTrades = trades.filter((t: any) => t.status === 'closed');
    const winningTrades = closedTrades.filter((t: any) => t.profitLoss > 0);

    const totalProfit = closedTrades
      .filter((t: any) => t.profitLoss > 0)
      .reduce((sum: number, t: any) => sum + t.profitLoss, 0);
    const totalLoss = Math.abs(
      closedTrades
        .filter((t: any) => t.profitLoss < 0)
        .reduce((sum: number, t: any) => sum + t.profitLoss, 0)
    );

    const winRate =
      closedTrades.length > 0
        ? (winningTrades.length / closedTrades.length) * 100
        : 0;
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : 0;

    return {
      strategyId: strategy.id,
      category: strategy.category,
      indicators: Array.from(indicators),
      timeframe: strategy.timeframe || '5m',
      entryConditionCount: entryConditions.length,
      exitConditionCount: exitConditions.length,
      hasStopLoss: !!strategy.stopLoss && Object.keys(strategy.stopLoss).length > 0,
      hasTarget: !!strategy.target && Object.keys(strategy.target).length > 0,
      hasTrailing:
        (!!strategy.trailingStopLoss &&
          Object.keys(strategy.trailingStopLoss).length > 0) ||
        (!!strategy.trailingTarget &&
          Object.keys(strategy.trailingTarget).length > 0),
      winRate,
      profitFactor,
      totalTrades: closedTrades.length,
      avgProfitPerTrade:
        closedTrades.length > 0
          ? closedTrades.reduce((sum: number, t: any) => sum + t.profitLoss, 0) /
            closedTrades.length
          : 0,
      maxDrawdown: 0, // Would need to calculate from equity curve
      sharpeRatio: 0, // Would need to calculate from returns
    };
  }

  /**
   * Group strategies by category
   */
  private groupByCategory(
    features: StrategyFeatures[]
  ): Record<string, StrategyFeatures[]> {
    const grouped: Record<string, StrategyFeatures[]> = {};

    features.forEach((feature) => {
      if (!grouped[feature.category]) {
        grouped[feature.category] = [];
      }
      grouped[feature.category].push(feature);
    });

    return grouped;
  }

  /**
   * Identify patterns within a category
   */
  private identifyPatternsInCategory(
    category: string,
    strategies: StrategyFeatures[]
  ): StrategyPattern[] {
    // Filter for profitable strategies (win rate > 55%, profit factor > 1.5)
    const profitableStrategies = strategies.filter(
      (s) =>
        s.winRate &&
        s.winRate > 55 &&
        s.profitFactor &&
        s.profitFactor > 1.5
    );

    if (profitableStrategies.length < 3) {
      console.log(
        `Not enough profitable strategies in ${category} (${profitableStrategies.length})`
      );
      return [];
    }

    // Find common indicators
    const indicatorFrequency: Record<string, number> = {};
    profitableStrategies.forEach((strategy) => {
      strategy.indicators.forEach((indicator) => {
        indicatorFrequency[indicator] =
          (indicatorFrequency[indicator] || 0) + 1;
      });
    });

    // Get indicators used in at least 30% of profitable strategies
    const threshold = profitableStrategies.length * 0.3;
    const commonIndicators = Object.entries(indicatorFrequency)
      .filter(([_, count]) => count >= threshold)
      .map(([indicator]) => indicator);

    // Calculate average metrics
    const avgWinRate =
      profitableStrategies.reduce((sum, s) => sum + (s.winRate || 0), 0) /
      profitableStrategies.length;
    const avgProfitFactor =
      profitableStrategies.reduce((sum, s) => sum + (s.profitFactor || 0), 0) /
      profitableStrategies.length;

    // Determine common characteristics
    const avgEntryConditions =
      profitableStrategies.reduce((sum, s) => sum + s.entryConditionCount, 0) /
      profitableStrategies.length;
    const mostCommonTimeframe = this.getMostCommon(
      profitableStrategies.map((s) => s.timeframe)
    );
    const hasAdvancedRisk =
      profitableStrategies.filter((s) => s.hasTrailing).length /
        profitableStrategies.length >
      0.5;

    const pattern: StrategyPattern = {
      id: `pattern-${category}-${Date.now()}`,
      name: `${category} Pattern`,
      category,
      commonIndicators,
      avgWinRate,
      avgProfitFactor,
      sampleSize: profitableStrategies.length,
      characteristics: {
        timeframe: mostCommonTimeframe,
        entryComplexity:
          avgEntryConditions <= 2
            ? 'simple'
            : avgEntryConditions <= 4
            ? 'moderate'
            : 'complex',
        riskManagement: hasAdvancedRisk ? 'advanced' : 'basic',
      },
    };

    return [pattern];
  }

  /**
   * Get most common value from array
   */
  private getMostCommon(arr: string[]): string {
    const frequency: Record<string, number> = {};
    arr.forEach((item) => {
      frequency[item] = (frequency[item] || 0) + 1;
    });

    let maxCount = 0;
    let mostCommon = arr[0];
    Object.entries(frequency).forEach(([item, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = item;
      }
    });

    return mostCommon;
  }

  /**
   * Store patterns in database for future reference
   */
  private async storePatternsInDatabase(
    patterns: StrategyPattern[]
  ): Promise<void> {
    // In production, you would store these in a dedicated table
    // For now, we'll just log them
    console.log('Storing patterns:', JSON.stringify(patterns, null, 2));

    // Could store in a JSON field or separate table
    // await prisma.strategyPattern.createMany({ data: patterns });
  }

  /**
   * Get stored patterns
   */
  async getStoredPatterns(): Promise<StrategyPattern[]> {
    // In production, retrieve from database
    // For now, return empty array
    return [];
  }

  /**
   * Analyze backtest results for patterns
   */
  async analyzeBacktestResults(): Promise<void> {
    console.log('Analyzing backtest results...');

    // Fetch all backtest results
    // Identify which strategy characteristics correlate with better performance
    // This would involve statistical analysis of backtest metrics

    // For now, this is a placeholder
    console.log('Backtest analysis complete');
  }

  /**
   * Analyze live trading results
   */
  async analyzeLiveTradingResults(): Promise<void> {
    console.log('Analyzing live trading results...');

    // Fetch all live trades
    const trades = await prisma.trade.findMany({
      where: {
        mode: 'live',
        status: 'closed',
      },
      include: {
        strategy: true,
      },
    });

    console.log(`Analyzed ${trades.length} live trades`);

    // Group by strategy and calculate performance
    const strategyPerformance: Record<string, any> = {};

    trades.forEach((trade) => {
      const strategyId = trade.strategyId;
      if (!strategyPerformance[strategyId]) {
        strategyPerformance[strategyId] = {
          trades: [],
          totalPnL: 0,
          wins: 0,
          losses: 0,
        };
      }

      strategyPerformance[strategyId].trades.push(trade);
      strategyPerformance[strategyId].totalPnL += trade.profitLoss || 0;
      if (trade.profitLoss && trade.profitLoss > 0) {
        strategyPerformance[strategyId].wins++;
      } else {
        strategyPerformance[strategyId].losses++;
      }
    });

    // Identify top performing strategies
    const topStrategies = Object.entries(strategyPerformance)
      .filter(([_, perf]: [string, any]) => perf.trades.length >= 10)
      .sort((a: any, b: any) => b[1].totalPnL - a[1].totalPnL)
      .slice(0, 10);

    console.log(`Top ${topStrategies.length} strategies identified`);
  }
}

export const learningEngine = new LearningEngine();
