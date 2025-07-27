-- Fix remaining security issues from linter

-- 1. Drop the problematic RLS policy that references user metadata  
DROP POLICY IF EXISTS "Employers can view candidate profiles" ON public.users;

-- 2. Create secure RLS policy using the security definer function
CREATE POLICY "Employers can view candidate profiles" ON public.users
FOR SELECT 
USING (
  (public.get_current_user_type() = 'employer' AND user_type = 'candidate') 
  OR 
  (auth.uid() = id)
);

-- 3. Fix search path for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.users (id, email, name, user_type)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', new.email), COALESCE(new.raw_user_meta_data->>'user_type', 'candidate'));
  RETURN new;
END;
$function$;