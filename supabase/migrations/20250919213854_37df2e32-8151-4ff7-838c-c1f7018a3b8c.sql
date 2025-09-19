-- Create a function to get company by user ID or company name
CREATE OR REPLACE FUNCTION public.get_company_profile(profile_id uuid)
RETURNS TABLE(
  id uuid, 
  name text, 
  description text, 
  industry text, 
  size text, 
  website text, 
  location text, 
  logo_url text, 
  founded_year integer, 
  employee_count text, 
  company_type text, 
  is_verified boolean, 
  contact_email text, 
  phone text, 
  social_links jsonb
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  -- First try to find in companies table
  SELECT 
    c.id, c.name, c.description, c.industry, c.size, c.website, 
    c.location, c.logo_url, c.founded_year, c.employee_count, 
    c.company_type, c.is_verified, c.contact_email, c.phone, c.social_links
  FROM public.companies c
  WHERE c.id = profile_id
  
  UNION ALL
  
  -- If not found, create a virtual company from user data
  SELECT 
    u.id, 
    COALESCE(u.company, u.name) as name,
    COALESCE(u.bio, 'Professional services company') as description,
    COALESCE(u.industry, 'Technology') as industry,
    COALESCE(u.size, 'Not specified') as size,
    u.website,
    u.location,
    u.avatar_url as logo_url,
    NULL::integer as founded_year,
    u.size as employee_count,
    'company'::text as company_type,
    false as is_verified,
    CASE WHEN auth.uid() IS NOT NULL THEN u.email ELSE NULL END as contact_email,
    CASE WHEN auth.uid() IS NOT NULL THEN u.phone ELSE NULL END as phone,
    NULL::jsonb as social_links
  FROM public.users u
  WHERE u.id = profile_id 
    AND u.user_type = 'employer'
    AND NOT EXISTS (SELECT 1 FROM public.companies c WHERE c.id = profile_id);
$$;