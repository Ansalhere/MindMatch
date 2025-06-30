
import { useState, useEffect } from 'react';

export function useScrollAnimation(targetId?: string) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      let element;
      
      if (targetId) {
        element = document.getElementById(targetId);
      } else {
        element = document.querySelector('[data-scroll-target]');
      }
      
      if (!element) return;

      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const revealPoint = 150;

      setIsVisible(elementTop < windowHeight - revealPoint);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [targetId]);

  return isVisible;
}

// Create separate hooks for each section
export function useStatsAnimation() {
  return useScrollAnimation('stats');
}

export function useHowItWorksAnimation() {
  return useScrollAnimation('how-it-works');
}

export function useTestimonialsAnimation() {
  return useScrollAnimation('testimonials');
}

export function useCTAAnimation() {
  return useScrollAnimation('cta');
}

export function useRankingAnimation() {
  return useScrollAnimation('ranking-system');
}

export function useFeaturesAnimation() {
  return useScrollAnimation('features');
}
