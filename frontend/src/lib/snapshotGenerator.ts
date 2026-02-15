/**
 * Snapshot Generator for AI Analysis Sharing
 * Generates shareable images with chart, analysis, and AIRA branding
 */

interface SnapshotData {
  instrument: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  summary: string;
  keyPoints: string[];
  recommendation: string;
  timestamp: Date;
}

interface SnapshotOptions {
  includeChart?: boolean;
  includeBranding?: boolean;
  includeDisclaimer?: boolean;
  theme?: 'light' | 'dark';
}

/**
 * Generate a snapshot image from analysis data
 * In production, this would use canvas or a server-side image generation service
 */
export async function generateSnapshot(
  data: SnapshotData,
  options: SnapshotOptions = {}
): Promise<Blob> {
  const {
    includeChart = true,
    includeBranding = true,
    includeDisclaimer = true,
    theme = 'light',
  } = options;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 1080; // Instagram optimal size
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Background
  ctx.fillStyle = theme === 'dark' ? '#1F2937' : '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // AIRA Branding (top)
  if (includeBranding) {
    ctx.fillStyle = theme === 'dark' ? '#FFFFFF' : '#1F2937';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('AIRA', 40, 80);
    ctx.font = '24px Arial';
    ctx.fillStyle = '#6B7280';
    ctx.fillText('AI Trading Platform', 40, 115);
  }

  // Instrument name
  ctx.fillStyle = theme === 'dark' ? '#FFFFFF' : '#1F2937';
  ctx.font = 'bold 36px Arial';
  ctx.fillText(data.instrument, 40, 180);

  // Sentiment badge
  const sentimentColor =
    data.sentiment === 'bullish'
      ? '#10B981'
      : data.sentiment === 'bearish'
      ? '#EF4444'
      : '#6B7280';
  ctx.fillStyle = sentimentColor;
  ctx.fillRect(40, 200, 200, 50);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Arial';
  ctx.fillText(data.sentiment.toUpperCase(), 60, 235);

  // Confidence
  ctx.fillStyle = theme === 'dark' ? '#FFFFFF' : '#1F2937';
  ctx.font = '20px Arial';
  ctx.fillText(`Confidence: ${data.confidence}%`, 260, 235);

  // Summary
  ctx.font = '22px Arial';
  ctx.fillStyle = theme === 'dark' ? '#D1D5DB' : '#374151';
  const summaryLines = wrapText(ctx, data.summary, canvas.width - 80, 22);
  let yPos = 300;
  summaryLines.forEach((line) => {
    ctx.fillText(line, 40, yPos);
    yPos += 30;
  });

  // Key Points
  yPos += 20;
  ctx.font = 'bold 24px Arial';
  ctx.fillStyle = theme === 'dark' ? '#FFFFFF' : '#1F2937';
  ctx.fillText('Key Points:', 40, yPos);
  yPos += 40;

  ctx.font = '20px Arial';
  ctx.fillStyle = theme === 'dark' ? '#D1D5DB' : '#374151';
  data.keyPoints.slice(0, 3).forEach((point) => {
    // Draw bullet
    ctx.fillStyle = '#3B82F6';
    ctx.beginPath();
    ctx.arc(50, yPos - 7, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw text
    ctx.fillStyle = theme === 'dark' ? '#D1D5DB' : '#374151';
    const pointLines = wrapText(ctx, point, canvas.width - 120, 20);
    pointLines.forEach((line) => {
      ctx.fillText(line, 70, yPos);
      yPos += 28;
    });
    yPos += 10;
  });

  // Recommendation
  yPos += 20;
  ctx.fillStyle = '#DBEAFE';
  ctx.fillRect(40, yPos, canvas.width - 80, 100);
  ctx.fillStyle = '#1E40AF';
  ctx.font = 'bold 20px Arial';
  ctx.fillText('Recommendation:', 60, yPos + 35);
  ctx.font = '18px Arial';
  const recLines = wrapText(ctx, data.recommendation, canvas.width - 120, 18);
  let recYPos = yPos + 65;
  recLines.forEach((line) => {
    ctx.fillText(line, 60, recYPos);
    recYPos += 25;
  });

  // Disclaimer
  if (includeDisclaimer) {
    yPos = canvas.height - 120;
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(40, yPos, canvas.width - 80, 80);
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('DISCLAIMER:', 60, yPos + 25);
    ctx.font = '14px Arial';
    const disclaimer =
      'AI-generated analysis for informational purposes only. Not financial advice.';
    const disclaimerLines = wrapText(ctx, disclaimer, canvas.width - 120, 14);
    let disclaimerYPos = yPos + 45;
    disclaimerLines.forEach((line) => {
      ctx.fillText(line, 60, disclaimerYPos);
      disclaimerYPos += 20;
    });
  }

  // Timestamp
  ctx.fillStyle = '#6B7280';
  ctx.font = '14px Arial';
  ctx.fillText(
    `Generated: ${data.timestamp.toLocaleString()}`,
    40,
    canvas.height - 20
  );

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to generate snapshot'));
      }
    }, 'image/png');
  });
}

/**
 * Wrap text to fit within a specified width
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Generate share URLs for different platforms
 */
export function generateShareUrls(
  instrument: string,
  sentiment: string,
  imageUrl?: string
): Record<string, string> {
  const text = `Check out this AI analysis for ${instrument} - ${sentiment.toUpperCase()} signal! 📈 #AIRA #Trading #AI`;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = imageUrl ? encodeURIComponent(imageUrl) : '';

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}${imageUrl ? `&url=${encodedUrl}` : ''}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    whatsapp: `https://wa.me/?text=${encodedText}${imageUrl ? ` ${encodedUrl}` : ''}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    // Instagram doesn't support direct sharing via URL, needs to be handled differently
    instagram: '', // Will be handled via mobile share API or download
  };
}

/**
 * Download snapshot as image file
 */
export function downloadSnapshot(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Share snapshot using Web Share API (for mobile)
 */
export async function shareSnapshot(
  blob: Blob,
  data: SnapshotData
): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }

  try {
    const file = new File([blob], `aira-analysis-${data.instrument}.png`, {
      type: 'image/png',
    });

    await navigator.share({
      title: `AIRA Analysis - ${data.instrument}`,
      text: `AI analysis for ${data.instrument} - ${data.sentiment.toUpperCase()} signal`,
      files: [file],
    });

    return true;
  } catch (error) {
    console.error('Error sharing:', error);
    return false;
  }
}
