
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import RankingShowcase from '@/components/RankingShowcase';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import StatsSection from '@/components/sections/StatsSection';
import CTASection from '@/components/sections/CTASection';
import QuickUserPanel from '@/components/home/QuickUserPanel';
import FeaturedJobs from '@/components/home/FeaturedJobs';
import SEOHead from '@/components/SEOHead';
import { useUser } from '@/hooks/useUser';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
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

  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const scrollTo = urlParams.get('scrollTo');
    
    if (scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div style={{ y: parallaxY, opacity }}>
              <Hero />
            </motion.div>
            
            {user && <QuickUserPanel />}
            
            <ScrollReveal>
              <div id="featured-jobs">
                <FeaturedJobs />
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <div id="features" className="py-12">
                <Features />
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <div id="ranking-system" className="py-12">
                <RankingShowcase isVisible={rankingVisible} />
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <div id="how-it-works">
                <HowItWorksSection isVisible={howItWorksVisible} />
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <div id="stats">
                <StatsSection isVisible={statsVisible} />
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <div id="testimonials">
                <TestimonialsSection isVisible={testimonialsVisible} />
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.1}>
              <div id="cta">
                <CTASection isVisible={ctaVisible} />
              </div>
            </ScrollReveal>
          </motion.div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
