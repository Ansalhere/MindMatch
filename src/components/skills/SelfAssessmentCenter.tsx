import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Code, 
  Database, 
  Users, 
  Briefcase, 
  Globe, 
  Palette, 
  BarChart3, 
  Shield,
  Brain,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

interface AssessmentCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  skills: string[];
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const assessmentCategories: AssessmentCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Test your HTML, CSS, JavaScript, React, and UI/UX skills',
    icon: Code,
    skills: ['HTML/CSS', 'JavaScript', 'React', 'TypeScript', 'UI/UX Design'],
    estimatedTime: '45 minutes',
    difficulty: 'Intermediate'
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Assess your server-side programming and API development knowledge',
    icon: Database,
    skills: ['Node.js', 'Python', 'Java', 'API Design', 'Database Design'],
    estimatedTime: '60 minutes',
    difficulty: 'Advanced'
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics',
    description: 'Evaluate your data analysis, machine learning, and statistics skills',
    icon: BarChart3,
    skills: ['Python/R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'],
    estimatedTime: '75 minutes',
    difficulty: 'Advanced'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Test your knowledge in SEO, social media, and online advertising',
    icon: Globe,
    skills: ['SEO', 'Social Media Marketing', 'Google Ads', 'Content Strategy', 'Analytics'],
    estimatedTime: '30 minutes',
    difficulty: 'Beginner'
  },
  {
    id: 'design',
    title: 'Design & Creative',
    description: 'Assess your graphic design, branding, and creative thinking abilities',
    icon: Palette,
    skills: ['Graphic Design', 'Branding', 'Adobe Creative Suite', 'UI/UX', 'Typography'],
    estimatedTime: '40 minutes',
    difficulty: 'Intermediate'
  },
  {
    id: 'management',
    title: 'Project Management',
    description: 'Evaluate your leadership, planning, and team management skills',
    icon: Users,
    skills: ['Project Planning', 'Team Leadership', 'Agile/Scrum', 'Risk Management', 'Communication'],
    estimatedTime: '35 minutes',
    difficulty: 'Intermediate'
  },
  {
    id: 'sales',
    title: 'Sales & Business Development',
    description: 'Test your sales techniques, negotiation, and customer relationship skills',
    icon: Target,
    skills: ['Sales Strategy', 'Negotiation', 'CRM', 'Lead Generation', 'Customer Relations'],
    estimatedTime: '25 minutes',
    difficulty: 'Beginner'
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Assess your knowledge in security protocols, threat analysis, and risk management',
    icon: Shield,
    skills: ['Network Security', 'Threat Analysis', 'Compliance', 'Incident Response', 'Penetration Testing'],
    estimatedTime: '50 minutes',
    difficulty: 'Advanced'
  },
  {
    id: 'hr',
    title: 'Human Resources',
    description: 'Evaluate your HR policies, recruitment, and employee management knowledge',
    icon: Briefcase,
    skills: ['Recruitment', 'Employee Relations', 'Performance Management', 'HR Policies', 'Training & Development'],
    estimatedTime: '30 minutes',
    difficulty: 'Intermediate'
  },
  {
    id: 'soft-skills',
    title: 'Soft Skills & Communication',
    description: 'Test your interpersonal, communication, and problem-solving abilities',
    icon: Brain,
    skills: ['Communication', 'Problem Solving', 'Time Management', 'Emotional Intelligence', 'Adaptability'],
    estimatedTime: '20 minutes',
    difficulty: 'Beginner'
  },
  {
    id: 'blockchain',
    title: 'Blockchain & Web3',
    description: 'Test your blockchain, cryptocurrency, and decentralized application knowledge',
    icon: Code,
    skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3.js', 'DeFi', 'NFTs'],
    estimatedTime: '40 minutes',
    difficulty: 'Advanced'
  },
  {
    id: 'ai-ml',
    title: 'AI & Deep Learning',
    description: 'Advanced assessment of artificial intelligence and deep learning techniques',
    icon: BarChart3,
    skills: ['Neural Networks', 'NLP', 'Computer Vision', 'Reinforcement Learning', 'LLMs', 'TensorFlow'],
    estimatedTime: '60 minutes',
    difficulty: 'Advanced'
  },
  {
    id: 'qa-testing',
    title: 'Quality Assurance & Testing',
    description: 'Evaluate your software testing, QA methodologies, and automation expertise',
    icon: Shield,
    skills: ['Test Automation', 'Jest', 'Selenium', 'Cypress', 'Performance Testing', 'API Testing'],
    estimatedTime: '35 minutes',
    difficulty: 'Intermediate'
  },
  {
    id: 'business-analytics',
    title: 'Business Intelligence & Analytics',
    description: 'Test your BI tools, data visualization, and business analytics capabilities',
    icon: BarChart3,
    skills: ['Power BI', 'Tableau', 'Google Analytics', 'Excel', 'Data Visualization', 'KPIs'],
    estimatedTime: '30 minutes',
    difficulty: 'Intermediate'
  },
  {
    id: 'game-dev',
    title: 'Game Development',
    description: 'Evaluate your game design, development, and graphics programming skills',
    icon: Code,
    skills: ['Unity', 'Unreal Engine', 'C#', 'C++', 'Game Physics', '3D Modeling'],
    estimatedTime: '50 minutes',
    difficulty: 'Advanced'
  },
  {
    id: 'devops-cloud',
    title: 'DevOps & Cloud Computing',
    description: 'Assess your cloud infrastructure, CI/CD, and DevOps practices knowledge',
    icon: Database,
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Jenkins'],
    estimatedTime: '45 minutes',
    difficulty: 'Advanced'
  },
  {
    id: 'mobile-dev',
    title: 'Mobile Application Development',
    description: 'Test your mobile app development for iOS and Android platforms',
    icon: Code,
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'iOS Development', 'Android Development'],
    estimatedTime: '40 minutes',
    difficulty: 'Intermediate'
  }
];

const SelfAssessmentCenter = () => {
  const [completedAssessments, setCompletedAssessments] = useState<string[]>([]);
  const [startingAssessment, setStartingAssessment] = useState<string | null>(null);

  const handleStartAssessment = (categoryId: string) => {
    setStartingAssessment(categoryId);
    // Navigate to skill assessment with category
    setTimeout(() => {
      window.location.href = `/skill-assessment/${categoryId}`;
    }, 300);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completionPercentage = (completedAssessments.length / assessmentCategories.length) * 100;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Self-Assessment Center</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Evaluate your skills across different domains to boost your RankMe.AI score and discover improvement opportunities
        </p>
        
        <Card className="max-w-md mx-auto">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completed Assessments</span>
                <span className="font-medium">{completedAssessments.length}/{assessmentCategories.length}</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Complete all assessments to maximize your ranking potential
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {assessmentCategories.map((category) => {
            const IconComponent = category.icon;
            const isCompleted = completedAssessments.includes(category.id);
            const isStarting = startingAssessment === category.id;
            
            return (
              <Card 
                key={category.id} 
                className={`relative overflow-hidden card-hover ${
                  isCompleted ? 'border-green-200 bg-green-50/50' : ''
                }`}
              >
              {isCompleted && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-primary/10'}`}>
                    <IconComponent className={`h-6 w-6 ${isCompleted ? 'text-green-600' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getDifficultyColor(category.difficulty)}`}
                      >
                        {category.difficulty}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {category.estimatedTime}
                      </div>
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {category.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Skills Covered:</h4>
                  <div className="flex flex-wrap gap-1">
                    {category.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                        <Button 
                          onClick={() => handleStartAssessment(category.id)}
                          disabled={isStarting || isCompleted}
                          className="w-full shadow-elegant hover-lift"
                          variant={isCompleted ? "outline" : "default"}
                        >
                          {isStarting ? (
                            <>Loading Assessment...</>
                          ) : isCompleted ? (
                            <>Completed • Retake</>
                          ) : (
                            <>Start Assessment</>
                          )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {completedAssessments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Your Assessment Results
            </CardTitle>
            <CardDescription>
              Based on your completed assessments, here's how you're performing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{completedAssessments.length}</div>
                <div className="text-sm text-muted-foreground">Assessments Completed</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">+{completedAssessments.length * 5}</div>
                <div className="text-sm text-muted-foreground">Ranking Points Gained</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{Math.round(completionPercentage)}%</div>
                <div className="text-sm text-muted-foreground">Profile Completion</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SelfAssessmentCenter;