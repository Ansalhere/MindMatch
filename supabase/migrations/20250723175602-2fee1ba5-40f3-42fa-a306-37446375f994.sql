-- Fix infinite recursion in RLS policies for users table
-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Employers can view candidate profiles" ON public.users;

-- Create a simpler, non-recursive policy for employers to view candidates
-- This checks user_type directly without self-referencing the users table
CREATE POLICY "Employers can view candidate profiles" 
ON public.users 
FOR SELECT 
USING (
  -- Allow if the requesting user is an employer (from auth metadata)
  (auth.jwt() ->> 'user_metadata')::jsonb ->> 'user_type' = 'employer' 
  AND user_type = 'candidate'
);

-- Also ensure users can insert their own data (needed for profile creation)
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
CREATE POLICY "Users can insert their own data" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = id);