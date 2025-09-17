-- Create admin user without foreign key constraints
-- First check if admin user already exists
INSERT INTO public.users (
  id,
  email,
  name,
  user_type,
  company,
  location,
  bio,
  is_premium,
  rank_score,
  created_at
) 
SELECT 
  gen_random_uuid(),
  'admin@fresherpools.com',
  'Super Administrator',
  'admin',
  'FresherPools',
  'India',
  'System Administrator with full access to platform management',
  true,
  100,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE email = 'admin@fresherpools.com'
);