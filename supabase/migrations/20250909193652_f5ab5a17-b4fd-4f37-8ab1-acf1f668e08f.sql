-- Insert super admin user if it doesn't exist
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
  confirmation_token,
  email_change_token_new,
  recovery_token,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  '00000000-0000-0000-0000-000000000000',
  'admin@fresherpools.com',
  '$2a$10$3V5z8Ws.JhPzUgVbWqQvwOQVZGHf8GvKMQv8ZxR8SYL8p5YJwZDYW', -- password: admin123
  NOW(),
  NOW(),
  NOW(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"user_type": "admin", "name": "Super Administrator"}'
) ON CONFLICT (email) DO NOTHING;

-- Insert or update the user profile
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