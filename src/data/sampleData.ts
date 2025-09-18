// Sample data for demo purposes
export const sampleCandidates = [
  {
    id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7',
    email: 'sarah.kumar@email.com',
    name: 'Sarah Kumar',
    user_type: 'candidate',
    phone: '+91-9876543210',
    location: 'Bangalore, India',
    bio: 'Full-stack developer with 3+ years experience in React, Node.js, and cloud technologies. Passionate about building scalable applications.',
    rank_score: 92,
    is_profile_public: true,
    company: 'TechCorp Solutions',
    current_ctc: '₹8,00,000',
    expected_ctc: '₹12,00,000',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b15b3c5d?w=150&h=150&fit=crop&crop=face',
    is_premium: true,
    skills: [
      { name: 'React', level: 8, experience_years: 3 },
      { name: 'Node.js', level: 7, experience_years: 3 },
      { name: 'JavaScript', level: 9, experience_years: 4 },
      { name: 'MongoDB', level: 6, experience_years: 2 }
    ]
  },
  {
    id: 'b2c3d4e5-f6a7-5890-b1c2-d3e4f5a6b7c8',
    email: 'raj.patel@email.com',
    name: 'Raj Patel',
    user_type: 'candidate',
    phone: '+91-9876543211',
    location: 'Mumbai, India',
    bio: 'Python backend developer specializing in Django, AWS, and microservices architecture. Strong problem-solving skills.',
    rank_score: 88,
    is_profile_public: true,
    company: 'DataFlow Systems',
    current_ctc: '₹6,50,000',
    expected_ctc: '₹10,00,000',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    is_premium: true,
    skills: [
      { name: 'Python', level: 9, experience_years: 4 },
      { name: 'Django', level: 8, experience_years: 3 },
      { name: 'AWS', level: 7, experience_years: 2 },
      { name: 'PostgreSQL', level: 8, experience_years: 3 }
    ]
  },
  {
    id: 'c3d4e5f6-a7b8-6901-c2d3-e4f5a6b7c8d9',
    email: 'alex.martin@email.com',
    name: 'Alex Martin',
    user_type: 'candidate',
    phone: '+91-9876543212',
    location: 'Hyderabad, India',
    bio: 'Java enterprise developer with expertise in Spring Boot, MySQL, and distributed systems. 4+ years experience.',
    rank_score: 85,
    is_profile_public: true,
    company: 'Enterprise Solutions Ltd',
    current_ctc: '₹7,50,000',
    expected_ctc: '₹11,50,000',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    is_premium: true,
    skills: [
      { name: 'Java', level: 9, experience_years: 4 },
      { name: 'Spring Boot', level: 8, experience_years: 4 },
      { name: 'MySQL', level: 8, experience_years: 4 },
      { name: 'Microservices', level: 7, experience_years: 2 }
    ]
  },
  {
    id: 'd4e5f6a7-b8c9-7012-d3e4-f5a6b7c8d9ea',
    email: 'priya.sharma@email.com',
    name: 'Priya Sharma',
    user_type: 'candidate',
    phone: '+91-9876543213',
    location: 'Delhi, India',
    bio: 'Frontend specialist with Angular, TypeScript, and modern CSS frameworks. UI/UX enthusiast with design thinking approach.',
    rank_score: 90,
    is_profile_public: true,
    company: 'Digital Innovations',
    current_ctc: '₹6,00,000',
    expected_ctc: '₹9,50,000',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    is_premium: true,
    skills: [
      { name: 'Angular', level: 8, experience_years: 3 },
      { name: 'TypeScript', level: 9, experience_years: 3 },
      { name: 'CSS', level: 9, experience_years: 4 },
      { name: 'HTML', level: 9, experience_years: 4 }
    ]
  },
  {
    id: 'e5f6a7b8-c9d0-8123-e4f5-a6b7c8d9eafb',
    email: 'mike.johnson@email.com',
    name: 'Mike Johnson',
    user_type: 'candidate',
    phone: '+91-9876543214',
    location: 'Pune, India',
    bio: 'DevOps engineer with Docker, Kubernetes, and CI/CD pipeline expertise. Cloud infrastructure specialist.',
    rank_score: 89,
    is_profile_public: true,
    company: 'CloudTech Systems',
    current_ctc: '₹9,00,000',
    expected_ctc: '₹13,00,000',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    is_premium: true,
    skills: [
      { name: 'Docker', level: 9, experience_years: 3 },
      { name: 'Kubernetes', level: 8, experience_years: 2 },
      { name: 'Jenkins', level: 7, experience_years: 3 },
      { name: 'AWS', level: 8, experience_years: 3 }
    ]
  },
  {
    id: 'f6a7b8c9-d0e1-9234-f5a6-b7c8d9eafbcd',
    email: 'neha.gupta@email.com',
    name: 'Neha Gupta',
    user_type: 'candidate',
    phone: '+91-9876543215',
    location: 'Chennai, India',
    bio: 'Mobile app developer with React Native and Flutter experience. Published 5+ apps on app stores.',
    rank_score: 87,
    is_profile_public: true,
    company: 'MobileFirst Tech',
    current_ctc: '₹7,00,000',
    expected_ctc: '₹10,50,000',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    is_premium: true,
    skills: [
      { name: 'React Native', level: 8, experience_years: 3 },
      { name: 'Flutter', level: 7, experience_years: 2 },
      { name: 'JavaScript', level: 8, experience_years: 3 },
      { name: 'Mobile Development', level: 9, experience_years: 3 }
    ]
  }
];

export const sampleEmployers = [
  {
    id: 'a7b8c9d0-e1f2-0345-a6b7-c8d9eafbcdea',
    email: 'hr@techcorp.com',
    name: 'TechCorp HR Team',
    user_type: 'employer',
    phone: '+91-9123456789',
    location: 'Bangalore, India',
    bio: 'Leading technology company focused on innovative software solutions and digital transformation.',
    company: 'TechCorp Solutions',
    industry: 'Technology',
    size: '1000-5000',
    website: 'https://techcorp.com',
    is_premium: true
  },
  {
    id: 'b8c9d0e1-f2a3-1456-b7c8-d9eafbcdeafb',
    email: 'hiring@innovate.com',
    name: 'InnovateTech Recruiter',
    user_type: 'employer',
    phone: '+91-9123456790',
    location: 'Mumbai, India',
    bio: 'Fast-growing startup in fintech space, building next-generation financial products.',
    company: 'InnovateTech',
    industry: 'FinTech',
    size: '100-500',
    website: 'https://innovatetech.com',
    is_premium: true
  },
  {
    id: 'c9d0e1f2-a3b4-2567-c8d9-eafbcdefabcd',
    email: 'careers@dataflow.com',
    name: 'DataFlow Careers',
    user_type: 'employer',
    phone: '+91-9123456791',
    location: 'Hyderabad, India',
    bio: 'Data analytics and AI company helping businesses make data-driven decisions.',
    company: 'DataFlow Analytics',
    industry: 'Data & Analytics',
    size: '500-1000',
    website: 'https://dataflow.com',
    is_premium: true
  }
];

export const sampleJobs = [
  {
    id: '1a2b3c4d-5e6f-7890-a1b2-c3d4e5f6a7b8',
    employer_id: 'a7b8c9d0-e1f2-0345-a6b7-c8d9eafbcdea',
    title: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies like React, Node.js, and cloud platforms. The ideal candidate should have strong problem-solving skills and experience with agile development methodologies.',
    location: 'Bangalore, India',
    job_type: 'full-time',
    required_skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'AWS'],
    min_experience: 3,
    salary_min: 800000,
    salary_max: 1200000,
    min_rank_requirement: 75,
    closing_date: '2024-03-28',
    is_active: true,
    employer: {
      company: 'TechCorp Solutions',
      name: 'TechCorp HR Team'
    },
    applications: [
      {
        id: 'app1',
        candidate_id: 'a1b2c3d4-e5f6-4789-a0b1-c2d3e4f5a6b7',
        status: 'pending',
        created_at: '2024-01-15T10:30:00Z',
        candidate_note: 'I am excited about this opportunity to work with cutting-edge technologies. My experience with React and Node.js aligns perfectly with your requirements.',
        candidate: sampleCandidates[0]
      }
    ]
  },
  {
    id: '2b3c4d5e-6f78-9012-b2c3-d4e5f6a7b8c9',
    employer_id: 'b8c9d0e1-f2a3-1456-b7c8-d9eafbcdeafb',
    title: 'Python Backend Developer',
    description: 'Join our growing team as a Python Backend Developer! You will work on building scalable microservices, APIs, and data processing systems. Experience with Django/Flask, databases, and cloud technologies is essential.',
    location: 'Mumbai, India',
    job_type: 'full-time',
    required_skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'],
    min_experience: 2,
    salary_min: 600000,
    salary_max: 1000000,
    min_rank_requirement: 70,
    closing_date: '2024-03-25',
    is_active: true,
    employer: {
      company: 'InnovateTech',
      name: 'InnovateTech Recruiter'
    },
    applications: [
      {
        id: 'app2',
        candidate_id: 'b2c3d4e5-f6a7-5890-b1c2-d3e4f5a6b7c8',
        status: 'pending',
        created_at: '2024-01-16T14:20:00Z',
        candidate_note: 'I have extensive experience building scalable backend systems with Python and Django. I would love to contribute to your growing team.',
        candidate: sampleCandidates[1]
      }
    ]
  },
  {
    id: '3c4d5e6f-7890-1234-c3d4-e5f6a7b8c9da',
    employer_id: 'c9d0e1f2-a3b4-2567-c8d9-eafbcdefabcd',
    title: 'Frontend React Developer',
    description: 'We are seeking a talented Frontend Developer with expertise in React and modern JavaScript frameworks. You will be responsible for creating responsive, user-friendly interfaces.',
    location: 'Hyderabad, India',
    job_type: 'full-time',
    required_skills: ['React', 'JavaScript', 'CSS', 'HTML', 'Redux'],
    min_experience: 2,
    salary_min: 500000,
    salary_max: 850000,
    min_rank_requirement: 65,
    closing_date: '2024-04-05',
    is_active: true,
    employer: {
      company: 'DataFlow Analytics',
      name: 'DataFlow Careers'
    },
    applications: [
      {
        id: 'app3',
        candidate_id: 'd4e5f6a7-b8c9-7012-d3e4-f5a6b7c8d9ea',
        status: 'pending',
        created_at: '2024-01-17T09:15:00Z',
        candidate_note: 'With my strong background in React and UI/UX design, I can help create exceptional user experiences for your applications.',
        candidate: sampleCandidates[3]
      }
    ]
  },
  {
    id: '4d5e6f78-9012-3456-d4e5-f6a7b8c9daeb',
    employer_id: 'a7b8c9d0-e1f2-0345-a6b7-c8d9eafbcdea',
    title: 'DevOps Engineer',
    description: 'Looking for a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You will work with containerization technologies, monitoring tools, and automation frameworks.',
    location: 'Bangalore, India',
    job_type: 'full-time',
    required_skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform'],
    min_experience: 3,
    salary_min: 900000,
    salary_max: 1400000,
    min_rank_requirement: 80,
    closing_date: '2024-04-10',
    is_active: true,
    employer: {
      company: 'TechCorp Solutions',
      name: 'TechCorp HR Team'
    },
    applications: [
      {
        id: 'app4',
        candidate_id: 'e5f6a7b8-c9d0-8123-e4f5-a6b7c8d9eafb',
        status: 'pending',
        created_at: '2024-01-18T11:45:00Z',
        candidate_note: 'My experience with Docker, Kubernetes, and AWS makes me an ideal candidate for this role. I am passionate about automation and infrastructure optimization.',
        candidate: sampleCandidates[4]
      }
    ]
  },
  {
    id: '5e6f7890-1234-5678-e5f6-a7b8c9daebfc',
    employer_id: 'b8c9d0e1-f2a3-1456-b7c8-d9eafbcdeafb',
    title: 'Mobile App Developer',
    description: 'Join our mobile team to build cross-platform applications using React Native or Flutter. You will work on consumer-facing applications with millions of users.',
    location: 'Mumbai, India',
    job_type: 'full-time',
    required_skills: ['React Native', 'Flutter', 'JavaScript', 'Mobile Development'],
    min_experience: 2,
    salary_min: 650000,
    salary_max: 1100000,
    min_rank_requirement: 70,
    closing_date: '2024-04-15',
    is_active: true,
    employer: {
      company: 'InnovateTech',
      name: 'InnovateTech Recruiter'
    },
    applications: [
      {
        id: 'app5',
        candidate_id: 'f6a7b8c9-d0e1-9234-f5a6-b7c8d9eafbcd',
        status: 'pending',
        created_at: '2024-01-19T16:30:00Z',
        candidate_note: 'I have successfully built and deployed multiple mobile applications. I am excited to work on consumer-facing apps with large user bases.',
        candidate: sampleCandidates[5]
      }
    ]
  }
];