// Sample candidate profiles
export const sampleCandidates = [
  {
    id: "c1",
    name: "John Smith",
    title: "Frontend Developer",
    email: "john.smith@example.com",
    password: "password123", // In a real app, this would be hashed
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    education: "Bachelor's in Computer Science",
    availability: "Immediately",
    avatar: "https://i.pravatar.cc/150?img=1",
    skills: ["React", "TypeScript", "CSS", "Node.js", "UI/UX"],
    ranking: {
      overall: 92,
      position: 45,
      total: 5000
    },
    skillRankings: [
      {
        name: "React.js",
        score: 94,
        ranking: 67,
        total: 4200
      },
      {
        name: "TypeScript",
        score: 87,
        ranking: 120,
        total: 3800
      },
      {
        name: "UI/UX",
        score: 79,
        ranking: 230,
        total: 4500
      }
    ],
    projects: [
      {
        name: "E-commerce Platform",
        technologies: ["React", "Node.js", "MongoDB"],
        description: "Developed a full-stack e-commerce platform with product catalog, shopping cart, and payment integration."
      },
      {
        name: "Social Media Dashboard",
        technologies: ["TypeScript", "React", "Firebase"],
        description: "Created an analytics dashboard for social media accounts with real-time data visualization."
      }
    ],
    applications: [
      {
        company: "TechCorp Inc.",
        position: "Frontend Developer",
        date: "2 days ago",
        status: "Pending"
      },
      {
        company: "InnovateTech",
        position: "UI Developer",
        date: "1 week ago",
        status: "Accepted"
      },
      {
        company: "CodeMasters",
        position: "React Developer",
        date: "2 weeks ago",
        status: "Rejected"
      }
    ]
  },
  {
    id: "c2",
    name: "Sarah Johnson",
    title: "Data Scientist",
    email: "sarah.j@example.com",
    password: "password123", // In a real app, this would be hashed
    phone: "+1 (555) 987-6543",
    location: "Boston, MA",
    education: "Master's in Data Science",
    availability: "2 weeks notice",
    avatar: "https://i.pravatar.cc/150?img=5",
    skills: ["Python", "Machine Learning", "SQL", "TensorFlow", "Data Visualization"],
    ranking: {
      overall: 96,
      position: 18,
      total: 3500
    },
    skillRankings: [
      {
        name: "Python",
        score: 98,
        ranking: 15,
        total: 3200
      },
      {
        name: "Machine Learning",
        score: 95,
        ranking: 22,
        total: 2800
      },
      {
        name: "Data Visualization",
        score: 92,
        ranking: 31,
        total: 3000
      }
    ],
    projects: [
      {
        name: "Customer Churn Prediction",
        technologies: ["Python", "TensorFlow", "Pandas"],
        description: "Built a machine learning model to predict customer churn with 89% accuracy."
      },
      {
        name: "Stock Market Analysis Tool",
        technologies: ["Python", "NumPy", "Matplotlib"],
        description: "Developed a tool for analyzing stock market trends and making predictions based on historical data."
      }
    ],
    applications: [
      {
        company: "DataTech Solutions",
        position: "Data Scientist",
        date: "3 days ago",
        status: "Pending"
      },
      {
        company: "AI Innovations",
        position: "Machine Learning Engineer",
        date: "1 week ago",
        status: "Pending"
      },
      {
        company: "Analytics Co.",
        position: "Data Analyst",
        date: "3 weeks ago",
        status: "Accepted"
      }
    ]
  },
  {
    id: "c3",
    name: "Michael Chen",
    title: "Mobile Developer",
    email: "michael.c@example.com",
    password: "password123", // In a real app, this would be hashed
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    education: "Bachelor's in Software Engineering",
    availability: "1 month notice",
    avatar: "https://i.pravatar.cc/150?img=3",
    skills: ["Swift", "iOS", "React Native", "Firebase", "UX Design"],
    ranking: {
      overall: 88,
      position: 103,
      total: 4200
    },
    skillRankings: [
      {
        name: "React Native",
        score: 92,
        ranking: 87,
        total: 3600
      },
      {
        name: "iOS Development",
        score: 89,
        ranking: 112,
        total: 4000
      },
      {
        name: "UI/UX",
        score: 85,
        ranking: 158,
        total: 4500
      }
    ],
    projects: [
      {
        name: "Fitness Tracking App",
        technologies: ["Swift", "HealthKit", "Firebase"],
        description: "Created an iOS app for tracking workouts, nutrition, and fitness goals with Apple Health integration."
      },
      {
        name: "Food Delivery App",
        technologies: ["React Native", "Firebase", "Google Maps API"],
        description: "Developed a cross-platform food delivery app with real-time order tracking."
      }
    ],
    applications: [
      {
        company: "MobileTech",
        position: "iOS Developer",
        date: "5 days ago",
        status: "Pending"
      },
      {
        company: "AppWorks",
        position: "Mobile Developer",
        date: "2 weeks ago",
        status: "Rejected"
      },
      {
        company: "Tech Innovators",
        position: "React Native Developer",
        date: "3 weeks ago",
        status: "Accepted"
      }
    ]
  }
];

// Sample employer profiles
export const sampleEmployers = [
  {
    id: "e1",
    company: "TechCorp Inc.",
    industry: "Software Development",
    email: "hr@techcorp.com",
    password: "employer123", // In a real app, this would be hashed
    website: "www.techcorp.com",
    location: "San Francisco, CA",
    size: "50-200",
    founded: "Founded in 2015",
    avatar: "https://logo.clearbit.com/github.com",
    about: "TechCorp is a leading software development company specializing in web and mobile applications. We work with startups and established businesses to create innovative solutions.",
    rating: {
      overall: 4.7,
      environment: 5,
      growth: 4,
      worklife: 5
    },
    culture: [
      "Remote-friendly",
      "Flexible hours",
      "Professional development",
      "Team events",
      "Health benefits",
      "Modern tools"
    ],
    jobs: [
      {
        title: "Frontend Developer",
        department: "Engineering",
        type: "Full-time",
        location: "Remote",
        applicants: 42,
        posted: "5 days ago"
      },
      {
        title: "UX Designer",
        department: "Design",
        type: "Contract",
        location: "Hybrid",
        applicants: 18,
        posted: "1 week ago"
      },
      {
        title: "DevOps Engineer",
        department: "Infrastructure",
        type: "Full-time",
        location: "On-site",
        applicants: 15,
        posted: "2 weeks ago"
      }
    ],
    hiringProcess: [
      {
        title: "Application Review",
        description: "We review all applications within 48 hours of submission."
      },
      {
        title: "Initial Screening",
        description: "A 30-minute call with our HR team to discuss your experience and interests."
      },
      {
        title: "Technical Assessment",
        description: "A practical task relevant to the role you're applying for."
      },
      {
        title: "Team Interview",
        description: "Meet with the team you'll be working with and discuss technical details."
      },
      {
        title: "Final Decision",
        description: "We aim to make a decision within one week of the final interview."
      }
    ]
  },
  {
    id: "e2",
    company: "DataTech Solutions",
    industry: "Data Analytics & AI",
    email: "careers@datatech.com",
    password: "employer123", // In a real app, this would be hashed
    website: "www.datatech.com",
    location: "Boston, MA",
    size: "200-500",
    founded: "Founded in 2010",
    avatar: "https://logo.clearbit.com/databricks.com",
    about: "DataTech Solutions is an industry leader in data analytics and artificial intelligence. We help businesses transform their data into actionable insights and competitive advantages.",
    rating: {
      overall: 4.3,
      environment: 4,
      growth: 5,
      worklife: 4
    },
    culture: [
      "Innovation-driven",
      "Continuous learning",
      "Collaborative environment",
      "Research publications",
      "Industry conferences",
      "Educational stipends"
    ],
    jobs: [
      {
        title: "Data Scientist",
        department: "Analytics",
        type: "Full-time",
        location: "On-site",
        applicants: 64,
        posted: "3 days ago"
      },
      {
        title: "Machine Learning Engineer",
        department: "AI Research",
        type: "Full-time",
        location: "Hybrid",
        applicants: 47,
        posted: "1 week ago"
      },
      {
        title: "Data Engineer",
        department: "Infrastructure",
        type: "Full-time",
        location: "Remote",
        applicants: 31,
        posted: "2 weeks ago"
      }
    ],
    hiringProcess: [
      {
        title: "Resume Screening",
        description: "We carefully review your qualifications and experience."
      },
      {
        title: "Technical Phone Screen",
        description: "A discussion about your technical background and approach to problem-solving."
      },
      {
        title: "Technical Challenge",
        description: "A take-home assignment to demonstrate your skills in data analysis and modeling."
      },
      {
        title: "Panel Interview",
        description: "Meet with our team to discuss your solution and technical expertise."
      },
      {
        title: "Executive Interview",
        description: "A final discussion with department leadership about your career goals."
      }
    ]
  },
  {
    id: "e3",
    company: "MobileTech",
    industry: "Mobile App Development",
    email: "jobs@mobiletech.com",
    password: "employer123", // In a real app, this would be hashed
    website: "www.mobiletech.com",
    location: "Seattle, WA",
    size: "10-50",
    founded: "Founded in 2018",
    avatar: "https://logo.clearbit.com/flutter.dev",
    about: "MobileTech is a specialized mobile app development company focusing on creating exceptional user experiences for iOS and Android. We work with startups and enterprises to bring innovative app ideas to life.",
    rating: {
      overall: 4.5,
      environment: 5,
      growth: 4,
      worklife: 4
    },
    culture: [
      "Creative workspace",
      "Startup atmosphere",
      "Device allowance",
      "Weekly demos",
      "Hackathons",
      "Casual dress code"
    ],
    jobs: [
      {
        title: "iOS Developer",
        department: "Mobile Development",
        type: "Full-time",
        location: "Hybrid",
        applicants: 28,
        posted: "5 days ago"
      },
      {
        title: "Android Developer",
        department: "Mobile Development",
        type: "Full-time",
        location: "Remote",
        applicants: 32,
        posted: "1 week ago"
      },
      {
        title: "Mobile UI/UX Designer",
        department: "Design",
        type: "Contract",
        location: "On-site",
        applicants: 17,
        posted: "2 weeks ago"
      }
    ],
    hiringProcess: [
      {
        title: "Portfolio Review",
        description: "We look at your previous work and projects to assess your skills."
      },
      {
        title: "Initial Interview",
        description: "A conversation about your experience and approach to mobile development."
      },
      {
        title: "Coding Challenge",
        description: "A practical exercise to demonstrate your mobile development skills."
      },
      {
        title: "Team Interview",
        description: "Meet with our development team to discuss technical details and teamwork."
      },
      {
        title: "Offer Stage",
        description: "If selected, we'll present you with a competitive offer within a week."
      }
    ]
  }
];

// Sample login credentials that match the demo users created in the database
export const sampleLogins = {
  candidates: [
    { email: 'alice@example.com', password: 'Demo123!' },
    { email: 'bob@example.com', password: 'Demo123!' }
  ],
  employers: [
    { email: 'techcorp@example.com', password: 'Demo123!' },
    { email: 'innovate@example.com', password: 'Demo123!' }
  ]
};
