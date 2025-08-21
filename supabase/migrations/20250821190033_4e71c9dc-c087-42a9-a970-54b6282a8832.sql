-- Security hardening: restrict employer access to candidate PII
-- 1) Add explicit consent flag on users
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS is_profile_public boolean NOT NULL DEFAULT false;

-- 2) Helper: check if current user (employer) has an application relationship with the candidate
CREATE OR REPLACE FUNCTION public.employer_has_app_with_candidate(candidate_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.applications a
    JOIN public.jobs j ON j.id = a.job_id
    WHERE a.candidate_id = employer_has_app_with_candidate.candidate_id
      AND j.employer_id = auth.uid()
  );
$$;

-- 3) Helper: is the candidate profile public (safe to call from non-users policies)
CREATE OR REPLACE FUNCTION public.candidate_is_public(candidate_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT is_profile_public FROM public.users u WHERE u.id = candidate_id
  ), false);
$$;

-- 4) Tighten USERS table policy: employers can only view public candidates or those who applied to their jobs
DROP POLICY IF EXISTS "Employers can view candidate profiles" ON public.users;

CREATE POLICY "Employers can view public or related candidate profiles"
ON public.users
FOR SELECT
USING (
  user_type = 'candidate'
  AND (
    is_profile_public = true
    OR public.employer_has_app_with_candidate(id)
  )
);

-- Keep existing self-view/insert/update policies as-is

-- 5) Tighten SKILLS, EXPERIENCES, EDUCATION, CERTIFICATIONS employer SELECT policies to match the same rule
DROP POLICY IF EXISTS "Employers can view candidate skills" ON public.skills;
CREATE POLICY "Employers can view allowed candidate skills"
ON public.skills
FOR SELECT
USING (
  public.candidate_is_public(user_id) OR public.employer_has_app_with_candidate(user_id)
);

DROP POLICY IF EXISTS "Employers can view candidate experiences" ON public.experiences;
CREATE POLICY "Employers can view allowed candidate experiences"
ON public.experiences
FOR SELECT
USING (
  public.candidate_is_public(user_id) OR public.employer_has_app_with_candidate(user_id)
);

DROP POLICY IF EXISTS "Employers can view candidate education" ON public.education;
CREATE POLICY "Employers can view allowed candidate education"
ON public.education
FOR SELECT
USING (
  public.candidate_is_public(user_id) OR public.employer_has_app_with_candidate(user_id)
);

DROP POLICY IF EXISTS "Employers can view candidate certifications" ON public.certifications;
CREATE POLICY "Employers can view allowed candidate certifications"
ON public.certifications
FOR SELECT
USING (
  public.candidate_is_public(user_id) OR public.employer_has_app_with_candidate(user_id)
);
