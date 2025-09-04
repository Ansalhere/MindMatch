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
  title = "RankMe.AI - The World's First Skill-Based Ranking Platform for Job Seekers",
  description = "Join RankMe.AI and boost your career with our AI-powered skill ranking system. Showcase your expertise, get ranked by top employers, and land your dream job faster.",
  keywords = "skill ranking, job search, AI career platform, skill assessment, professional ranking, job matching, career growth, skill verification, talent ranking, job seekers",
  canonical,
  image = "/og-image.jpg",
  type = "website",
  noIndex = false,
  structuredData
}: SEOHeadProps) => {
  const baseUrl = "https://rankme.ai";
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const fullCanonicalUrl = canonical ? `${baseUrl}${canonical}` : `${baseUrl}${window.location.pathname}`;

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "RankMe.AI",
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
      "name": "RankMe.AI",
      "url": baseUrl
    },
    "featureList": [
      "AI-powered skill ranking",
      "Professional skill assessment",
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
      <meta property="og:site_name" content="RankMe.AI" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@RankMeAI" />
      <meta name="twitter:creator" content="@RankMeAI" />
      
      {/* Additional Meta Tags for SEO */}
      <meta name="author" content="RankMe.AI" />
      <meta name="publisher" content="RankMe.AI" />
      <meta name="application-name" content="RankMe.AI" />
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