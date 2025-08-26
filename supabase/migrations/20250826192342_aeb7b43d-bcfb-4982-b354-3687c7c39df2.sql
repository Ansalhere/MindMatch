-- Allow public viewing of candidate rankings and profiles
-- Update RLS policies to make rankings public

-- Update skills RLS policy to allow public viewing when user has public profile
DROP POLICY IF EXISTS "Public can view skills of public candidates" ON public.skills;
CREATE POLICY "Public can view skills of public candidates" 
ON public.skills 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = skills.user_id 
    AND users.user_type = 'candidate'
  )
);

-- Update users RLS policy to allow public viewing of candidate profiles
DROP POLICY IF EXISTS "Public can view candidate profiles" ON public.users;
CREATE POLICY "Public can view candidate profiles" 
ON public.users 
FOR SELECT 
USING (user_type = 'candidate');

-- Update experiences RLS policy
DROP POLICY IF EXISTS "Public can view candidate experiences" ON public.experiences;
CREATE POLICY "Public can view candidate experiences" 
ON public.experiences 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = experiences.user_id 
    AND users.user_type = 'candidate'
  )
);

-- Update education RLS policy
DROP POLICY IF EXISTS "Public can view candidate education" ON public.education;
CREATE POLICY "Public can view candidate education" 
ON public.education 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = education.user_id 
    AND users.user_type = 'candidate'
  )
);

-- Update certifications RLS policy
DROP POLICY IF EXISTS "Public can view candidate certifications" ON public.certifications;
CREATE POLICY "Public can view candidate certifications" 
ON public.certifications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = certifications.user_id 
    AND users.user_type = 'candidate'
  )
);