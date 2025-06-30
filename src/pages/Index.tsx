
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import RankingShowcase from '@/components/RankingShowcase';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import StatsSection from '@/components/sections/StatsSection';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/Footer';
import { 
  useStatsAnimation, 
  useHowItWorksAnimation, 
  useTestimonialsAnimation, 
  useCTAAnimation,
  useRankingAnimation
} from '@/hooks/useScrollAnimation';

const Index = () => {
  const [heroVisible, setHeroVisible] = useState(false);
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
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero />
        <div id="features">
          <Features />
        </div>
        <div id="ranking-system">
          <RankingShowcase isVisible={rankingVisible} />
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
        <Footer />
      </motion.div>
    </div>
  );
};

export default Index;
