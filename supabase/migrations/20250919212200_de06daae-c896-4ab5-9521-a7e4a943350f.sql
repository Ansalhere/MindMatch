-- Fix the get_public_user_profile function to include more employer details
CREATE OR REPLACE FUNCTION public.get_public_user_profile(user_id uuid)
RETURNS TABLE(id uuid, name text, user_type text, company text, location text, avatar_url text, industry text, size text, website text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    u.id,
    u.name,
    u.user_type,
    u.company,
    u.location,
    u.avatar_url,
    u.industry,
    u.size,
    u.website
  FROM public.users u
  WHERE u.id = user_id;
$$;