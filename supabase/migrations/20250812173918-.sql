-- Create contact/messaging system
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  conversation_id UUID
);

-- Create notifications system
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  related_id UUID,
  related_type TEXT
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can view their own messages" 
ON public.messages 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" 
ON public.messages 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they received" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() = receiver_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add college tier to education table for improved ranking
ALTER TABLE public.education ADD COLUMN college_tier INTEGER DEFAULT 3;

-- Update ranking function to include college tier
CREATE OR REPLACE FUNCTION public.calculate_candidate_rank(user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    rank_score NUMERIC(5,2) := 0;
    skill_count INTEGER;
    cert_count INTEGER;
    exp_years NUMERIC(5,2) := 0;
    education_score NUMERIC(5,2) := 0;
    profile_completion NUMERIC(5,2) := 0;
BEGIN
    -- Count skills and their levels (40% weight)
    SELECT COUNT(*), COALESCE(SUM(level * 4 + experience_years * 2), 0)
    INTO skill_count, rank_score
    FROM public.skills
    WHERE user_id = calculate_candidate_rank.user_id;
    
    -- Add points for certifications (15% weight)
    SELECT COUNT(*) * 10
    INTO cert_count
    FROM public.certifications
    WHERE user_id = calculate_candidate_rank.user_id;
    
    rank_score := rank_score + cert_count;
    
    -- Calculate experience years (25% weight)
    SELECT COALESCE(SUM(
        CASE
            WHEN is_current = true THEN 
                EXTRACT(YEAR FROM AGE(CURRENT_DATE, start_date))
            ELSE
                EXTRACT(YEAR FROM AGE(end_date, start_date))
        END
    ), 0) * 15
    INTO exp_years
    FROM public.experiences
    WHERE user_id = calculate_candidate_rank.user_id;
    
    rank_score := rank_score + exp_years;
    
    -- Add points for education with college tier bonus (15% weight)
    SELECT COALESCE(SUM(
        (5 - COALESCE(tier, 3)) * 8 + 
        (5 - COALESCE(college_tier, 3)) * 12 + 
        COALESCE(gpa, 0) * 3
    ), 0)
    INTO education_score
    FROM public.education
    WHERE user_id = calculate_candidate_rank.user_id;
    
    rank_score := rank_score + education_score;
    
    -- Profile completion bonus (5% weight)
    SELECT CASE 
        WHEN COUNT(*) >= 3 THEN 20  -- Has skills, experience, education
        WHEN COUNT(*) >= 2 THEN 15  -- Has 2 sections
        WHEN COUNT(*) >= 1 THEN 10  -- Has 1 section
        ELSE 0
    END
    INTO profile_completion
    FROM (
        SELECT 1 FROM public.skills WHERE user_id = calculate_candidate_rank.user_id LIMIT 1
        UNION ALL
        SELECT 1 FROM public.experiences WHERE user_id = calculate_candidate_rank.user_id LIMIT 1
        UNION ALL
        SELECT 1 FROM public.education WHERE user_id = calculate_candidate_rank.user_id LIMIT 1
    ) AS sections;
    
    rank_score := rank_score + profile_completion;
    
    -- Normalize to 0-100 scale
    rank_score := LEAST(100, GREATEST(0, rank_score / 4));
    
    -- Update the user's rank in the database
    UPDATE public.users
    SET rank_score = rank_score
    WHERE id = calculate_candidate_rank.user_id;
    
    RETURN rank_score;
END;
$function$;

-- Function to create notification when application status changes
CREATE OR REPLACE FUNCTION public.notify_application_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO public.notifications (user_id, title, message, type, related_id, related_type)
        VALUES (
            NEW.candidate_id,
            'Application Status Updated',
            'Your application status has been updated to: ' || NEW.status,
            'application',
            NEW.id,
            'application'
        );
    END IF;
    RETURN NEW;
END;
$function$;

-- Create trigger for application notifications
CREATE TRIGGER application_status_notification
    AFTER UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_application_status_change();