-- Phase 1: Critical Database Security Fixes

-- 1. Enable RLS on packages table (currently disabled)
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Create policy for packages table
CREATE POLICY "Enable read access for all users" ON public.packages FOR SELECT USING (true);

-- 2. Fix search path security for existing functions
CREATE OR REPLACE FUNCTION public.calculate_candidate_rank(user_id uuid)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- 3. Create secure password validation trigger
CREATE OR REPLACE FUNCTION public.validate_user_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Validate email format
    IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;
    
    -- Validate user_type
    IF NEW.user_type NOT IN ('candidate', 'employer', 'admin') THEN
        RAISE EXCEPTION 'Invalid user type';
    END IF;
    
    -- Sanitize text inputs
    NEW.name = TRIM(NEW.name);
    NEW.email = LOWER(TRIM(NEW.email));
    
    RETURN NEW;
END;
$function$;

-- Create trigger for user data validation
CREATE TRIGGER validate_user_data_trigger
    BEFORE INSERT OR UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_user_data();

-- 4. Add input validation for skills
CREATE OR REPLACE FUNCTION public.validate_skill_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Validate skill level (1-10)
    IF NEW.level < 1 OR NEW.level > 10 THEN
        RAISE EXCEPTION 'Skill level must be between 1 and 10';
    END IF;
    
    -- Validate experience years (0-50)
    IF NEW.experience_years < 0 OR NEW.experience_years > 50 THEN
        RAISE EXCEPTION 'Experience years must be between 0 and 50';
    END IF;
    
    -- Sanitize skill name
    NEW.name = TRIM(NEW.name);
    
    -- Validate skill name length
    IF LENGTH(NEW.name) < 2 OR LENGTH(NEW.name) > 100 THEN
        RAISE EXCEPTION 'Skill name must be between 2 and 100 characters';
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Create trigger for skill data validation
CREATE TRIGGER validate_skill_data_trigger
    BEFORE INSERT OR UPDATE ON public.skills
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_skill_data();

-- 5. Add validation for job posts
CREATE OR REPLACE FUNCTION public.validate_job_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Sanitize text inputs
    NEW.title = TRIM(NEW.title);
    NEW.description = TRIM(NEW.description);
    NEW.location = TRIM(NEW.location);
    
    -- Validate required fields
    IF LENGTH(NEW.title) < 5 OR LENGTH(NEW.title) > 200 THEN
        RAISE EXCEPTION 'Job title must be between 5 and 200 characters';
    END IF;
    
    IF LENGTH(NEW.description) < 50 OR LENGTH(NEW.description) > 5000 THEN
        RAISE EXCEPTION 'Job description must be between 50 and 5000 characters';
    END IF;
    
    -- Validate salary range
    IF NEW.salary_min IS NOT NULL AND NEW.salary_max IS NOT NULL THEN
        IF NEW.salary_min > NEW.salary_max THEN
            RAISE EXCEPTION 'Minimum salary cannot be greater than maximum salary';
        END IF;
    END IF;
    
    -- Validate job type
    IF NEW.job_type NOT IN ('full-time', 'part-time', 'contract', 'internship', 'freelance') THEN
        RAISE EXCEPTION 'Invalid job type';
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Create trigger for job data validation
CREATE TRIGGER validate_job_data_trigger
    BEFORE INSERT OR UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_job_data();