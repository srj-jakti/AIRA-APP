/**
 * AI Strategy Scheduler
 * Manages scheduled jobs for AI strategy generation and monitoring
 */

import cron from 'node-cron';
import { learningEngine } from './learningEngine';
import { aiStrategyGeneratorService } from './aiStrategyGeneratorService';

export class AIStrategyScheduler {
  private jobs: cron.ScheduledTask[] = [];

  /**
   * Initialize all scheduled jobs
   */
  initialize(): void {
    console.log('Initializing AI Strategy Scheduler...');

    // Job 1: Run pattern analysis daily at 4:00 AM IST
    const patternAnalysisJob = cron.schedule(
      '0 4 * * *',
      async () => {
        console.log('Running daily pattern analysis...');
        try {
          await learningEngine.analyzeStrategyPatterns();
          await learningEngine.analyzeBacktestResults();
          await learningEngine.analyzeLiveTradingResults();
          console.log('Pattern analysis complete');
        } catch (error) {
          console.error('Pattern analysis failed:', error);
        }
      },
      {
        scheduled: true,
        timezone: 'Asia/Kolkata',
      }
    );

    this.jobs.push(patternAnalysisJob);
    console.log('✓ Pattern analysis job scheduled (daily at 4:00 AM IST)');

    // Job 2: Generate new strategies twice weekly (Monday, Thursday at 5:00 AM IST)
    const strategyGenerationJob = cron.schedule(
      '0 5 * * 1,4',
      async () => {
        console.log('Running AI strategy generation...');
        try {
          // Generate 5 new strategies
          const strategies = await aiStrategyGeneratorService.generateStrategies(5);

          console.log(`Generated ${strategies.length} strategies`);

          // Backtest and validate each strategy
          for (const strategy of strategies) {
            console.log(`Processing strategy: ${strategy.name}`);

            // Backtest
            const backtestResults = await aiStrategyGeneratorService.backtestStrategy(
              strategy
            );

            if (!backtestResults) {
              console.log(`Backtest failed for ${strategy.name}`);
              continue;
            }

            // Validate
            const isValid = aiStrategyGeneratorService.validateStrategy(backtestResults);

            if (isValid) {
              // Publish to marketplace
              await aiStrategyGeneratorService.publishStrategy(
                strategy,
                backtestResults
              );
              console.log(`✓ Published: ${strategy.name}`);
            } else {
              console.log(`✗ Rejected: ${strategy.name} (did not meet criteria)`);
            }
          }

          console.log('Strategy generation complete');
        } catch (error) {
          console.error('Strategy generation failed:', error);
        }
      },
      {
        scheduled: true,
        timezone: 'Asia/Kolkata',
      }
    );

    this.jobs.push(strategyGenerationJob);
    console.log(
      '✓ Strategy generation job scheduled (Monday, Thursday at 5:00 AM IST)'
    );

    // Job 3: Monitor AI strategy performance daily at 4:30 PM IST (after market close)
    const monitoringJob = cron.schedule(
      '30 16 * * *',
      async () => {
        console.log('Running AI strategy performance monitoring...');
        try {
          await aiStrategyGeneratorService.monitorAIStrategies();
          console.log('Performance monitoring complete');
        } catch (error) {
          console.error('Performance monitoring failed:', error);
        }
      },
      {
        scheduled: true,
        timezone: 'Asia/Kolkata',
      }
    );

    this.jobs.push(monitoringJob);
    console.log('✓ Performance monitoring job scheduled (daily at 4:30 PM IST)');

    console.log(`AI Strategy Scheduler initialized with ${this.jobs.length} jobs`);
  }

  /**
   * Start all scheduled jobs
   */
  start(): void {
    this.jobs.forEach((job) => job.start());
    console.log('All AI strategy jobs started');
  }

  /**
   * Stop all scheduled jobs
   */
  stop(): void {
    this.jobs.forEach((job) => job.stop());
    console.log('All AI strategy jobs stopped');
  }

  /**
   * Manually trigger pattern analysis (for testing)
   */
  async triggerPatternAnalysis(): Promise<void> {
    console.log('Manually triggering pattern analysis...');
    await learningEngine.analyzeStrategyPatterns();
    await learningEngine.analyzeBacktestResults();
    await learningEngine.analyzeLiveTradingResults();
  }

  /**
   * Manually trigger strategy generation (for testing)
   */
  async triggerStrategyGeneration(count: number = 5): Promise<void> {
    console.log(`Manually triggering strategy generation (${count} strategies)...`);

    const strategies = await aiStrategyGeneratorService.generateStrategies(count);

    for (const strategy of strategies) {
      const backtestResults = await aiStrategyGeneratorService.backtestStrategy(
        strategy
      );

      if (!backtestResults) continue;

      const isValid = aiStrategyGeneratorService.validateStrategy(backtestResults);

      if (isValid) {
        await aiStrategyGeneratorService.publishStrategy(strategy, backtestResults);
        console.log(`✓ Published: ${strategy.name}`);
      } else {
        console.log(`✗ Rejected: ${strategy.name}`);
      }
    }
  }

  /**
   * Manually trigger performance monitoring (for testing)
   */
  async triggerPerformanceMonitoring(): Promise<void> {
    console.log('Manually triggering performance monitoring...');
    await aiStrategyGeneratorService.monitorAIStrategies();
  }
}

export const aiStrategyScheduler = new AIStrategyScheduler();
