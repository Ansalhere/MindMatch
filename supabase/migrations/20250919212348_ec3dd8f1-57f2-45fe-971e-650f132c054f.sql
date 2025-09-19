-- Update existing employers with proper company and location data
UPDATE public.users SET 
  company = 'Z-Crossing Solutions Pvt Ltd',
  location = 'Bangalore, India',
  industry = 'Technology',
  size = '100-500',
  website = 'https://z-crossing.com'
WHERE email = 'akshay.madhu@z-crossing.com' AND user_type = 'employer';

UPDATE public.users SET 
  company = 'UST Global',
  location = 'Kochi, India', 
  industry = 'IT Services',
  size = '1000+',
  website = 'https://ust.com'
WHERE email = 'afnahr1@gmail.com' AND user_type = 'employer';

-- Update other employers with placeholder company data
UPDATE public.users SET 
  company = COALESCE(company, name || ' Enterprises'),
  location = COALESCE(location, 'India'),
  industry = COALESCE(industry, 'Technology'),
  size = COALESCE(size, '10-50')
WHERE user_type = 'employer' AND company IS NULL;