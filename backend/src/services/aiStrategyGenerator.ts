import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface StrategyGenerationRequest {
  description: string;
  category?: 'SCALPING' | 'INTRADAY' | 'SWING' | 'INVESTMENT';
  userId: string;
}

interface GeneratedStrategy {
  name: string;
  description: string;
  category: string;
  entryConditions: any;
  exitConditions: any;
  stopLoss: any;
  target: any;
  trailingStopLoss: any;
  trailingTarget: any;
}

/**
 * Generate trading strategy from natural language description using OpenAI GPT-4
 */
export async function generateStrategyFromDescription(
  request: StrategyGenerationRequest
): Promise<GeneratedStrategy> {
  const { description, category } = request;

  const systemPrompt = `You are an expert trading strategy designer for the Indian stock market. Your task is to convert natural language descriptions into structured trading strategies.

IMPORTANT COMPLIANCE NOTICE:
- You are a tool that helps users create strategies
- You do NOT provide investment advice
- All strategies must include risk disclaimers
- Users are responsible for their own trading decisions

Generate a JSON response with the following structure:
{
  "name": "Strategy name (max 50 chars)",
  "description": "Detailed description of the strategy",
  "category": "SCALPING | INTRADAY | SWING | INVESTMENT",
  "entryConditions": {
    "indicators": [{"name": "RSI", "period": 14, "condition": "below", "value": 30}],
    "priceAction": "description of price action conditions",
    "timeframe": "1min | 5min | 15min | 1hour | 1day"
  },
  "exitConditions": {
    "indicators": [{"name": "RSI", "period": 14, "condition": "above", "value": 70}],
    "priceAction": "description of exit conditions"
  },
  "stopLoss": {
    "type": "percentage | points | atr",
    "value": 2.0,
    "description": "Stop loss at 2% below entry"
  },
  "target": {
    "type": "percentage | points | atr",
    "value": 4.0,
    "description": "Target at 4% above entry"
  },
  "trailingStopLoss": {
    "enabled": true,
    "type": "percentage | points",
    "value": 1.0,
    "triggerAt": 2.0
  },
  "trailingTarget": {
    "enabled": false
  }
}

Common indicators: RSI, MACD, EMA, SMA, Bollinger Bands, ATR, Stochastic, ADX, Volume
Ensure the strategy is realistic and follows sound trading principles.`;

  const userPrompt = `Create a ${category || 'trading'} strategy based on this description:

${description}

Return ONLY valid JSON, no additional text.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const strategy = JSON.parse(content) as GeneratedStrategy;

    // Validate required fields
    if (!strategy.name || !strategy.category || !strategy.entryConditions) {
      throw new Error('Invalid strategy structure from AI');
    }

    // Override category if specified
    if (category) {
      strategy.category = category;
    }

    return strategy;
  } catch (error: any) {
    console.error('Error generating strategy:', error);
    throw new Error(`Failed to generate strategy: ${error.message}`);
  }
}

/**
 * Validate generated strategy structure
 */
export function validateStrategyStructure(strategy: GeneratedStrategy): boolean {
  // Check required fields
  if (!strategy.name || strategy.name.length > 50) {
    return false;
  }

  if (!strategy.category || !['SCALPING', 'INTRADAY', 'SWING', 'INVESTMENT'].includes(strategy.category)) {
    return false;
  }

  if (!strategy.entryConditions || typeof strategy.entryConditions !== 'object') {
    return false;
  }

  if (!strategy.exitConditions || typeof strategy.exitConditions !== 'object') {
    return false;
  }

  // Validate stop loss and target
  if (!strategy.stopLoss || !strategy.target) {
    return false;
  }

  return true;
}
