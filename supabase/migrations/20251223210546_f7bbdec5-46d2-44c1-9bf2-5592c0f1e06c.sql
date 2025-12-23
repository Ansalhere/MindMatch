-- Add resume premium tracking columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS resume_premium_type text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS resume_premium_downloads_remaining integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS resume_premium_expires_at timestamp with time zone DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.users.resume_premium_type IS 'Type of resume premium: single, unlimited, or null';
COMMENT ON COLUMN public.users.resume_premium_downloads_remaining IS 'Remaining downloads for single plan';
COMMENT ON COLUMN public.users.resume_premium_expires_at IS 'Expiry date for premium access';