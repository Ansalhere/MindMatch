-- Create admin user for super admin access
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  aud,
  role
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@rankme.ai',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"user_type": "admin", "name": "System Admin"}',
  'authenticated',
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Create admin user profile
INSERT INTO public.users (
  id,
  email,
  name,
  user_type,
  created_at
) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@rankme.ai',
  'System Admin',
  'admin',
  now()
) ON CONFLICT (id) DO NOTHING;