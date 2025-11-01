-- Check if storage policies exist and create proper ones for resumes bucket

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own resume" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resume" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resume" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resume" ON storage.objects;
DROP POLICY IF EXISTS "Employers can view candidate resumes" ON storage.objects;

-- Allow users to upload their own resume
CREATE POLICY "Users can upload their own resume"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'resumes' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own resume
CREATE POLICY "Users can view their own resume"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own resume
CREATE POLICY "Users can update their own resume"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'resumes' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own resume
CREATE POLICY "Users can delete their own resume"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'resumes' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow employers to view resumes of candidates who applied to their jobs
CREATE POLICY "Employers can view candidate resumes"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'resumes' 
  AND (
    -- Employer can see resumes of candidates who applied to their jobs
    EXISTS (
      SELECT 1 
      FROM applications a
      JOIN jobs j ON j.id = a.job_id
      WHERE j.employer_id = auth.uid()
        AND a.candidate_id::text = (storage.foldername(name))[1]
    )
    OR
    -- Or candidates with public profiles
    EXISTS (
      SELECT 1
      FROM users u
      WHERE u.id::text = (storage.foldername(name))[1]
        AND u.is_profile_public = true
    )
  )
);