-- Insert or update the super admin user profile
INSERT INTO public.users (
  id,
  email,
  name,
  user_type,
  is_premium,
  created_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@fresherpools.com',
  'Super Administrator',
  'admin',
  true,
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  user_type = 'admin',
  name = 'Super Administrator',
  is_premium = true;