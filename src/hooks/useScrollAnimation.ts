
import { useState, useEffect } from 'react';

export const useScrollAnimation = () => {
  const [isVisible, setIsVisible] = useState({
    stats: false,
    howItWorks: false,
    testimonials: false,
    cta: false
  });

  useEffect(() => {
    const handleScroll = () => {
      const stats = document.getElementById('stats');
      const howItWorks = document.getElementById('how-it-works');
      const testimonials = document.getElementById('testimonials');
      const cta = document.getElementById('cta');

      if (stats) {
        setIsVisible(prev => ({ 
          ...prev, 
          stats: isElementInViewport(stats) 
        }));
      }
      
      if (howItWorks) {
        setIsVisible(prev => ({ 
          ...prev, 
          howItWorks: isElementInViewport(howItWorks) 
        }));
      }
      
      if (testimonials) {
        setIsVisible(prev => ({ 
          ...prev, 
          testimonials: isElementInViewport(testimonials) 
        }));
      }
      
      if (cta) {
        setIsVisible(prev => ({ 
          ...prev, 
          cta: isElementInViewport(cta) 
        }));
      }
    };

    const isElementInViewport = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
      );
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
};
