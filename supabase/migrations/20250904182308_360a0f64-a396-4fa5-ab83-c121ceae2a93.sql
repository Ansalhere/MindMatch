-- 1) Restrict users table reads to prevent sensitive data leakage
-- Drop employer-wide candidate SELECT policy (column-level restrictions are not possible with RLS)
DROP POLICY IF EXISTS "Employers can view public or related candidate profiles" ON public.users;

-- 2) Create RPC to return ONLY non-sensitive candidate fields with the same access logic
CREATE OR REPLACE FUNCTION public.get_public_candidate_profile(candidate_id uuid)
RETURNS TABLE(
  id uuid,
  name text,
  avatar_url text,
  location text,
  rank_score numeric,
  company text,
  user_type text,
  is_profile_public boolean
) AS $$
  SELECT 
    u.id,
    u.name,
    u.avatar_url,
    u.location,
    COALESCE(u.rank_score, 0) AS rank_score,
    u.company,
    u.user_type,
    u.is_profile_public
  FROM public.users u
  WHERE u.id = candidate_id
    AND u.user_type = 'candidate'
    AND (
      candidate_is_public(candidate_id)
      OR employer_has_app_with_candidate(candidate_id)
      OR auth.uid() = candidate_id
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_public_candidate_profile(uuid) TO anon, authenticated;

-- 3) Generic public-safe user profile (names/roles for posts, etc.)
CREATE OR REPLACE FUNCTION public.get_public_user_profile(user_id uuid)
RETURNS TABLE(
  id uuid,
  name text,
  user_type text,
  company text,
  location text,
  avatar_url text
) AS $$
  SELECT 
    u.id,
    u.name,
    u.user_type,
    u.company,
    u.location,
    u.avatar_url
  FROM public.users u
  WHERE u.id = user_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_public_user_profile(uuid) TO anon, authenticated;