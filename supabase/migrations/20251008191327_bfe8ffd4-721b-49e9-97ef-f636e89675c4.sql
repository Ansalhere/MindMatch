-- Add subscription preferences to newsletter_subscriptions table
ALTER TABLE public.newsletter_subscriptions
ADD COLUMN IF NOT EXISTS preferences jsonb DEFAULT '{"job_updates": true, "employer_updates": true, "platform_updates": true}'::jsonb,
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS user_type text CHECK (user_type IN ('candidate', 'employer', 'all'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_preferences ON public.newsletter_subscriptions USING GIN (preferences);

-- Update RLS policies for subscription preferences
DROP POLICY IF EXISTS "Users can update their own subscription preferences" ON public.newsletter_subscriptions;

CREATE POLICY "Users can update their own subscription preferences"
ON public.newsletter_subscriptions
FOR UPDATE
TO authenticated
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);