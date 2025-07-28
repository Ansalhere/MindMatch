-- Update the demo users to ensure their email is confirmed so they can login
UPDATE auth.users 
SET 
  email_confirmed_at = now()
WHERE email IN ('alice@example.com', 'bob@example.com', 'techcorp@example.com', 'innovate@example.com')
  AND email_confirmed_at IS NULL;