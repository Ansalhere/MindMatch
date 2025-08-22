-- Create the super admin user directly in the users table
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
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@skillrank.com',
  'Super Administrator',
  'admin',
  now(),
  true,
  100,
  true
);

-- Create auth user for login (this creates the actual authentication record)
-- Note: In production, users would be created through Supabase Auth
-- This is a demo user for testing purposes