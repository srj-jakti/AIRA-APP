import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChartAnalysisRequest {
  instrument: string;
  timeframe: string;
  userId: string;
  chartData?: any;
}

interface ChartAnalysis {
  instrument: string;
  timeframe: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  summary: string;
  keyPoints: string[];
  recommendations: string[];
  supportLevels: number[];
  resistanceLevels: number[];
  timestamp: Date;
}

/**
 * Analyze chart using AI
 */
export async function analyzeChart(request: ChartAnalysisRequest): Promise<ChartAnalysis> {
  const { instrument, timeframe, userId } = request;

  // In production, we would:
  // 1. Fetch actual chart data and indicators
  // 2. Get user's active strategies for context
  // 3. Analyze technical patterns

  const systemPrompt = `You are an expert technical analyst for the Indian stock market. Analyze the provided chart data and provide insights.

IMPORTANT COMPLIANCE NOTICE:
- You are providing technical analysis, NOT investment advice
- Users make their own trading decisions
- Include risk disclaimers in your analysis
- All analysis is for educational purposes only

Provide analysis in the following JSON format:
{
  "sentiment": "BULLISH | BEARISH | NEUTRAL",
  "confidence": 65-95,
  "summary": "Brief 2-3 sentence summary of the analysis",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "supportLevels": [price1, price2],
  "resistanceLevels": [price1, price2]
}`;

  const userPrompt = `Analyze ${instrument} on ${timeframe} timeframe.

Current market context:
- Instrument: ${instrument}
- Timeframe: ${timeframe}
- Analysis requested by user

Provide technical analysis based on common indicators like RSI, MACD, Moving Averages, and price action.

Return ONLY valid JSON, no additional text.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const analysis = JSON.parse(content);

    return {
      instrument,
      timeframe,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      summary: analysis.summary,
      keyPoints: analysis.keyPoints,
      recommendations: analysis.recommendations,
      supportLevels: analysis.supportLevels || [],
      resistanceLevels: analysis.resistanceLevels || [],
      timestamp: new Date(),
    };
  } catch (error: any) {
    console.error('Error analyzing chart:', error);
    
    // Return fallback analysis
    return {
      instrument,
      timeframe,
      sentiment: 'NEUTRAL',
      confidence: 50,
      summary: 'Unable to generate AI analysis at this time. Please try again later.',
      keyPoints: [
        'Technical analysis temporarily unavailable',
        'Please check back shortly',
      ],
      recommendations: [
        'Conduct your own research before trading',
        'Consult with a financial advisor',
      ],
      supportLevels: [],
      resistanceLevels: [],
      timestamp: new Date(),
    };
  }
}

/**
 * Generate market prediction
 */
export async function generateMarketPrediction(): Promise<any> {
  const systemPrompt = `You are a market analyst providing daily market outlook for the Indian stock market.

IMPORTANT COMPLIANCE NOTICE:
- This is market commentary, NOT investment advice
- Include appropriate disclaimers
- Focus on technical and fundamental factors
- Mention risks and uncertainties

Provide prediction in JSON format:
{
  "outlook": "BULLISH | BEARISH | NEUTRAL",
  "confidence": 60-85,
  "summary": "Brief market outlook",
  "factors": ["Factor 1", "Factor 2", "Factor 3"],
  "sectorsToWatch": ["Sector 1", "Sector 2"],
  "risks": ["Risk 1", "Risk 2"]
}`;

  const userPrompt = `Provide today's market outlook for Indian stock market (NIFTY 50).

Consider:
- Global market trends
- Domestic economic factors
- Technical indicators
- Market sentiment

Return ONLY valid JSON, no additional text.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error('Error generating market prediction:', error);
    throw error;
  }
}
