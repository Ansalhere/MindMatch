-- Fix critical security vulnerability in newsletter_subscriptions table
-- Remove the overly permissive SELECT policy that allows anyone to view all emails

-- Drop the existing insecure policy
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.newsletter_subscriptions;

-- Create a secure policy that only allows admins to view all subscriptions
CREATE POLICY "Only admins can view newsletter subscriptions" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.user_type = 'admin'
  )
);

-- Allow users to check if their specific email is subscribed (optional - for user experience)
-- This policy allows authenticated users to only see their own subscription by email
CREATE POLICY "Users can check their own email subscription" 
ON public.newsletter_subscriptions 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND email = (
    SELECT users.email FROM public.users 
    WHERE users.id = auth.uid()
  )
);

-- Keep the existing insert policy for new subscriptions (this is secure)
-- Policy "Anyone can subscribe to newsletter" remains unchanged