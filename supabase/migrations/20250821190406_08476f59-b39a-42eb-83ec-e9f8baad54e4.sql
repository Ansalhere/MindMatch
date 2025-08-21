-- Create admin user for super admin login
-- First check if admin user exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'admin@skillrank.com') THEN
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
        );
        
        -- Also need to create auth user - this should be done through Supabase Auth
        -- For now, we'll create the user record that can be matched later
        RAISE NOTICE 'Admin user profile created. Please create auth user manually.';
    ELSE
        RAISE NOTICE 'Admin user already exists.';
    END IF;
END $$;