import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  TrendingUp, 
  Star,
  Trophy,
  Target,
  Code,
  PlayCircle,
  CheckCircle,
  Award
} from 'lucide-react';
import Layout from '@/components/Layout';
import { toast } from 'sonner';

// Mock data for the assessment
const mockAssessmentData = {
  javascript: {
    name: 'JavaScript',
    description: 'Complete assessment of JavaScript fundamentals and advanced concepts',
    duration: 30,
    totalQuestions: 25,
    completedBy: 1847,
    averageScore: 73,
    difficulty: 'Intermediate',
    topics: ['ES6+', 'Async/Await', 'DOM Manipulation', 'Functions & Closures']
  },
  react: {
    name: 'React',
    description: 'Test your React knowledge including hooks, state management, and components',
    duration: 45,
    totalQuestions: 30,
    completedBy: 1234,
    averageScore: 68,
    difficulty: 'Advanced',
    topics: ['Components & JSX', 'Hooks', 'State Management', 'Performance']
  },
  python: {
    name: 'Python',
    description: 'Comprehensive Python programming assessment',
    duration: 35,
    totalQuestions: 20,
    completedBy: 2156,
    averageScore: 75,
    difficulty: 'Beginner',
    topics: ['Data Types', 'Functions', 'Classes', 'Libraries']
  }
};

const SkillAssessmentPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);

  const assessmentData = mockAssessmentData[category as keyof typeof mockAssessmentData] || mockAssessmentData.javascript;

  useEffect(() => {
    if (isStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isStarted, timeLeft]);

  const handleStartAssessment = () => {
    setIsStarted(true);
    setTimeLeft(assessmentData.duration * 60); // Convert minutes to seconds
    toast.success('Assessment started! Good luck!');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isStarted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Button variant="ghost" onClick={() => navigate('/skills')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Skills
              </Button>
              <Badge variant="outline" className="text-sm">
                {assessmentData.difficulty} Level
              </Badge>
            </div>

            {/* Assessment Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-3xl">
                        {category === 'react' ? '⚛️' : category === 'python' ? '🐍' : '🟨'}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{assessmentData.name} Assessment</CardTitle>
                        <CardDescription className="text-lg">
                          {assessmentData.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Key Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <div className="font-semibold text-blue-900">{assessmentData.duration} mins</div>
                        <div className="text-sm text-blue-700">Duration</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                        <div className="font-semibold text-green-900">{assessmentData.totalQuestions}</div>
                        <div className="text-sm text-green-700">Questions</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <div className="font-semibold text-purple-900">{assessmentData.completedBy.toLocaleString()}</div>
                        <div className="text-sm text-purple-700">Completed</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                        <div className="font-semibold text-yellow-900">{assessmentData.averageScore}%</div>
                        <div className="text-sm text-yellow-700">Avg Score</div>
                      </div>
                    </div>

                    {/* Topics Covered */}
                    <div>
                      <h3 className="font-semibold mb-3">Topics Covered:</h3>
                      <div className="flex flex-wrap gap-2">
                        {assessmentData.topics.map((topic, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-50">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-2">Assessment Instructions:</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Answer all questions to the best of your ability</li>
                        <li>• You can navigate between questions during the assessment</li>
                        <li>• Your progress is automatically saved</li>
                        <li>• A minimum score of 70% is required for skill verification</li>
                        <li>• You can retake the assessment after 24 hours if needed</li>
                      </ul>
                    </div>

                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={handleStartAssessment}
                    >
                      <PlayCircle className="h-5 w-5 mr-2" />
                      Start Assessment
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                      Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Skill Verification</div>
                        <div className="text-sm text-muted-foreground">Get official verification for your skills</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Ranking Boost</div>
                        <div className="text-sm text-muted-foreground">Improve your candidate ranking significantly</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div>
                        <div className="font-medium">Employer Confidence</div>
                        <div className="text-sm text-muted-foreground">Stand out with verified capabilities</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Difficulty Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Assessment Difficulty</span>
                        <Badge className={
                          assessmentData.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                          assessmentData.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }>
                          {assessmentData.difficulty}
                        </Badge>
                      </div>
                      <Progress 
                        value={
                          assessmentData.difficulty === 'Beginner' ? 30 :
                          assessmentData.difficulty === 'Intermediate' ? 60 : 90
                        } 
                        className="h-2" 
                      />
                      <p className="text-sm text-muted-foreground">
                        This assessment is designed for {assessmentData.difficulty.toLowerCase()} level practitioners.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Assessment in progress view
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Assessment Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Badge variant="outline">{assessmentData.name} Assessment</Badge>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {assessmentData.totalQuestions}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <Progress value={(currentQuestion / assessmentData.totalQuestions) * 100} className="h-2" />
            </CardContent>
          </Card>

          {/* Question Content */}
          <Card>
            <CardContent className="p-8">
              <div className="text-center py-12">
                <Code className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Assessment in Progress</h2>
                <p className="text-muted-foreground mb-6">
                  This is a demo of the assessment interface. The actual assessment questions 
                  would be loaded here with interactive components.
                </p>
                <div className="space-y-4">
                  <Button onClick={() => navigate('/skills')} variant="outline">
                    Return to Skills
                  </Button>
                  <Button 
                    onClick={() => {
                      toast.success('Assessment completed! Skill verified and added to your profile.');
                      navigate('/dashboard');
                    }}
                  >
                    Complete Demo Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SkillAssessmentPage;