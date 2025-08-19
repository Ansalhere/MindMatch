-- Add missing columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS website text;

-- Update the handle_new_user function to include all fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
$function$;

-- Create proper trigger for notifications and emails
CREATE OR REPLACE FUNCTION public.notify_employer_new_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- Create trigger if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'trigger_notify_employer_new_application'
    ) THEN
        CREATE TRIGGER trigger_notify_employer_new_application
            AFTER INSERT ON public.applications
            FOR EACH ROW
            EXECUTE FUNCTION public.notify_employer_new_application();
    END IF;
END $$;