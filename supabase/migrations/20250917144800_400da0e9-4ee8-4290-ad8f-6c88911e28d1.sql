-- First add unique constraint on email if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'users_email_key'
    ) THEN
        ALTER TABLE public.users ADD CONSTRAINT users_email_key UNIQUE (email);
    END IF;
END $$;

-- Insert the admin user profile in the users table
INSERT INTO public.users (
  id,
  email,
  name,
  user_type,
  company,
  location,
  bio,
  is_premium,
  rank_score
) VALUES (
  '11111111-1111-1111-1111-111111111112',
  'admin@fresherpools.com',
  'Super Administrator',
  'admin',
  'FresherPools',
  'India',
  'System Administrator with full access to platform management',
  true,
  100
) ON CONFLICT (email) DO UPDATE SET
  user_type = EXCLUDED.user_type,
  name = EXCLUDED.name,
  company = EXCLUDED.company,
  location = EXCLUDED.location,
  bio = EXCLUDED.bio,
  is_premium = EXCLUDED.is_premium,
  rank_score = EXCLUDED.rank_score;