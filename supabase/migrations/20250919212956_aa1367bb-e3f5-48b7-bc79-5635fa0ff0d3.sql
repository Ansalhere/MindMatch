-- Create a new RPC function to get all public employers
CREATE OR REPLACE FUNCTION public.get_public_employers(limit_num integer DEFAULT 50)
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
  WHERE u.user_type = 'employer'
  ORDER BY u.created_at DESC
  LIMIT limit_num;
$$;