
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import RankingShowcase from '@/components/RankingShowcase';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import StatsSection from '@/components/sections/StatsSection';
import CTASection from '@/components/sections/CTASection';
import RankingDetailsSection from '@/components/sections/RankingDetailsSection';
import QuickUserPanel from '@/components/home/QuickUserPanel';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import SEOHead from '@/components/SEOHead';
import { useUser } from '@/hooks/useUser';
import { 
  useStatsAnimation, 
  useHowItWorksAnimation, 
  useTestimonialsAnimation, 
  useCTAAnimation,
  useRankingAnimation
} from '@/hooks/useScrollAnimation';

const Index = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const { user } = useUser();
  const rankingVisible = useRankingAnimation();
  const howItWorksVisible = useHowItWorksAnimation();
  const testimonialsVisible = useTestimonialsAnimation();
  const statsVisible = useStatsAnimation();
  const ctaVisible = useCTAAnimation();

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle scroll-to-section functionality from navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const scrollTo = urlParams.get('scrollTo');
    
    if (scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Clean up URL after scrolling
          window.history.replaceState({}, '', window.location.pathname);
        }
      }, 500);
    }
  }, []);

  return (
    <>
      <SEOHead
        title="RankMe.AI - The World's First Skill-Based Ranking Platform for Job Seekers"
        description="Join RankMe.AI and boost your career with our AI-powered skill ranking system. Showcase your expertise, get ranked by top employers, and land your dream job faster."
        keywords="skill ranking, job search, AI career platform, skill assessment, professional ranking, job matching, career growth"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "RankMe.AI",
          "description": "The world's first skill-based ranking platform for job seekers",
          "url": "https://rankme.ai",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://rankme.ai/jobs?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Hero />
            {user && <QuickUserPanel />}
            <div id="featured-jobs">
              <FeaturedJobs />
            </div>
            <div id="features" className="py-12">
              <Features />
            </div>
            <div id="ranking-system" className="py-12">
              <RankingShowcase isVisible={rankingVisible} />
            </div>
            <div id="ranking-details">
              <RankingDetailsSection isVisible={rankingVisible} />
            </div>
            <div id="how-it-works">
              <HowItWorksSection isVisible={howItWorksVisible} />
            </div>
            <div id="stats">
              <StatsSection isVisible={statsVisible} />
            </div>
            <div id="testimonials">
              <TestimonialsSection isVisible={testimonialsVisible} />
            </div>
            <div id="cta">
              <CTASection isVisible={ctaVisible} />
            </div>
          </motion.div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
