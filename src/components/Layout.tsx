
import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  keywords?: string;
}

const Layout = ({ 
  children, 
  className = '',
  title = "RankMe.AI - AI-Powered Professional Ranking Platform",
  description = "Boost your career with RankMe.AI's intelligent ranking system. Get ranked, discover opportunities, and connect with top employers worldwide.",
  keywords = "ranking platform, AI career, professional network, job matching, skill assessment, career growth"
}: LayoutProps) => {
  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "RankMe.AI",
            "description": description,
            "url": typeof window !== 'undefined' ? window.location.origin : '',
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web Browser"
          })}
        </script>
      </Helmet>
      
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'hsl(var(--background))',
            color: 'hsl(var(--foreground))',
            border: '1px solid hsl(var(--border))',
          },
        }}
      />
    </div>
  );
};

export default Layout;
