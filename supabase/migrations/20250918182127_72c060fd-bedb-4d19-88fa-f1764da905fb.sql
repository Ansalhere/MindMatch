-- Insert sample candidate users
INSERT INTO public.users (id, email, name, user_type, phone, location, bio, rank_score, is_profile_public, company, current_ctc, expected_ctc, avatar_url) VALUES
(gen_random_uuid(), 'sarah.kumar@email.com', 'Sarah Kumar', 'candidate', '+91-9876543210', 'Bangalore, India', 'Full-stack developer with 3+ years experience in React, Node.js, and cloud technologies. Passionate about building scalable applications.', 92, true, 'TechCorp Solutions', '₹8,00,000', '₹12,00,000', 'https://images.unsplash.com/photo-1494790108755-2616b15b3c5d?w=150&h=150&fit=crop&crop=face'),
(gen_random_uuid(), 'raj.patel@email.com', 'Raj Patel', 'candidate', '+91-9876543211', 'Mumbai, India', 'Python backend developer specializing in Django, AWS, and microservices architecture. Strong problem-solving skills.', 88, true, 'DataFlow Systems', '₹6,50,000', '₹10,00,000', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
(gen_random_uuid(), 'alex.martin@email.com', 'Alex Martin', 'candidate', '+91-9876543212', 'Hyderabad, India', 'Java enterprise developer with expertise in Spring Boot, MySQL, and distributed systems. 4+ years experience.', 85, true, 'Enterprise Solutions Ltd', '₹7,50,000', '₹11,50,000', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'),
(gen_random_uuid(), 'priya.sharma@email.com', 'Priya Sharma', 'candidate', '+91-9876543213', 'Delhi, India', 'Frontend specialist with Angular, TypeScript, and modern CSS frameworks. UI/UX enthusiast with design thinking approach.', 90, true, 'Digital Innovations', '₹6,00,000', '₹9,50,000', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'),
(gen_random_uuid(), 'mike.johnson@email.com', 'Mike Johnson', 'candidate', '+91-9876543214', 'Pune, India', 'DevOps engineer with Docker, Kubernetes, and CI/CD pipeline expertise. Cloud infrastructure specialist.', 89, true, 'CloudTech Systems', '₹9,00,000', '₹13,00,000', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'),
(gen_random_uuid(), 'neha.gupta@email.com', 'Neha Gupta', 'candidate', '+91-9876543215', 'Chennai, India', 'Mobile app developer with React Native and Flutter experience. Published 5+ apps on app stores.', 87, true, 'MobileFirst Tech', '₹7,00,000', '₹10,50,000', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face');

-- Insert sample employer users
INSERT INTO public.users (id, email, name, user_type, phone, location, bio, company, industry, size, website, is_premium) VALUES
(gen_random_uuid(), 'hr@techcorp.com', 'TechCorp HR Team', 'employer', '+91-9123456789', 'Bangalore, India', 'Leading technology company focused on innovative software solutions and digital transformation.', 'TechCorp Solutions', 'Technology', '1000-5000', 'https://techcorp.com', true),
(gen_random_uuid(), 'hiring@innovate.com', 'InnovateTech Recruiter', 'employer', '+91-9123456790', 'Mumbai, India', 'Fast-growing startup in fintech space, building next-generation financial products.', 'InnovateTech', 'FinTech', '100-500', 'https://innovatetech.com', true),
(gen_random_uuid(), 'careers@dataflow.com', 'DataFlow Careers', 'employer', '+91-9123456791', 'Hyderabad, India', 'Data analytics and AI company helping businesses make data-driven decisions.', 'DataFlow Analytics', 'Data & Analytics', '500-1000', 'https://dataflow.com', true);

-- Insert sample job posts
INSERT INTO public.jobs (id, employer_id, title, description, location, job_type, required_skills, min_experience, salary_min, salary_max, min_rank_requirement, closing_date, is_active) VALUES
(gen_random_uuid(), (SELECT id FROM public.users WHERE email = 'hr@techcorp.com'), 'Senior Full Stack Developer', 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies like React, Node.js, and cloud platforms. The ideal candidate should have strong problem-solving skills and experience with agile development methodologies.', 'Bangalore, India', 'full-time', ARRAY['React', 'Node.js', 'JavaScript', 'MongoDB', 'AWS'], 3, 800000, 1200000, 75, '2024-02-28', true),
(gen_random_uuid(), (SELECT id FROM public.users WHERE email = 'hiring@innovate.com'), 'Python Backend Developer', 'Join our growing team as a Python Backend Developer! You will work on building scalable microservices, APIs, and data processing systems. Experience with Django/Flask, databases, and cloud technologies is essential. We offer a collaborative environment with opportunities for growth.', 'Mumbai, India', 'full-time', ARRAY['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'], 2, 600000, 1000000, 70, '2024-02-25', true),
(gen_random_uuid(), (SELECT id FROM public.users WHERE email = 'careers@dataflow.com'), 'Frontend React Developer', 'We are seeking a talented Frontend Developer with expertise in React and modern JavaScript frameworks. You will be responsible for creating responsive, user-friendly interfaces and collaborating with our design team to implement pixel-perfect designs. Knowledge of state management and testing is a plus.', 'Hyderabad, India', 'full-time', ARRAY['React', 'JavaScript', 'CSS', 'HTML', 'Redux'], 2, 500000, 850000, 65, '2024-03-05', true),
(gen_random_uuid(), (SELECT id FROM public.users WHERE email = 'hr@techcorp.com'), 'DevOps Engineer', 'Looking for a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You will work with containerization technologies, monitoring tools, and automation frameworks. Experience with AWS/Azure, Kubernetes, and Infrastructure as Code is required.', 'Bangalore, India', 'full-time', ARRAY['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'], 3, 900000, 1400000, 80, '2024-03-10', true),
(gen_random_uuid(), (SELECT id FROM public.users WHERE email = 'hiring@innovate.com'), 'Mobile App Developer', 'Join our mobile team to build cross-platform applications using React Native or Flutter. You will work on consumer-facing applications with millions of users. Experience with app store deployment and mobile-specific optimizations is preferred.', 'Mumbai, India', 'full-time', ARRAY['React Native', 'Flutter', 'JavaScript', 'Mobile Development'], 2, 650000, 1100000, 70, '2024-03-15', true),
(gen_random_uuid(), (SELECT id FROM public.users WHERE email = 'careers@dataflow.com'), 'Data Scientist', 'Seeking a Data Scientist to join our analytics team. You will work on machine learning models, data visualization, and statistical analysis. Strong knowledge of Python, SQL, and ML frameworks is essential. Experience with big data technologies is a plus.', 'Hyderabad, India', 'full-time', ARRAY['Python', 'Machine Learning', 'SQL', 'TensorFlow', 'Pandas'], 2, 700000, 1200000, 75, '2024-03-20', true);

-- Add sample skills for candidates
INSERT INTO public.skills (user_id, name, level, experience_years) VALUES
((SELECT id FROM public.users WHERE email = 'sarah.kumar@email.com'), 'React', 8, 3),
((SELECT id FROM public.users WHERE email = 'sarah.kumar@email.com'), 'Node.js', 7, 3),
((SELECT id FROM public.users WHERE email = 'sarah.kumar@email.com'), 'JavaScript', 9, 4),
((SELECT id FROM public.users WHERE email = 'sarah.kumar@email.com'), 'MongoDB', 6, 2),
((SELECT id FROM public.users WHERE email = 'raj.patel@email.com'), 'Python', 9, 4),
((SELECT id FROM public.users WHERE email = 'raj.patel@email.com'), 'Django', 8, 3),
((SELECT id FROM public.users WHERE email = 'raj.patel@email.com'), 'AWS', 7, 2),
((SELECT id FROM public.users WHERE email = 'raj.patel@email.com'), 'PostgreSQL', 8, 3),
((SELECT id FROM public.users WHERE email = 'alex.martin@email.com'), 'Java', 9, 4),
((SELECT id FROM public.users WHERE email = 'alex.martin@email.com'), 'Spring Boot', 8, 4),
((SELECT id FROM public.users WHERE email = 'alex.martin@email.com'), 'MySQL', 8, 4),
((SELECT id FROM public.users WHERE email = 'alex.martin@email.com'), 'Microservices', 7, 2),
((SELECT id FROM public.users WHERE email = 'priya.sharma@email.com'), 'Angular', 8, 3),
((SELECT id FROM public.users WHERE email = 'priya.sharma@email.com'), 'TypeScript', 9, 3),
((SELECT id FROM public.users WHERE email = 'priya.sharma@email.com'), 'CSS', 9, 4),
((SELECT id FROM public.users WHERE email = 'priya.sharma@email.com'), 'HTML', 9, 4),
((SELECT id FROM public.users WHERE email = 'mike.johnson@email.com'), 'Docker', 9, 3),
((SELECT id FROM public.users WHERE email = 'mike.johnson@email.com'), 'Kubernetes', 8, 2),
((SELECT id FROM public.users WHERE email = 'mike.johnson@email.com'), 'Jenkins', 7, 3),
((SELECT id FROM public.users WHERE email = 'mike.johnson@email.com'), 'AWS', 8, 3),
((SELECT id FROM public.users WHERE email = 'neha.gupta@email.com'), 'React Native', 8, 3),
((SELECT id FROM public.users WHERE email = 'neha.gupta@email.com'), 'Flutter', 7, 2),
((SELECT id FROM public.users WHERE email = 'neha.gupta@email.com'), 'JavaScript', 8, 3),
((SELECT id FROM public.users WHERE email = 'neha.gupta@email.com'), 'Mobile Development', 9, 3);

-- Add sample applications
INSERT INTO public.applications (job_id, candidate_id, status, candidate_note) VALUES
((SELECT id FROM public.jobs WHERE title = 'Senior Full Stack Developer'), (SELECT id FROM public.users WHERE email = 'sarah.kumar@email.com'), 'pending', 'I am excited about this opportunity to work with cutting-edge technologies. My experience with React and Node.js aligns perfectly with your requirements.'),
((SELECT id FROM public.jobs WHERE title = 'Python Backend Developer'), (SELECT id FROM public.users WHERE email = 'raj.patel@email.com'), 'pending', 'I have extensive experience building scalable backend systems with Python and Django. I would love to contribute to your growing team.'),
((SELECT id FROM public.jobs WHERE title = 'Frontend React Developer'), (SELECT id FROM public.users WHERE email = 'priya.sharma@email.com'), 'pending', 'With my strong background in React and UI/UX design, I can help create exceptional user experiences for your applications.'),
((SELECT id FROM public.jobs WHERE title = 'DevOps Engineer'), (SELECT id FROM public.users WHERE email = 'mike.johnson@email.com'), 'pending', 'My experience with Docker, Kubernetes, and AWS makes me an ideal candidate for this role. I am passionate about automation and infrastructure optimization.'),
((SELECT id FROM public.jobs WHERE title = 'Mobile App Developer'), (SELECT id FROM public.users WHERE email = 'neha.gupta@email.com'), 'pending', 'I have successfully built and deployed multiple mobile applications. I am excited to work on consumer-facing apps with large user bases.');