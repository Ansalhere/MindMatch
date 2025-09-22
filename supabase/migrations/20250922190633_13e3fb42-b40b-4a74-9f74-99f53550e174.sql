-- Create admin user account
-- Note: This creates a user in the public.users table, but you'll need to create the auth.users entry manually through Supabase dashboard

-- First, let's insert a placeholder admin user that can be updated once the auth user is created
INSERT INTO public.users (
  id,
  email, 
  name, 
  user_type
) VALUES (
  gen_random_uuid(),
  'superadmin@fresherpools.com',
  'Super Admin',
  'admin'
) ON CONFLICT (email) DO UPDATE SET
  user_type = 'admin',
  name = 'Super Admin';