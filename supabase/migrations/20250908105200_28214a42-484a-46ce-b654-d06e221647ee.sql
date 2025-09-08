-- Create super admin user and update user_type enum if needed
DO $$ 
BEGIN
    -- Check if 'super_admin' type exists in the enum, if not add it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type_enum' AND EXISTS (
        SELECT 1 FROM pg_enum WHERE enumtypid = pg_type.oid AND enumlabel = 'super_admin'
    )) THEN
        -- If the enum doesn't have super_admin, we need to alter it
        ALTER TYPE user_type_enum ADD VALUE 'super_admin';
    END IF;
END $$;

-- Create default super admin user (you can change these credentials)
INSERT INTO public.users (
    id, 
    email, 
    name, 
    user_type, 
    is_premium,
    created_at
) VALUES (
    gen_random_uuid(),
    'superadmin@fresherpools.com',
    'Super Administrator',
    'super_admin',
    true,
    now()
) ON CONFLICT (email) DO UPDATE SET 
    user_type = 'super_admin',
    is_premium = true;

-- Create packages table for employer packages
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_months INTEGER NOT NULL DEFAULT 1,
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on packages table
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Create policy for packages (readable by all authenticated users)
CREATE POLICY "packages_select_policy" ON public.packages
FOR SELECT TO authenticated
USING (is_active = true);

-- Create employer_packages table to track which package an employer has
CREATE TABLE IF NOT EXISTS public.employer_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    package_id UUID REFERENCES public.packages(id) ON DELETE RESTRICT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
    stripe_session_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(employer_id, package_id, started_at)
);

-- Enable RLS on employer_packages table
ALTER TABLE public.employer_packages ENABLE ROW LEVEL SECURITY;

-- Create policies for employer_packages
CREATE POLICY "employer_packages_select_own" ON public.employer_packages
FOR SELECT TO authenticated
USING (employer_id = auth.uid());

CREATE POLICY "employer_packages_insert_own" ON public.employer_packages
FOR INSERT TO authenticated
WITH CHECK (employer_id = auth.uid());

-- Insert default packages
INSERT INTO public.packages (name, description, price, duration_months, features) VALUES
('Basic', 'Essential features for small businesses', 29.99, 1, '{"job_posts": 3, "candidate_views": 50, "support": "email"}'),
('Professional', 'Advanced features for growing companies', 79.99, 1, '{"job_posts": 10, "candidate_views": 200, "support": "priority", "analytics": true}'),
('Enterprise', 'Complete solution for large organizations', 199.99, 1, '{"job_posts": "unlimited", "candidate_views": "unlimited", "support": "dedicated", "analytics": true, "custom_branding": true}')
ON CONFLICT DO NOTHING;

-- Update updated_at trigger for packages
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_packages_updated_at
    BEFORE UPDATE ON public.packages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employer_packages_updated_at
    BEFORE UPDATE ON public.employer_packages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();