-- Create companies table for public company profiles
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  size TEXT,
  website TEXT,
  location TEXT,
  logo_url TEXT,
  founded_year INTEGER,
  employee_count TEXT,
  company_type TEXT, -- startup, corporation, non-profit, etc.
  is_verified BOOLEAN DEFAULT false,
  contact_email TEXT,
  phone TEXT,
  social_links JSONB -- For LinkedIn, Twitter, etc.
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view company profiles
CREATE POLICY "Anyone can view company profiles" 
ON public.companies 
FOR SELECT 
USING (true);

-- Only authenticated users can create companies (will be expanded later for employers)
CREATE POLICY "Authenticated users can create companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update companies they own (will add ownership logic later)
CREATE POLICY "Company owners can update their companies" 
ON public.companies 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add company_id to users table to link users to companies
ALTER TABLE public.users ADD COLUMN company_id UUID REFERENCES public.companies(id);

-- Create index for better performance
CREATE INDEX idx_users_company_id ON public.users(company_id);
CREATE INDEX idx_companies_name ON public.companies(name);
CREATE INDEX idx_companies_industry ON public.companies(industry);

-- Insert some sample companies
INSERT INTO public.companies (name, description, industry, size, website, location, founded_year, employee_count, company_type, is_verified, contact_email) VALUES
('TechCorp Solutions', 'Leading technology solutions provider specializing in AI and machine learning', 'Technology', 'large', 'https://techcorp.com', 'Bangalore, India', 2015, '500-1000', 'corporation', true, 'hr@techcorp.com'),
('StartupHub', 'Innovative startup accelerator and venture capital firm', 'Finance', 'medium', 'https://startuphub.com', 'Mumbai, India', 2018, '50-100', 'startup', true, 'careers@startuphub.com'),
('GreenEnergy Co', 'Renewable energy solutions and sustainable technology', 'Energy', 'medium', 'https://greenenergy.com', 'Pune, India', 2020, '100-500', 'corporation', true, 'jobs@greenenergy.com'),
('HealthTech Innovations', 'Digital healthcare solutions and medical technology', 'Healthcare', 'small', 'https://healthtech.com', 'Delhi, India', 2019, '10-50', 'startup', false, 'hiring@healthtech.com'),
('EduPlatform', 'Online education and e-learning solutions', 'Education', 'medium', 'https://eduplatform.com', 'Hyderabad, India', 2017, '200-500', 'corporation', true, 'hr@eduplatform.com');