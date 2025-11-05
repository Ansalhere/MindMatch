import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DailyLoginResult {
  alreadyClaimed: boolean;
  pointsAwarded: number;
  totalPoints: number;
  streak: number;
  streakBonus?: number;
}

export const useDailyLogin = () => {
  const { user } = useUser();
  const [loginResult, setLoginResult] = useState<DailyLoginResult | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkDailyLogin = async () => {
      if (!user?.id || hasChecked) return;
      
      try {
        // Call the database function to award daily login points
        const { data, error } = await supabase.rpc('award_daily_login_points', {
          user_id_param: user.id
        });

        if (error) throw error;
        
        // Type assertion since we know the structure
        const resultData = data as any;

        const result: DailyLoginResult = {
          alreadyClaimed: resultData.already_claimed || false,
          pointsAwarded: resultData.points_awarded || 0,
          totalPoints: resultData.total_points || 0,
          streak: resultData.streak || 0,
          streakBonus: resultData.streak_bonus || 0
        };

        setLoginResult(result);
        setHasChecked(true);

        // Show toast if points were awarded
        if (!result.alreadyClaimed && result.pointsAwarded > 0) {
          const streakMessage = result.streak > 1 
            ? ` (${result.streak} day streak!)` 
            : '';
          
          toast.success(`Daily Login Bonus! +${result.pointsAwarded} point${result.pointsAwarded > 1 ? 's' : ''}${streakMessage}`, {
            description: result.streakBonus && result.streakBonus > 0 
              ? `Streak bonus: +${result.streakBonus} points!` 
              : undefined,
            duration: 5000
          });
        }
      } catch (error) {
        console.error('Error checking daily login:', error);
      }
    };

    checkDailyLogin();
  }, [user?.id, hasChecked]);

  return { loginResult, hasChecked };
};
