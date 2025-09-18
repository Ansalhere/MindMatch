-- First, let's create some auth users and then corresponding users table entries
-- Note: In production, users would be created through the auth system, but for demo we'll create sample data

-- Create some demo user IDs that we'll use consistently
WITH demo_users AS (
  SELECT 
    'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7'::uuid as sarah_id,
    'b2c3d4e5-f6a7-5890-b1c2-d3e4f5a6b7c8'::uuid as raj_id,
    'c3d4e5f6-a7b8-6901-c2d3-e4f5a6b7c8d9'::uuid as alex_id,
    'd4e5f6a7-b8c9-7012-d3e4-f5a6b7c8d9ea'::uuid as priya_id,
    'e5f6a7b8-c9d0-8123-e4f5-a6b7c8d9eafb'::uuid as mike_id,
    'f6a7b8c9-d0e1-9234-f5a6-b7c8d9eafbcg'::uuid as neha_id,
    '17b8c9d0-e1f2-0345-a6b7-c8d9eafbcgdh'::uuid as techcorp_id,
    '28c9d0e1-f2a3-1456-b7c8-d9eafbcgdhei'::uuid as innovate_id,
    '39d0e1f2-a3b4-2567-c8d9-eafbcgdheifj'::uuid as dataflow_id
)

-- Insert sample candidate users
INSERT INTO public.users (id, email, name, user_type, phone, location, bio, rank_score, is_profile_public, company, current_ctc, expected_ctc, avatar_url, is_premium) 
SELECT 
  sarah_id, 'sarah.kumar@email.com', 'Sarah Kumar', 'candidate', '+91-9876543210', 'Bangalore, India', 
  'Full-stack developer with 3+ years experience in React, Node.js, and cloud technologies. Passionate about building scalable applications.', 
  92, true, 'TechCorp Solutions', '₹8,00,000', '₹12,00,000', 
  'https://images.unsplash.com/photo-1494790108755-2616b15b3c5d?w=150&h=150&fit=crop&crop=face', true
FROM demo_users
UNION ALL
SELECT 
  raj_id, 'raj.patel@email.com', 'Raj Patel', 'candidate', '+91-9876543211', 'Mumbai, India',
  'Python backend developer specializing in Django, AWS, and microservices architecture. Strong problem-solving skills.',
  88, true, 'DataFlow Systems', '₹6,50,000', '₹10,00,000',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', true
FROM demo_users
UNION ALL
SELECT 
  alex_id, 'alex.martin@email.com', 'Alex Martin', 'candidate', '+91-9876543212', 'Hyderabad, India',
  'Java enterprise developer with expertise in Spring Boot, MySQL, and distributed systems. 4+ years experience.',
  85, true, 'Enterprise Solutions Ltd', '₹7,50,000', '₹11,50,000',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', true
FROM demo_users
UNION ALL
SELECT 
  priya_id, 'priya.sharma@email.com', 'Priya Sharma', 'candidate', '+91-9876543213', 'Delhi, India',
  'Frontend specialist with Angular, TypeScript, and modern CSS frameworks. UI/UX enthusiast with design thinking approach.',
  90, true, 'Digital Innovations', '₹6,00,000', '₹9,50,000',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', true
FROM demo_users
UNION ALL
SELECT 
  mike_id, 'mike.johnson@email.com', 'Mike Johnson', 'candidate', '+91-9876543214', 'Pune, India',
  'DevOps engineer with Docker, Kubernetes, and CI/CD pipeline expertise. Cloud infrastructure specialist.',
  89, true, 'CloudTech Systems', '₹9,00,000', '₹13,00,000',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', true
FROM demo_users
UNION ALL
SELECT 
  neha_id, 'neha.gupta@email.com', 'Neha Gupta', 'candidate', '+91-9876543215', 'Chennai, India',
  'Mobile app developer with React Native and Flutter experience. Published 5+ apps on app stores.',
  87, true, 'MobileFirst Tech', '₹7,00,000', '₹10,50,000',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', true
FROM demo_users
UNION ALL
-- Insert sample employer users
SELECT 
  techcorp_id, 'hr@techcorp.com', 'TechCorp HR Team', 'employer', '+91-9123456789', 'Bangalore, India',
  'Leading technology company focused on innovative software solutions and digital transformation.',
  NULL, false, 'TechCorp Solutions', NULL, NULL, NULL, true
FROM demo_users
UNION ALL
SELECT 
  innovate_id, 'hiring@innovate.com', 'InnovateTech Recruiter', 'employer', '+91-9123456790', 'Mumbai, India',
  'Fast-growing startup in fintech space, building next-generation financial products.',
  NULL, false, 'InnovateTech', NULL, NULL, NULL, true
FROM demo_users
UNION ALL
SELECT 
  dataflow_id, 'careers@dataflow.com', 'DataFlow Careers', 'employer', '+91-9123456791', 'Hyderabad, India',
  'Data analytics and AI company helping businesses make data-driven decisions.',
  NULL, false, 'DataFlow Analytics', NULL, NULL, NULL, true
FROM demo_users;