-- Create demo auth users that match the existing public.users records
-- These will trigger the handle_new_user function to sync with public.users

-- Insert demo candidate users into auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES 
-- Alice Johnson (Candidate)
(
  '11111111-1111-1111-1111-111111111111'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'alice@example.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Alice Johnson", "user_type": "candidate"}'::jsonb,
  '',
  '',
  '',
  ''
),
-- Bob Smith (Candidate)
(
  '22222222-2222-2222-2222-222222222222'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'bob@example.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "Bob Smith", "user_type": "candidate"}'::jsonb,
  '',
  '',
  '',
  ''
),
-- TechCorp (Employer)
(
  '33333333-3333-3333-3333-333333333333'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'techcorp@example.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "TechCorp", "user_type": "employer", "company": "TechCorp Solutions", "industry": "Technology", "size": "51-200"}'::jsonb,
  '',
  '',
  '',
  ''
),
-- InnovateLabs (Employer)
(
  '44444444-4444-4444-4444-444444444444'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'innovate@example.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"name": "InnovateLabs", "user_type": "employer", "company": "InnovateLabs Inc", "industry": "Innovation", "size": "11-50"}'::jsonb,
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;