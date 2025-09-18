-- Insert admin user into public.users table (without ON CONFLICT since email is not unique)
-- First check if admin user exists, if not create it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'admin@fresherpools.com') THEN
    INSERT INTO public.users (
      id,
      email,
      name,
      user_type,
      company,
      location,
      bio,
      is_premium,
      rank_score,
      avatar_url
    ) VALUES (
      gen_random_uuid(),
      'admin@fresherpools.com',
      'Super Administrator',
      'admin',
      'FresherPools',
      'India',
      'System Administrator with full access to platform management and user oversight',
      true,
      100,
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    );
  END IF;
END $$;