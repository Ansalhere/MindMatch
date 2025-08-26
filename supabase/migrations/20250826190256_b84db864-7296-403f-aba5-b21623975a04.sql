-- Update the users table to support admin user type properly
UPDATE public.users 
SET user_type = 'admin', name = 'System Admin'
WHERE email = 'admin@rankme.ai';