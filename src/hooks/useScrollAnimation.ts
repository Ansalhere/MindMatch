
import { useState, useEffect } from 'react';

export function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState({
    stats: false,
    howItWorks: false,
    testimonials: false,
    cta: false,
    ranking: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const stats = document.getElementById('stats');
      const howItWorks = document.getElementById('how-it-works');
      const testimonials = document.getElementById('testimonials');
      const cta = document.getElementById('cta');
      const ranking = document.getElementById('ranking-system');

      const windowHeight = window.innerHeight;
      const revealPoint = 150;

      if (stats) {
        const statsTop = stats.getBoundingClientRect().top;
        setIsVisible(prev => ({ 
          ...prev, 
          stats: statsTop < windowHeight - revealPoint 
        }));
      }

      if (howItWorks) {
        const howItWorksTop = howItWorks.getBoundingClientRect().top;
        setIsVisible(prev => ({ 
          ...prev, 
          howItWorks: howItWorksTop < windowHeight - revealPoint 
        }));
      }

      if (testimonials) {
        const testimonialsTop = testimonials.getBoundingClientRect().top;
        setIsVisible(prev => ({ 
          ...prev, 
          testimonials: testimonialsTop < windowHeight - revealPoint 
        }));
      }

      if (cta) {
        const ctaTop = cta.getBoundingClientRect().top;
        setIsVisible(prev => ({ 
          ...prev, 
          cta: ctaTop < windowHeight - revealPoint 
        }));
      }

      if (ranking) {
        const rankingTop = ranking.getBoundingClientRect().top;
        setIsVisible(prev => ({ 
          ...prev, 
          ranking: rankingTop < windowHeight - revealPoint 
        }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}
