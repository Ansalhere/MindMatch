-- Fix security warnings - set search_path for all functions
CREATE OR REPLACE FUNCTION public.get_current_user_type()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT user_type FROM public.users WHERE id = auth.uid();
$function$;

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
    
    -- Calculate profile completion bonus (5% weight)
    SELECT (
        (CASE WHEN EXISTS(SELECT 1 FROM public.skills WHERE user_id = calculate_candidate_rank.user_id) THEN 7 ELSE 0 END) +
        (CASE WHEN EXISTS(SELECT 1 FROM public.experiences WHERE user_id = calculate_candidate_rank.user_id) THEN 7 ELSE 0 END) +
        (CASE WHEN EXISTS(SELECT 1 FROM public.education WHERE user_id = calculate_candidate_rank.user_id) THEN 6 ELSE 0 END)
    )
    INTO profile_completion;
    
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