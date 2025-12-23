import { useState, useEffect } from 'react';
import { useUser } from './useUser';

const FREE_RESUME_LIMIT = 2;
const STORAGE_KEY = 'resume_downloads';

interface ResumeDownload {
  id: string;
  date: string;
  template: string;
}

export const useResumeLimit = () => {
  const { user, profile } = useUser();
  const [downloads, setDownloads] = useState<ResumeDownload[]>([]);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Load downloads from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Filter to only downloads from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentDownloads = parsed.filter((d: ResumeDownload) => 
          new Date(d.date) > thirtyDaysAgo
        );
        setDownloads(recentDownloads);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentDownloads));
      } catch (e) {
        setDownloads([]);
      }
    }

    // Check premium status
    if (profile?.is_premium) {
      setIsPremium(true);
    }

    // Check localStorage for premium upgrade
    const premiumStatus = localStorage.getItem('resume_premium_status');
    if (premiumStatus === 'active') {
      setIsPremium(true);
    }
  }, [profile]);

  const canDownload = isPremium || downloads.length < FREE_RESUME_LIMIT;
  const remainingDownloads = isPremium ? Infinity : Math.max(0, FREE_RESUME_LIMIT - downloads.length);

  const recordDownload = (template: string) => {
    const newDownload: ResumeDownload = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      template,
    };
    const updated = [...downloads, newDownload];
    setDownloads(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const upgradeToPremium = () => {
    setIsPremium(true);
    localStorage.setItem('resume_premium_status', 'active');
    // Also set expiry date for 1 year
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    localStorage.setItem('resume_premium_expiry', expiryDate.toISOString());
  };

  return {
    canDownload,
    remainingDownloads,
    downloadCount: downloads.length,
    isPremium,
    recordDownload,
    upgradeToPremium,
  };
};
