-- Add last_login_date and login_streak to referral_rewards for daily login tracking
ALTER TABLE public.referral_rewards 
ADD COLUMN IF NOT EXISTS last_login_date DATE,
ADD COLUMN IF NOT EXISTS login_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_login_points INTEGER DEFAULT 0;

-- Create function to award daily login points
CREATE OR REPLACE FUNCTION public.award_daily_login_points(user_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  reward_record RECORD;
  points_awarded INTEGER := 0;
  streak_bonus INTEGER := 0;
  result JSONB;
BEGIN
  -- Get or create referral_rewards record
  INSERT INTO public.referral_rewards (user_id, referral_points, total_referrals)
  VALUES (user_id_param, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Get current reward record
  SELECT * INTO reward_record 
  FROM public.referral_rewards 
  WHERE user_id = user_id_param;
  
  -- Check if already logged in today
  IF reward_record.last_login_date = CURRENT_DATE THEN
    RETURN jsonb_build_object(
      'already_claimed', true,
      'points_awarded', 0,
      'total_points', reward_record.referral_points,
      'streak', reward_record.login_streak
    );
  END IF;
  
  -- Base daily login points
  points_awarded := 1;
  
  -- Calculate streak
  IF reward_record.last_login_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day - increment streak
    streak_bonus := LEAST((reward_record.login_streak + 1) / 7, 2); -- Bonus point every 7 days, max 2
    points_awarded := points_awarded + streak_bonus;
    
    UPDATE public.referral_rewards
    SET 
      referral_points = referral_points + points_awarded,
      daily_login_points = daily_login_points + points_awarded,
      last_login_date = CURRENT_DATE,
      login_streak = login_streak + 1,
      updated_at = NOW()
    WHERE user_id = user_id_param;
  ELSE
    -- Streak broken or first login
    UPDATE public.referral_rewards
    SET 
      referral_points = referral_points + points_awarded,
      daily_login_points = daily_login_points + points_awarded,
      last_login_date = CURRENT_DATE,
      login_streak = 1,
      updated_at = NOW()
    WHERE user_id = user_id_param;
  END IF;
  
  -- Get updated record
  SELECT * INTO reward_record 
  FROM public.referral_rewards 
  WHERE user_id = user_id_param;
  
  RETURN jsonb_build_object(
    'already_claimed', false,
    'points_awarded', points_awarded,
    'total_points', reward_record.referral_points,
    'streak', reward_record.login_streak,
    'streak_bonus', streak_bonus
  );
END;
$$;