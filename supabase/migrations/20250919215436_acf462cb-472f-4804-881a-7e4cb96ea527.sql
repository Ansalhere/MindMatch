-- Add function to revoke applications (delete applications)
-- This will allow candidates to withdraw their applications

-- Add function to update job status
CREATE OR REPLACE FUNCTION public.toggle_job_status(job_id uuid, new_status boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    UPDATE public.jobs 
    SET is_active = new_status 
    WHERE id = job_id AND employer_id = auth.uid();
END;
$$;

-- Add function to get employer's jobs with application counts
CREATE OR REPLACE FUNCTION public.get_employer_jobs_with_applications(employer_id uuid)
RETURNS TABLE(
    id uuid,
    title text,
    description text,
    location text,
    job_type text,
    salary_min integer,
    salary_max integer,
    is_active boolean,
    created_at timestamp with time zone,
    closing_date date,
    application_count bigint
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
    SELECT 
        j.id,
        j.title,
        j.description,
        j.location,
        j.job_type,
        j.salary_min,
        j.salary_max,
        j.is_active,
        j.created_at,
        j.closing_date,
        COUNT(a.id) as application_count
    FROM public.jobs j
    LEFT JOIN public.applications a ON j.id = a.job_id
    WHERE j.employer_id = get_employer_jobs_with_applications.employer_id
    GROUP BY j.id, j.title, j.description, j.location, j.job_type, j.salary_min, j.salary_max, j.is_active, j.created_at, j.closing_date
    ORDER BY j.created_at DESC;
$$;

-- Add function to get candidate applications with job details
CREATE OR REPLACE FUNCTION public.get_candidate_applications(candidate_id uuid)
RETURNS TABLE(
    id uuid,
    status text,
    created_at timestamp with time zone,
    candidate_note text,
    job_id uuid,
    job_title text,
    job_company text,
    employer_name text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
    SELECT 
        a.id,
        a.status,
        a.created_at,
        a.candidate_note,
        j.id as job_id,
        j.title as job_title,
        COALESCE(u.company, u.name) as job_company,
        u.name as employer_name
    FROM public.applications a
    JOIN public.jobs j ON a.job_id = j.id
    JOIN public.users u ON j.employer_id = u.id
    WHERE a.candidate_id = get_candidate_applications.candidate_id
    ORDER BY a.created_at DESC;
$$;