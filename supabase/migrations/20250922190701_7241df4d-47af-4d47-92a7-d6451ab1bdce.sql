-- Add unique constraint on email and create admin user
ALTER TABLE public.users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Insert admin user
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
);