-- Fix remaining function search path issue by setting search path for calculate_candidate_rank function

CREATE OR REPLACE FUNCTION public.calculate_candidate_rank(user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    rank_score NUMERIC(5,2) := 0;
    skill_count INTEGER;
    cert_count INTEGER;
    exp_years NUMERIC(5,2) := 0;
    education_score NUMERIC(5,2) := 0;
BEGIN
    -- Count skills and their levels
    SELECT COUNT(*), COALESCE(SUM(level * 5 + experience_years * 3), 0)
    INTO skill_count, rank_score
    FROM public.skills
    WHERE user_id = calculate_candidate_rank.user_id;
    
    -- Add points for certifications
    SELECT COUNT(*) * 15
    INTO cert_count
    FROM public.certifications
    WHERE user_id = calculate_candidate_rank.user_id;
    
    rank_score := rank_score + cert_count;
    
    -- Calculate experience years and add points
    SELECT COALESCE(SUM(
        CASE
            WHEN is_current = true THEN 
                EXTRACT(YEAR FROM AGE(CURRENT_DATE, start_date))
            ELSE
                EXTRACT(YEAR FROM AGE(end_date, start_date))
        END
    ), 0) * 20
    INTO exp_years
    FROM public.experiences
    WHERE user_id = calculate_candidate_rank.user_id;
    
    rank_score := rank_score + exp_years;
    
    -- Add points for education
    SELECT COALESCE(SUM((4 - COALESCE(tier, 3)) * 15 + COALESCE(gpa, 0) * 5), 0)
    INTO education_score
    FROM public.education
    WHERE user_id = calculate_candidate_rank.user_id;
    
    rank_score := rank_score + education_score;
    
    -- Normalize to 0-100 scale
    rank_score := LEAST(100, GREATEST(0, rank_score / 5));
    
    -- Update the user's rank in the database
    UPDATE public.users
    SET rank_score = rank_score
    WHERE id = calculate_candidate_rank.user_id;
    
    RETURN rank_score;
END;
$$;