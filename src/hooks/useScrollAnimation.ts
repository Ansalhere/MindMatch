
import { useState, useEffect } from 'react';

export function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('[data-scroll-target]');
      if (!element) return;

      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const revealPoint = 150;

      setIsVisible(elementTop < windowHeight - revealPoint);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}

// Create separate hooks for each section
export function useStatsAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const stats = document.getElementById('stats');
      if (!stats) return;

      const statsTop = stats.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const revealPoint = 150;

      setIsVisible(statsTop < windowHeight - revealPoint);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}

export function useHowItWorksAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('how-it-works');
      if (!element) return;

      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const revealPoint = 150;

      setIsVisible(elementTop < windowHeight - revealPoint);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}

export function useTestimonialsAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('testimonials');
      if (!element) return;

      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const revealPoint = 150;

      setIsVisible(elementTop < windowHeight - revealPoint);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}

export function useCTAAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('cta');
      if (!element) return;

      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const revealPoint = 150;

      setIsVisible(elementTop < windowHeight - revealPoint);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}

export function useRankingAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('ranking-system');
      if (!element) return;

      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      const revealPoint = 150;

      setIsVisible(elementTop < windowHeight - revealPoint);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isVisible;
}
