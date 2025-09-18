-- Create admin user in auth.users and public.users tables
-- First, we need to create the admin user in Supabase Auth
-- This creates the user with email and password in the auth system

-- Insert the admin user into our public.users table
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
  avatar_url
) VALUES (
  gen_random_uuid(),
  'admin@fresherpools.com',
  'Super Administrator',
  'admin',
  'FresherPools',
  'India',
  'System Administrator with full access to platform management and user oversight',
  true,
  100,
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
)
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  user_type = EXCLUDED.user_type,
  company = EXCLUDED.company,
  location = EXCLUDED.location,
  bio = EXCLUDED.bio,
  is_premium = EXCLUDED.is_premium,
  rank_score = EXCLUDED.rank_score,
  avatar_url = EXCLUDED.avatar_url;