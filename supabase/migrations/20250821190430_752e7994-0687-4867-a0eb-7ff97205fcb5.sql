-- Update the check constraint to allow 'admin' user type
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_user_type_check;

-- Create new constraint that includes admin
ALTER TABLE public.users ADD CONSTRAINT users_user_type_check 
CHECK (user_type IN ('candidate', 'employer', 'admin'));

-- Now create the admin user
INSERT INTO public.users (
    id,
    email,
    name,
    user_type,
    is_profile_public,
    created_at
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    'admin@skillrank.com',
    'Super Administrator',
    'admin',
    true,
    now()
) ON CONFLICT (email) DO NOTHING;