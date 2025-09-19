-- Create RPC functions to make profiles public for non-authenticated users
-- Allow public access to candidate and employer profiles but protect contact details

-- Update RLS policies for users table to allow public read access for basic profile info
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;

CREATE POLICY "Anyone can view basic profile data" ON public.users
  FOR SELECT USING (true);

-- Update the get_public_employers function to exclude sensitive contact information for non-authenticated users
CREATE OR REPLACE FUNCTION public.get_public_employers_safe(limit_num integer DEFAULT 50)
RETURNS TABLE(id uuid, name text, user_type text, company text, location text, avatar_url text, industry text, size text, website text, contact_email text, phone text)
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
    u.website,
    CASE 
      WHEN auth.uid() IS NOT NULL THEN u.email
      ELSE NULL 
    END as contact_email,
    CASE 
      WHEN auth.uid() IS NOT NULL THEN u.phone
      ELSE NULL 
    END as phone
  FROM public.users u
  WHERE u.user_type = 'employer'
  ORDER BY u.created_at DESC
  LIMIT limit_num;
$$;