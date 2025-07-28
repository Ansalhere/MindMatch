-- Update demo user passwords to meet 8-character minimum requirement
UPDATE auth.users 
SET encrypted_password = crypt('demo1234', gen_salt('bf'))
WHERE email IN ('alice@example.com', 'bob@example.com', 'techcorp@example.com', 'innovate@example.com');