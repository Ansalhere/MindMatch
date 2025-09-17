-- Create the admin user for super admin access
INSERT INTO auth.users (
  id, 
  instance_id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at, 
  role, 
  aud,
  raw_user_meta_data
) VALUES (
  '11111111-1111-1111-1111-111111111112',
  '00000000-0000-0000-0000-000000000000',
  'admin@fresherpools.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '{"user_type": "admin"}'::jsonb
) ON CONFLICT (email) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- Insert/update the admin user profile in the users table
INSERT INTO public.users (
  id,
  email,
  name,
  user_type,
  company,
  location,
  bio,
  is_premium,
  rank_score
) VALUES (
  '11111111-1111-1111-1111-111111111112',
  'admin@fresherpools.com',
  'Super Administrator',
  'admin',
  'FresherPools',
  'India',
  'System Administrator with full access to platform management',
  true,
  100
) ON CONFLICT (id) DO UPDATE SET
  user_type = EXCLUDED.user_type,
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  location = EXCLUDED.location,
  bio = EXCLUDED.bio,
  is_premium = EXCLUDED.is_premium,
  rank_score = EXCLUDED.rank_score;