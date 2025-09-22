-- Add external_apply_url column to jobs table
ALTER TABLE public.jobs ADD COLUMN external_apply_url TEXT;

-- Add company_name column to distinguish posting company from employer account
ALTER TABLE public.jobs ADD COLUMN company_name TEXT;