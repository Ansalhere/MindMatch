
import { useEffect } from 'react';
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

const Index = () => {
  const isVisible = useScrollAnimation();
  const location = useLocation();

  useEffect(() => {
    // Handle scroll to section when redirected from another page
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        const section = document.getElementById(location.state.scrollTo);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <StatsSection isVisible={isVisible.stats} />
        <Features />
        <HowItWorksSection isVisible={isVisible.howItWorks} />
        <TestimonialsSection isVisible={isVisible.testimonials} />
        <CTASection isVisible={isVisible.cta} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
