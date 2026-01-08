import { useState, useEffect, useCallback } from 'react';
import { useUser } from './useUser';
import { supabase } from '@/integrations/supabase/client';

const FREE_RESUME_LIMIT = 1;
const getStorageKey = (userId?: string) => `resume_downloads_${userId || 'anonymous'}`;

export type TailoringStrength = 'light' | 'moderate' | 'strong';

interface ResumeDownload {
  id: string;
  date: string;
  template: string;
}

interface PremiumStatus {
  type: 'single' | 'unlimited' | null;
  remainingDownloads: number;
  expiresAt: string | null;
}

export const useResumeLimit = () => {
  const { user, profile, refreshUser } = useUser();
  const [downloads, setDownloads] = useState<ResumeDownload[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    type: null,
    remainingDownloads: 0,
    expiresAt: null,
  });
  
  // Check if user is admin
  const isAdmin = profile?.user_type === 'admin';

  // Fetch premium status from database
  const fetchPremiumStatus = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('is_premium, resume_premium_type, resume_premium_downloads_remaining, resume_premium_expires_at')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching premium status:', error);
        return;
      }

      if (data) {
        const now = new Date();
        const expiresAt = data.resume_premium_expires_at ? new Date(data.resume_premium_expires_at) : null;
        const isExpired = expiresAt && expiresAt < now;

        if (data.is_premium && !isExpired) {
          setIsPremium(true);
          setPremiumStatus({
            type: data.resume_premium_type as 'single' | 'unlimited' | null,
            remainingDownloads: data.resume_premium_downloads_remaining ?? 0,
            expiresAt: data.resume_premium_expires_at,
          });
        } else {
          setIsPremium(false);
          setPremiumStatus({
            type: null,
            remainingDownloads: 0,
            expiresAt: null,
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch premium status:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    // Load downloads from localStorage using user-specific key
    const storageKey = getStorageKey(user?.id);
    const stored = localStorage.getItem(storageKey);
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
        localStorage.setItem(storageKey, JSON.stringify(recentDownloads));
      } catch (e) {
        setDownloads([]);
      }
    } else {
      // Reset downloads for new/different user
      setDownloads([]);
    }

    // Fetch premium status from DB
    fetchPremiumStatus();
  }, [fetchPremiumStatus, profile, user?.id]);

  // Determine if user can download based on their plan
  const canDownload = (() => {
    // Admin users have unlimited downloads
    if (isAdmin) {
      return true;
    }
    
    if (!isPremium) {
      // Free user: check download limit
      return downloads.length < FREE_RESUME_LIMIT;
    }
    
    // Premium user
    if (premiumStatus.type === 'unlimited') {
      // Unlimited plan: always can download
      return true;
    }
    
    if (premiumStatus.type === 'single') {
      // Single plan: check remaining downloads
      return premiumStatus.remainingDownloads > 0;
    }
    
    // Fallback
    return downloads.length < FREE_RESUME_LIMIT;
  })();

  // Calculate remaining downloads
  const remainingDownloads = (() => {
    // Admin users have unlimited downloads
    if (isAdmin) {
      return Infinity;
    }
    
    if (!isPremium) {
      return Math.max(0, FREE_RESUME_LIMIT - downloads.length);
    }
    
    if (premiumStatus.type === 'unlimited') {
      return Infinity;
    }
    
    if (premiumStatus.type === 'single') {
      return premiumStatus.remainingDownloads;
    }
    
    return Math.max(0, FREE_RESUME_LIMIT - downloads.length);
  })();

  const recordDownload = async (template: string) => {
    const storageKey = getStorageKey(user?.id);
    const newDownload: ResumeDownload = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      template,
    };
    const updated = [...downloads, newDownload];
    setDownloads(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    // If single plan, decrement remaining downloads in DB
    if (isPremium && premiumStatus.type === 'single' && user?.id) {
      try {
        const newRemaining = Math.max(0, premiumStatus.remainingDownloads - 1);
        await supabase
          .from('users')
          .update({ resume_premium_downloads_remaining: newRemaining })
          .eq('id', user.id);
        
        setPremiumStatus(prev => ({
          ...prev,
          remainingDownloads: newRemaining,
        }));
        
        console.log('Decremented single plan downloads, remaining:', newRemaining);
      } catch (err) {
        console.error('Failed to update remaining downloads:', err);
      }
    }
  };

  const upgradeToPremium = useCallback(async () => {
    // Refresh user profile from Supabase to get the updated premium status from DB
    try {
      await refreshUser();
      await fetchPremiumStatus();
      console.log('User profile refreshed after premium upgrade');
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
    }
  }, [refreshUser, fetchPremiumStatus]);

  return {
    canDownload,
    remainingDownloads,
    downloadCount: downloads.length,
    isPremium,
    isAdmin,
    premiumType: premiumStatus.type,
    premiumExpiresAt: premiumStatus.expiresAt,
    recordDownload,
    upgradeToPremium,
    refreshPremiumStatus: fetchPremiumStatus,
  };
};
