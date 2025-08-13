-- Add missing columns to users table for proper profile editing
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Update the handle_new_user function to properly handle employer data
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
    location
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
    new.raw_user_meta_data->>'location'
  );
  RETURN new;
END;
$function$;

-- Create a function to notify employers of new job applications
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
    
    -- Call the email notification edge function
    PERFORM
      net.http_post(
        url := 'https://grbtziyqindonbkkkfkc.supabase.co/functions/v1/send-notification-email',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
        ),
        body := jsonb_build_object(
          'employerId', employer_id,
          'jobTitle', job_title,
          'candidateName', COALESCE(candidate_name, 'a candidate'),
          'type', 'new_application'
        )
      );
    
    RETURN NEW;
END;
$function$;

-- Create trigger for new application notifications
DROP TRIGGER IF EXISTS on_application_created ON public.applications;
CREATE TRIGGER on_application_created
    AFTER INSERT ON public.applications
    FOR EACH ROW EXECUTE FUNCTION public.notify_employer_new_application();