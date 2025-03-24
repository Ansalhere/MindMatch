
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import StatsSection from '../components/sections/StatsSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import CTASection from '../components/sections/CTASection';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import RankingShowcase from '../components/RankingShowcase';

const Index = () => {
  const isVisible = useScrollAnimation();
  const location = useLocation();
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const rankingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Handle scroll to section when redirected from another page or when hash is present
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        const section = document.getElementById(location.state.scrollTo);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (location.hash) {
      // Also handle direct URL with hash
      const sectionId = location.hash.substring(1); // Remove the # character
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.state, location.hash]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <div id="stats" ref={statsRef}>
          <StatsSection isVisible={isVisible.stats} />
        </div>
        <Features />
        <div id="ranking-system" ref={rankingRef}>
          <RankingShowcase isVisible={isVisible.ranking} />
        </div>
        <div id="how-it-works" ref={howItWorksRef}>
          <HowItWorksSection isVisible={isVisible.howItWorks} />
        </div>
        <div id="testimonials" ref={testimonialsRef}>
          <TestimonialsSection isVisible={isVisible.testimonials} />
        </div>
        <div id="cta" ref={ctaRef}>
          <CTASection isVisible={isVisible.cta} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
