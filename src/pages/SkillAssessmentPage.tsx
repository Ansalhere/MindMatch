import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Award } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface AssessmentData {
  title: string;
  description: string;
  timeLimit: number; // minutes
  questions: Question[];
}

const skillAssessments: Record<string, AssessmentData> = {
  'frontend': {
    title: 'Frontend Development Assessment',
    description: 'Test your HTML, CSS, JavaScript, React, and UI/UX knowledge',
    timeLimit: 45,
    questions: [
      {
        id: '1',
        question: 'Which CSS property is used to control the spacing between elements?',
        options: ['margin', 'padding', 'border', 'spacing'],
        correctAnswer: 0,
        explanation: 'Margin controls the space between elements, while padding controls space within an element.',
        difficulty: 'easy'
      },
      {
        id: '2',
        question: 'What is the virtual DOM in React?',
        options: [
          'A copy of the real DOM kept in memory',
          'A new DOM API',
          'A browser feature',
          'A JavaScript library'
        ],
        correctAnswer: 0,
        explanation: 'The virtual DOM is a programming concept where a virtual representation of the real DOM is kept in memory.',
        difficulty: 'medium'
      },
      {
        id: '3',
        question: 'Which hook is used for side effects in React functional components?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correctAnswer: 1,
        explanation: 'useEffect is used to perform side effects in functional components, similar to componentDidMount.',
        difficulty: 'medium'
      },
      {
        id: '4',
        question: 'What does CSS Grid offer that Flexbox doesn\'t?',
        options: [
          'Better browser support',
          'Two-dimensional layout control',
          'Faster rendering',
          'Easier syntax'
        ],
        correctAnswer: 1,
        explanation: 'CSS Grid provides two-dimensional layout control (rows and columns), while Flexbox is one-dimensional.',
        difficulty: 'hard'
      },
      {
        id: '5',
        question: 'Which JavaScript method is used to add an element to the end of an array?',
        options: ['append()', 'push()', 'add()', 'insert()'],
        correctAnswer: 1,
        explanation: 'The push() method adds one or more elements to the end of an array.',
        difficulty: 'easy'
      }
    ]
  },
  'backend': {
    title: 'Backend Development Assessment',
    description: 'Test your server-side programming and API development skills',
    timeLimit: 60,
    questions: [
      {
        id: '1',
        question: 'What is the purpose of middleware in Express.js?',
        options: [
          'To handle database connections',
          'To process requests between the server and routes',
          'To compile JavaScript',
          'To manage file uploads'
        ],
        correctAnswer: 1,
        explanation: 'Middleware functions execute during the request-response cycle and can modify requests/responses.',
        difficulty: 'medium'
      },
      {
        id: '2',
        question: 'Which HTTP status code indicates a successful resource creation?',
        options: ['200', '201', '204', '302'],
        correctAnswer: 1,
        explanation: '201 Created indicates that a new resource has been successfully created.',
        difficulty: 'easy'
      },
      {
        id: '3',
        question: 'What is the main difference between SQL and NoSQL databases?',
        options: [
          'SQL is faster',
          'NoSQL is newer',
          'SQL uses structured schemas, NoSQL is schema-flexible',
          'NoSQL only works with JSON'
        ],
        correctAnswer: 2,
        explanation: 'SQL databases use structured schemas while NoSQL databases offer flexible, schema-less data models.',
        difficulty: 'medium'
      }
    ]
  },
  'data-science': {
    title: 'Data Science & Analytics Assessment',
    description: 'Test your data analysis, machine learning, and statistics knowledge',
    timeLimit: 75,
    questions: [
      {
        id: '1',
        question: 'What is the difference between supervised and unsupervised learning?',
        options: [
          'Supervised learning uses labeled data, unsupervised doesn\'t',
          'Supervised learning is faster',
          'Unsupervised learning is more accurate',
          'There is no difference'
        ],
        correctAnswer: 0,
        explanation: 'Supervised learning uses labeled training data, while unsupervised learning finds patterns in unlabeled data.',
        difficulty: 'medium'
      }
    ]
  }
};

const SkillAssessmentPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const assessment = categoryId ? skillAssessments[categoryId] : null;

  useEffect(() => {
    if (assessment && isStarted) {
      setTimeRemaining(assessment.timeLimit * 60);
    }
  }, [assessment, isStarted]);

  useEffect(() => {
    if (timeRemaining > 0 && isStarted && !isCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && isStarted) {
      handleSubmitAssessment();
    }
  }, [timeRemaining, isStarted, isCompleted]);

  const handleStartAssessment = () => {
    setIsStarted(true);
    setSelectedAnswers(new Array(assessment!.questions.length).fill(-1));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < assessment!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!assessment || !user) return;

    let correctAnswers = 0;
    assessment.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / assessment.questions.length) * 100);
    setScore(finalScore);
    setIsCompleted(true);

    try {
      const skillLevel = Math.min(Math.round(finalScore / 10), 10);
      const { error } = await supabase
        .from('skills')
        .upsert({
          user_id: user.id,
          name: assessment.title.replace(' Assessment', ''),
          level: skillLevel,
          experience_years: Math.max(1, Math.round(skillLevel / 2)),
          is_verified: true,
          verification_source: 'FresherPools Assessment'
        });

      if (error) throw error;
      
      // Trigger rank recalculation
      const { error: rankError } = await supabase.functions.invoke('rank-calculator', {
        body: { userId: user.id }
      });
      
      if (rankError) {
        console.error('Error recalculating rank:', rankError);
      }
      
      toast.success(`Assessment completed! ${assessment.title.replace(' Assessment', '')} skill added to your profile.`);
    } catch (error) {
      console.error('Error saving assessment result:', error);
      toast.error('Failed to save assessment result');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!assessment) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Assessment Not Found</h1>
              <p className="text-muted-foreground mb-4">The requested skill assessment could not be found.</p>
              <Button onClick={() => navigate('/skills')}>Back to Skills</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isStarted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6 text-primary" />
                {assessment.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{assessment.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{assessment.timeLimit} minutes</div>
                  <div className="text-sm text-muted-foreground">Time limit</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">{assessment.questions.length} questions</div>
                  <div className="text-sm text-muted-foreground">Total questions</div>
                </div>
              </div>

              <Button onClick={handleStartAssessment} className="w-full" size="lg">
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (isCompleted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Assessment Completed!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
                <p className="text-muted-foreground">Your Score</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-medium">Skill Added to Profile!</p>
                <p className="text-green-700 text-sm">Your {assessment.title.replace(' Assessment', '')} skill has been verified and added to your profile with a level of {Math.min(Math.round(score / 10), 10)}/10.</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => navigate('/skills')} className="flex-1">
                  Take Another Assessment
                </Button>
                <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">{assessment.title}</h1>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timeRemaining)}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Question {currentQuestion + 1} of {assessment.questions.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {currentQuestion === assessment.questions.length - 1 ? (
                <Button onClick={handleSubmitAssessment}>
                  Submit Assessment
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  Next
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SkillAssessmentPage;