-- Update the demo users to ensure they are properly confirmed and can login
UPDATE auth.users 
SET 
  email_confirmed_at = now(),
  phone_confirmed_at = now(),
  confirmed_at = now()
WHERE email IN ('alice@example.com', 'bob@example.com', 'techcorp@example.com', 'innovate@example.com');