import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';

export function usePremiumFeatures() {
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(false);
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) return;
      
      // Check if user has premium through referrals
      const { data: rewards } = await supabase
        .from('referral_rewards')
        .select('premium_unlocked, total_referrals')
        .eq('user_id', user.id)
        .maybeSingle();
      
      const hasReferralPremium = rewards?.premium_unlocked || (rewards?.total_referrals || 0) >= 3;
      setReferralCount(rewards?.total_referrals || 0);
      
      // Check database premium status or referral premium
      setIsPremium(user.is_premium || hasReferralPremium || true); // Keep inaugural offer
    };
    
    checkPremiumStatus();
  }, [user]);

  const features = {
    // Employer premium features
    viewAllContactDetails: isPremium,
    accessToAllCandidates: isPremium,
    advancedFiltering: isPremium,
    prioritySupport: isPremium,
    
    // Candidate premium features
    unlimitedApplications: isPremium,
    premiumJobRecommendations: isPremium,
    priorityInSearch: isPremium,
    advancedSkillAssessments: isPremium,
    
    // General premium features
    exportData: isPremium,
    analytics: isPremium,
    customBranding: isPremium
  };

  return {
    isPremium,
    features,
    referralCount,
    remainingDays: 90,
    offerMessage: referralCount >= 3 
      ? "🎉 Premium Unlocked via Referrals!" 
      : "🎉 Inaugural Offer: Premium features free for 3 months!"
  };
}