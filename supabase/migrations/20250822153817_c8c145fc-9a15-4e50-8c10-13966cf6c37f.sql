-- First, let's create a super admin user
-- Insert a super admin with known credentials
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'admin@rankme.ai',
  crypt('SuperAdmin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Super Admin", "user_type": "admin"}',
  true,
  'authenticated'
)
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('SuperAdmin123!', gen_salt('bf')),
  updated_at = now(),
  raw_user_meta_data = '{"name": "Super Admin", "user_type": "admin"}',
  is_super_admin = true;

-- Ensure the user exists in public.users table
INSERT INTO public.users (
  id,
  email,
  name,
  user_type,
  created_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@rankme.ai',
  'Super Admin',
  'admin',
  now()
)
ON CONFLICT (id) DO UPDATE SET
  user_type = 'admin',
  name = 'Super Admin',
  email = 'admin@rankme.ai';