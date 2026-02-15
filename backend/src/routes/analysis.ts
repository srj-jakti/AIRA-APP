import { Router, Request, Response } from 'express';
import { analyzeChart, generateMarketPrediction } from '../services/aiChartAnalysis';

const router = Router();

/**
 * Analyze chart with AI
 */
router.post('/analysis/chart', async (req: Request, res: Response) => {
  try {
    const { instrument, timeframe, userId } = req.body;

    if (!instrument || !timeframe || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Instrument, timeframe, and user ID are required',
      });
    }

    const analysis = await analyzeChart({
      instrument,
      timeframe,
      userId,
    });

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error: any) {
    console.error('Error in chart analysis:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze chart',
    });
  }
});

/**
 * Generate market prediction
 */
router.get('/analysis/market-prediction', async (req: Request, res: Response) => {
  try {
    const prediction = await generateMarketPrediction();

    res.json({
      success: true,
      data: prediction,
    });
  } catch (error: any) {
    console.error('Error generating market prediction:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate market prediction',
    });
  }
});

export { router as analysisRouter };
