-- Fix function search paths to improve security
CREATE OR REPLACE FUNCTION public.get_current_user_type()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT user_type FROM public.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.insert_newsletter_subscription(email_address text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.newsletter_subscriptions (email)
  VALUES (email_address);
EXCEPTION 
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Email already subscribed';
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_skill_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET likes = likes + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET likes = likes - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_job_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.notify_employer_new_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    employer_id UUID;
    job_title TEXT;
    candidate_name TEXT;
BEGIN
    -- Get employer ID and job title
    SELECT j.employer_id, j.title 
    INTO employer_id, job_title
    FROM public.jobs j 
    WHERE j.id = NEW.job_id;
    
    -- Get candidate name
    SELECT u.name 
    INTO candidate_name
    FROM public.users u 
    WHERE u.id = NEW.candidate_id;
    
    -- Insert notification for employer
    INSERT INTO public.notifications (user_id, title, message, type, related_id, related_type)
    VALUES (
        employer_id,
        'New Job Application',
        'You have received a new application from ' || COALESCE(candidate_name, 'a candidate') || ' for the position: ' || job_title,
        'application',
        NEW.id,
        'application'
    );
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.employer_has_app_with_candidate(candidate_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.applications a
        JOIN public.jobs j ON j.id = a.job_id
        WHERE a.candidate_id = employer_has_app_with_candidate.candidate_id
        AND j.employer_id = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.validate_user_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Validate email format
    IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;
    
    -- Validate user_type (now includes admin)
    IF NEW.user_type NOT IN ('candidate', 'employer', 'admin') THEN
        RAISE EXCEPTION 'Invalid user type';
    END IF;
    
    -- Sanitize text inputs
    NEW.name = TRIM(NEW.name);
    NEW.email = LOWER(TRIM(NEW.email));
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_post_like_count(post_id_param uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT COUNT(*)::integer
    FROM post_likes
    WHERE post_id = post_id_param;
$$;

CREATE OR REPLACE FUNCTION public.user_liked_post(post_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM post_likes
        WHERE post_id = post_id_param AND user_id = auth.uid()
    );
$$;

CREATE OR REPLACE FUNCTION public.candidate_is_public(candidate_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
    SELECT COALESCE((
        SELECT is_profile_public FROM public.users u WHERE u.id = candidate_id
    ), false);
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    email, 
    name, 
    user_type,
    company,
    industry,
    size,
    website,
    phone,
    location,
    bio
  )
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', new.email), 
    COALESCE(new.raw_user_meta_data->>'user_type', 'candidate'),
    new.raw_user_meta_data->>'company',
    new.raw_user_meta_data->>'industry', 
    new.raw_user_meta_data->>'size',
    new.raw_user_meta_data->>'website',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'bio'
  );
  RETURN new;
END;
$$;