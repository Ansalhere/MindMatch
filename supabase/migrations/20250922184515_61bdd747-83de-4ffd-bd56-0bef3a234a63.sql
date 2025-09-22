-- Add resume_url column to users table
ALTER TABLE public.users ADD COLUMN resume_url TEXT;

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false);

-- Create policies for resume uploads
CREATE POLICY "Users can upload their own resume" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own resume" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own resume" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own resume" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Employers can view candidate resumes if they have applications" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'resumes' 
  AND (
    auth.uid()::text = (storage.foldername(name))[1]  -- Own resume
    OR employer_has_app_with_candidate((storage.foldername(name))[1]::uuid)  -- Employer with applications
  )
);