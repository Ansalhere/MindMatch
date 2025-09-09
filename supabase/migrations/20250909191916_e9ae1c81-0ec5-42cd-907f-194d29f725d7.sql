-- Update expired job closing dates to future dates and fix sample data with proper descriptions
UPDATE public.jobs 
SET closing_date = CURRENT_DATE + INTERVAL '30 days',
    description = CASE 
      WHEN LENGTH(description) < 50 OR description LIKE '%Lorem ipsum%' OR description LIKE '%placeholder%' OR description = '' 
      THEN 'Join our dynamic team and contribute to exciting projects that make a real impact. We are looking for talented professionals who are passionate about technology and innovation. You will work with cutting-edge tools and technologies while collaborating with a team of experienced professionals. This is an excellent opportunity to grow your career in a supportive and challenging environment.'
      ELSE description
    END
WHERE closing_date < CURRENT_DATE OR LENGTH(description) < 50 OR description LIKE '%Lorem ipsum%' OR description LIKE '%placeholder%' OR description = '';

-- Deactivate jobs with obviously fake or problematic data
UPDATE public.jobs 
SET is_active = false 
WHERE title LIKE '%test%' OR title LIKE '%dummy%' OR title LIKE '%sample%' 
   OR company LIKE '%test%' OR company LIKE '%dummy%' OR company LIKE '%sample%';