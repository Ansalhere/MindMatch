import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const useReferralTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get('ref');
    
    if (refCode) {
      // Store referral code in localStorage for signup
      localStorage.setItem('referralCode', refCode);
    }
  }, [location]);

  const completeReferral = async (newUserId: string) => {
    const refCode = localStorage.getItem('referralCode');
    
    if (refCode) {
      try {
        // Find the referral and update it
        const { error } = await supabase
          .from('referrals')
          .update({
            referred_user_id: newUserId,
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('referral_code', refCode)
          .eq('status', 'pending');
        
        if (error) console.error('Error completing referral:', error);
        
        // Clear the referral code
        localStorage.removeItem('referralCode');
      } catch (error) {
        console.error('Error in completeReferral:', error);
      }
    }
  };

  return { completeReferral };
};
