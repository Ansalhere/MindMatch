-- Insert admin user for testing
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at, 
  role,
  raw_user_meta_data
) VALUES (
  gen_random_uuid(),
  'admin@skillrank.com',
  crypt('SuperAdmin2024!', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  '{"user_type": "admin", "name": "Super Admin"}'::jsonb
);