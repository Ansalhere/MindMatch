import { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';

export function usePremiumFeatures() {
  const { user } = useUser();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Temporary: Enable premium for everyone for 3 months (inaugural offer)
    // This simulates premium access for all users
    if (user) {
      setIsPremium(true);
    }
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
    remainingDays: 90, // 3 months inaugural offer
    offerMessage: "🎉 Inaugural Offer: Premium features free for 3 months!"
  };
}