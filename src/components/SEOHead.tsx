import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: string;
  noIndex?: boolean;
  structuredData?: object;
}

const SEOHead = ({
  title = "FresherPools - AI-Powered Job Matching Platform for Fresh Talent",
  description = "Connect fresh talent with employers through AI-powered job matching and skill verification",
  keywords = "job search, fresher jobs, AI job matching, skill assessment, job platform, career growth, talent matching, job seekers",
  canonical,
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  type = "website",
  noIndex = false,
  structuredData
}: SEOHeadProps) => {
  const baseUrl = window.location.origin;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const fullCanonicalUrl = canonical ? `${baseUrl}${canonical}` : window.location.href;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "FresherPools",
    "description": description,
    "url": baseUrl,
    "applicationCategory": "Career Platform",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "FresherPools",
      "url": baseUrl
    },
    "featureList": [
      "AI-powered job matching",
      "Skill assessment",
      "Job matching algorithm",
      "Career growth tracking",
      "Employer connections"
    ]
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Viewport and Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* SEO Directives */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
      
      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:site_name" content="FresherPools" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@fresherpools" />
      <meta name="twitter:creator" content="@fresherpools" />
      
      {/* Additional Meta Tags for SEO */}
      <meta name="author" content="FresherPools" />
      <meta name="publisher" content="FresherPools" />
      <meta name="application-name" content="FresherPools" />
      <meta name="theme-color" content="#3B82F6" />
      <meta name="msapplication-TileColor" content="#3B82F6" />
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
      
      {/* Alternative Languages (if applicable) */}
      <link rel="alternate" hrefLang="en" href={fullCanonicalUrl} />
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
};

export default SEOHead;