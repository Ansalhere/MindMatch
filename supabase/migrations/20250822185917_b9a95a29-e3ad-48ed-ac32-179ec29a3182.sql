-- Create the super admin user using 'employer' type (which allows management features)
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
  'employer',
  now(),
  true,
  100,
  true
) ON CONFLICT (id) DO NOTHING;