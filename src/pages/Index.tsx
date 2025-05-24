
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
  const featuresVisible = useStatsAnimation(); // Reuse for features
  const rankingVisible = useRankingAnimation();
  const howItWorksVisible = useHowItWorksAnimation();
  const testimonialsVisible = useTestimonialsAnimation();
  const statsVisible = useStatsAnimation();
  const ctaVisible = useCTAAnimation();

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Hero isVisible={heroVisible} />
        <Features isVisible={featuresVisible} />
        <RankingShowcase isVisible={rankingVisible} />
        <HowItWorksSection isVisible={howItWorksVisible} />
        <StatsSection isVisible={statsVisible} />
        <TestimonialsSection isVisible={testimonialsVisible} />
        <CTASection isVisible={ctaVisible} />
        <Footer />
      </motion.div>
    </div>
  );
};

export default Index;
