-- Update expired job closing dates to future dates and fix sample data
UPDATE public.jobs 
SET closing_date = CURRENT_DATE + INTERVAL '30 days',
    description = CASE 
      WHEN description LIKE '%Lorem ipsum%' OR description LIKE '%placeholder%' OR description = '' 
      THEN 'Join our team! We are looking for talented professionals to help us build amazing products and deliver exceptional results to our clients.'
      ELSE description
    END
WHERE closing_date < CURRENT_DATE OR description LIKE '%Lorem ipsum%' OR description LIKE '%placeholder%' OR description = '';

-- Deactivate jobs with obviously fake or problematic data
UPDATE public.jobs 
SET is_active = false 
WHERE title LIKE '%test%' OR title LIKE '%dummy%' OR title LIKE '%sample%' 
   OR company LIKE '%test%' OR company LIKE '%dummy%' OR company LIKE '%sample%';