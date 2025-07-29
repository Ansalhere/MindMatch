-- Update demo user passwords to meet all validation requirements (8+ chars, uppercase, lowercase, number, special char)
UPDATE auth.users 
SET encrypted_password = crypt('Demo123!', gen_salt('bf'))
WHERE email IN ('alice@example.com', 'bob@example.com', 'techcorp@example.com', 'innovate@example.com');