-- Phase 1: Critical Security Fixes (Corrected)

-- 1. Add 'admin' as valid user type
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_user_type_check;
ALTER TABLE public.users ADD CONSTRAINT users_user_type_check 
CHECK (user_type IN ('candidate', 'employer', 'admin'));

-- 2. Update validation function to include admin type
CREATE OR REPLACE FUNCTION public.validate_user_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- 3. Create proper admin user account in auth.users and public.users
-- First, create auth user
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    last_sign_in_at
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'admin@skillrank.com',
    crypt('SecureAdmin2024!', gen_salt('bf')),
    NOW(),
    NOW(),
    '',
    '',
    '',
    '',
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "System Administrator", "user_type": "admin"}',
    false,
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    encrypted_password = crypt('SecureAdmin2024!', gen_salt('bf')),
    updated_at = NOW();

-- Update public.users table with proper admin account (removed updated_at reference)
INSERT INTO public.users (
    id,
    email,
    name,
    user_type,
    created_at,
    is_premium,
    rank_score,
    is_profile_public
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@skillrank.com',
    'System Administrator',
    'admin',
    NOW(),
    true,
    100,
    false
) ON CONFLICT (id) DO UPDATE SET
    user_type = 'admin',
    name = 'System Administrator';

-- 4. Fix user identity exposure in post_likes table
-- Remove the policy that exposes user_id
DROP POLICY IF EXISTS "Anyone can view post likes" ON public.post_likes;

-- Create new policy that aggregates likes without exposing user identities
CREATE POLICY "Users can view like counts only"
ON public.post_likes
FOR SELECT
USING (false); -- No direct access to individual like records

-- 5. Create a secure function to get like counts without exposing user_id
CREATE OR REPLACE FUNCTION public.get_post_like_count(post_id_param uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT COUNT(*)::integer
    FROM post_likes
    WHERE post_id = post_id_param;
$function$;

-- 6. Create function to check if current user liked a post
CREATE OR REPLACE FUNCTION public.user_liked_post(post_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT EXISTS (
        SELECT 1
        FROM post_likes
        WHERE post_id = post_id_param AND user_id = auth.uid()
    );
$function$;

-- 7. Update search_path for existing functions to prevent privilege escalation
CREATE OR REPLACE FUNCTION public.get_current_user_type()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT user_type FROM public.users WHERE id = auth.uid();
$function$;

CREATE OR REPLACE FUNCTION public.employer_has_app_with_candidate(candidate_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT EXISTS (
        SELECT 1
        FROM public.applications a
        JOIN public.jobs j ON j.id = a.job_id
        WHERE a.candidate_id = employer_has_app_with_candidate.candidate_id
        AND j.employer_id = auth.uid()
    );
$function$;

CREATE OR REPLACE FUNCTION public.candidate_is_public(candidate_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
    SELECT COALESCE((
        SELECT is_profile_public FROM public.users u WHERE u.id = candidate_id
    ), false);
$function$;