-- Create super admin user
INSERT INTO users (id, email, name, user_type, created_at) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@rankme.ai', 
  'Super Admin',
  'admin',
  now()
)
ON CONFLICT (id) DO NOTHING;