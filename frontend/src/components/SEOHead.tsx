import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

export default function SEOHead({
  title = 'AIRA - AI-Powered Trading Platform',
  description = 'AIRA is an AI-powered trading platform for automated strategy creation, backtesting, and execution. Trade smarter with AI-driven insights and real-time market analysis.',
  keywords = 'AI trading, automated trading, trading platform, stock trading, algorithmic trading, trading strategies, backtesting, market analysis, Zerodha, Indian stock market',
  ogImage = '/og-image.png',
  ogType = 'website',
  canonicalUrl,
  noindex = false,
}: SEOHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aira.trading';
  const fullTitle = title.includes('AIRA') ? title : `${title} | AIRA`;
  const canonical = canonicalUrl || siteUrl;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="AIRA" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="author" content="AIRA" />
      
      {/* Language */}
      <meta httpEquiv="content-language" content="en" />
      <link rel="alternate" hrefLang="en" href={canonical} />
      <link rel="alternate" hrefLang="hi" href={`${canonical}?lang=hi`} />
    </Head>
  );
}
