
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
