-- Fix remaining security linter issues

-- 1. Create a secure function to get current user type to fix RLS policy issue
CREATE OR REPLACE FUNCTION public.get_current_user_type()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT user_type FROM public.users WHERE id = auth.uid();
$$;

-- 2. Drop and recreate the problematic RLS policy
DROP POLICY IF EXISTS "Employers can view candidate profiles" ON public.users;

-- 3. Create secure RLS policy using the security definer function
CREATE POLICY "Employers can view candidate profiles" ON public.users
FOR SELECT 
USING (
  (public.get_current_user_type() = 'employer' AND user_type = 'candidate') 
  OR 
  (auth.uid() = id)
);

-- 4. Fix search path for all functions to be secure
CREATE OR REPLACE FUNCTION public.validate_user_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.validate_skill_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.validate_job_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;