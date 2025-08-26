-- Revert overly permissive public SELECT policies and create safe public RPC

-- Drop overly-permissive policies if they exist
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'users' AND policyname = 'Public can view candidate profiles'
  ) THEN
    DROP POLICY "Public can view candidate profiles" ON public.users;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'skills' AND policyname = 'Public can view skills of public candidates'
  ) THEN
    DROP POLICY "Public can view skills of public candidates" ON public.skills;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'experiences' AND policyname = 'Public can view candidate experiences'
  ) THEN
    DROP POLICY "Public can view candidate experiences" ON public.experiences;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'education' AND policyname = 'Public can view candidate education'
  ) THEN
    DROP POLICY "Public can view candidate education" ON public.education;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'certifications' AND policyname = 'Public can view candidate certifications'
  ) THEN
    DROP POLICY "Public can view candidate certifications" ON public.certifications;
  END IF;
END $$;

-- Create a SECURITY DEFINER function to safely expose only non-sensitive public candidate data
CREATE OR REPLACE FUNCTION public.get_public_candidates(limit_num integer DEFAULT 100)
RETURNS TABLE (
  id uuid,
  name text,
  avatar_url text,
  location text,
  rank_score numeric,
  company text,
  skills text[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    u.id,
    u.name,
    u.avatar_url,
    u.location,
    COALESCE(u.rank_score, 0) AS rank_score,
    u.company,
    COALESCE(array_agg(s.name ORDER BY s.level DESC) FILTER (WHERE s.name IS NOT NULL), '{}') AS skills
  FROM public.users u
  LEFT JOIN public.skills s ON s.user_id = u.id
  WHERE u.user_type = 'candidate'
  GROUP BY u.id, u.name, u.avatar_url, u.location, u.rank_score, u.company
  ORDER BY u.rank_score DESC NULLS LAST
  LIMIT limit_num;
$$;

-- Ensure function is executable by anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.get_public_candidates(integer) TO anon, authenticated;
