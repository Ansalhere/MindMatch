import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, CheckCircle, ArrowRight, Star, Target, Award } from 'lucide-react';
import { toast } from "sonner";
import { addUserSkill } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
}

interface SkillExam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  maxScore: number;
  category: string;
  icon: any;
  color: string;
}

const comprehensiveExams: SkillExam[] = [
  {
    id: 'javascript',
    title: 'JavaScript Mastery',
    description: 'Comprehensive JavaScript assessment covering ES6+, DOM manipulation, async programming, and modern frameworks',
    category: 'Frontend',
    icon: Target,
    color: 'from-yellow-500 to-orange-500',
    passingScore: 75,
    maxScore: 100,
    questions: [
      {
        id: 1,
        question: 'What is the output of: console.log(typeof null)?',
        options: ['null', 'undefined', 'object', 'boolean'],
        correct: 2,
        difficulty: 'intermediate',
        explanation: 'This is a well-known JavaScript quirk. typeof null returns "object" due to legacy reasons in the language specification.'
      },
      {
        id: 2,
        question: 'Which method is used to add elements to the end of an array?',
        options: ['push()', 'append()', 'add()', 'insert()'],
        correct: 0,
        difficulty: 'beginner',
        explanation: 'push() method adds elements to the end of an array and returns the new length of the array.'
      },
      {
        id: 3,
        question: 'What does the "..." operator do in JavaScript?',
        options: ['Concatenates strings', 'Spread operator for arrays/objects', 'Division operator', 'Comments'],
        correct: 1,
        difficulty: 'intermediate',
        explanation: 'The spread operator (...) allows arrays/objects to be expanded in places where multiple elements/properties are expected.'
      },
      {
        id: 4,
        question: 'What is a closure in JavaScript?',
        options: ['A function that closes the browser', 'A function with access to outer scope variables', 'A CSS property', 'A loop statement'],
        correct: 1,
        difficulty: 'advanced',
        explanation: 'A closure is a function that has access to variables in its outer (lexical) scope even after the outer function has finished executing.'
      },
      {
        id: 5,
        question: 'How do you create an asynchronous function?',
        options: ['function async myFunc()', 'async function myFunc()', 'function myFunc() async', 'async myFunc()'],
        correct: 1,
        difficulty: 'intermediate',
        explanation: 'The async keyword is placed before the function keyword to create an asynchronous function that returns a Promise.'
      },
      {
        id: 6,
        question: 'What is the difference between == and === in JavaScript?',
        options: ['No difference', '== checks type and value, === checks only value', '=== checks type and value, == only checks value', 'Both are deprecated'],
        correct: 2,
        difficulty: 'beginner',
        explanation: '=== (strict equality) checks both type and value, while == (loose equality) performs type coercion before comparison.'
      },
      {
        id: 7,
        question: 'What is event bubbling?',
        options: ['Events moving from parent to child', 'Events moving from child to parent', 'Events creating bubbles', 'CSS animation effect'],
        correct: 1,
        difficulty: 'intermediate',
        explanation: 'Event bubbling is when an event starts at the target element and bubbles up through its parent elements in the DOM tree.'
      },
      {
        id: 8,
        question: 'Which of these is NOT a JavaScript data type?',
        options: ['Symbol', 'BigInt', 'Float', 'Boolean'],
        correct: 2,
        difficulty: 'intermediate',
        explanation: 'JavaScript uses "number" for all numeric values. There is no separate "float" data type.'
      }
    ]
  },
  {
    id: 'react',
    title: 'React Development',
    description: 'Advanced React assessment including hooks, state management, component patterns, and performance optimization',
    category: 'Frontend',
    icon: Star,
    color: 'from-blue-500 to-cyan-500',
    passingScore: 75,
    maxScore: 100,
    questions: [
      {
        id: 1,
        question: 'What is the purpose of useEffect hook?',
        options: ['State management', 'Side effects and lifecycle', 'Component rendering', 'Event handling'],
        correct: 1,
        difficulty: 'intermediate',
        explanation: 'useEffect is used for side effects like data fetching, subscriptions, or manually changing DOM, and replaces lifecycle methods.'
      },
      {
        id: 2,
        question: 'When does React re-render a component?',
        options: ['Every second', 'When state or props change', 'On user click', 'Never automatically'],
        correct: 1,
        difficulty: 'beginner',
        explanation: 'React re-renders components when their state changes or when they receive new props from parent components.'
      },
      {
        id: 3,
        question: 'What is the virtual DOM?',
        options: ['A browser API', 'A JavaScript representation of the DOM', 'A CSS framework', 'A database'],
        correct: 1,
        difficulty: 'intermediate',
        explanation: 'Virtual DOM is a JavaScript representation of the real DOM that React uses to optimize rendering performance.'
      },
      {
        id: 4,
        question: 'How do you prevent a component from re-rendering unnecessarily?',
        options: ['React.memo()', 'useState()', 'useEffect()', 'render()'],
        correct: 0,
        difficulty: 'advanced',
        explanation: 'React.memo() is a higher-order component that memorizes the result and skips re-rendering if props haven\'t changed.'
      },
      {
        id: 5,
        question: 'What is prop drilling?',
        options: ['Making holes in components', 'Passing props through multiple component levels', 'A debugging tool', 'A testing method'],
        correct: 1,
        difficulty: 'intermediate',
        explanation: 'Prop drilling occurs when props are passed through multiple component layers to reach a deeply nested component.'
      },
      {
        id: 6,
        question: 'Which hook is used to access React context?',
        options: ['useContext()', 'useState()', 'useReducer()', 'useMemo()'],
        correct: 0,
        difficulty: 'intermediate',
        explanation: 'useContext() hook is used to consume context values in functional components.'
      },
      {
        id: 7,
        question: 'What is the key prop used for in React lists?',
        options: ['Styling', 'Unique identification for reconciliation', 'Event handling', 'State management'],
        correct: 1,
        difficulty: 'beginner',
        explanation: 'The key prop helps React identify which items have changed, added, or removed during reconciliation for efficient updates.'
      },
      {
        id: 8,
        question: 'When should you use useCallback hook?',
        options: ['Always', 'Never', 'To memoize functions to prevent unnecessary re-renders', 'For API calls only'],
        correct: 2,
        difficulty: 'advanced',
        explanation: 'useCallback is used to memoize functions, preventing child components from re-rendering when the function reference hasn\'t changed.'
      }
    ]
  },
  {
    id: 'python',
    title: 'Python Programming',
    description: 'Comprehensive Python assessment covering syntax, data structures, OOP, and advanced concepts',
    category: 'Backend',
    icon: Award,
    color: 'from-green-500 to-emerald-500',
    passingScore: 75,
    maxScore: 100,
    questions: [
      {
        id: 1,
        question: 'What is the difference between a list and a tuple in Python?',
        options: ['No difference', 'Lists are mutable, tuples are immutable', 'Tuples are faster', 'Lists are for numbers only'],
        correct: 1,
        difficulty: 'beginner',
        explanation: 'Lists are mutable (can be modified) while tuples are immutable (cannot be changed after creation).'
      },
      {
        id: 2,
        question: 'What does the __init__ method do?',
        options: ['Initializes a class instance', 'Destroys an object', 'Imports modules', 'Creates functions'],
        correct: 0,
        difficulty: 'intermediate',
        explanation: '__init__ is the constructor method that initializes a new instance of a class with initial values.'
      },
      {
        id: 3,
        question: 'What is a list comprehension?',
        options: ['A way to understand lists', 'A concise way to create lists', 'A debugging tool', 'A testing method'],
        correct: 1,
        difficulty: 'intermediate',
        explanation: 'List comprehension provides a concise way to create lists by applying an expression to each item in an iterable.'
      },
      {
        id: 4,
        question: 'What is the Global Interpreter Lock (GIL) in Python?',
        options: ['A security feature', 'A mechanism that allows only one thread to execute Python bytecode', 'A debugging tool', 'A package manager'],
        correct: 1,
        difficulty: 'advanced',
        explanation: 'GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecode simultaneously.'
      },
      {
        id: 5,
        question: 'How do you handle exceptions in Python?',
        options: ['if/else statements', 'try/except blocks', 'while loops', 'switch statements'],
        correct: 1,
        difficulty: 'beginner',
        explanation: 'Python uses try/except blocks to handle exceptions and provide graceful error handling.'
      },
      {
        id: 6,
        question: 'What is the difference between @staticmethod and @classmethod?',
        options: ['No difference', '@staticmethod doesn\'t receive class/instance, @classmethod receives class', 'Both are deprecated', 'Only syntax difference'],
        correct: 1,
        difficulty: 'advanced',
        explanation: '@staticmethod doesn\'t receive any implicit arguments, while @classmethod receives the class as the first argument (cls).'
      },
      {
        id: 7,
        question: 'What is a decorator in Python?',
        options: ['A design pattern', 'A function that modifies another function', 'A data structure', 'A loop type'],
        correct: 1,
        difficulty: 'intermediate',
        explanation: 'A decorator is a function that takes another function and extends its behavior without explicitly modifying it.'
      },
      {
        id: 8,
        question: 'What does "yield" keyword do in Python?',
        options: ['Stops execution', 'Creates a generator function', 'Imports modules', 'Defines variables'],
        correct: 1,
        difficulty: 'advanced',
        explanation: 'The yield keyword turns a function into a generator, allowing it to pause execution and resume later, producing values lazily.'
      }
    ]
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics',
    description: 'Advanced data science assessment covering statistics, machine learning, and data analysis',
    category: 'Analytics',
    icon: Trophy,
    color: 'from-purple-500 to-pink-500',
    passingScore: 75,
    maxScore: 100,
    questions: [
      {
        id: 1,
        question: 'What is the difference between supervised and unsupervised learning?',
        options: ['No difference', 'Supervised uses labeled data, unsupervised uses unlabeled data', 'Supervised is faster', 'Unsupervised is more accurate'],
        correct: 1,
        difficulty: 'beginner',
        explanation: 'Supervised learning uses labeled training data to learn patterns, while unsupervised learning finds patterns in unlabeled data.'
      },
      {
        id: 2,
        question: 'What is overfitting in machine learning?',
        options: ['Model performs well on training but poorly on new data', 'Model is too simple', 'Model trains too fast', 'Model uses too much memory'],
        correct: 0,
        difficulty: 'intermediate',
        explanation: 'Overfitting occurs when a model learns the training data too well, including noise, leading to poor generalization on new data.'
      },
      {
        id: 3,
        question: 'What is the purpose of cross-validation?',
        options: ['To train faster', 'To assess model performance and prevent overfitting', 'To reduce data size', 'To visualize data'],
        correct: 1,
        difficulty: 'intermediate',
        explanation: 'Cross-validation splits data into multiple folds to evaluate model performance more reliably and detect overfitting.'
      },
      {
        id: 4,
        question: 'What is the curse of dimensionality?',
        options: ['Too many features making analysis difficult', 'Not enough data', 'Slow computers', 'Bad visualization'],
        correct: 0,
        difficulty: 'advanced',
        explanation: 'The curse of dimensionality refers to problems that arise when analyzing data in high-dimensional spaces, including data sparsity and distance metrics becoming less meaningful.'
      },
      {
        id: 5,
        question: 'What is a p-value in statistics?',
        options: ['Probability that results occurred by chance', 'Performance metric', 'Prediction accuracy', 'Processing time'],
        correct: 0,
        difficulty: 'intermediate',
        explanation: 'A p-value is the probability of obtaining results at least as extreme as observed, assuming the null hypothesis is true.'
      },
      {
        id: 6,
        question: 'What is the difference between precision and recall?',
        options: ['No difference', 'Precision: true positives/predicted positives, Recall: true positives/actual positives', 'Recall is always higher', 'Precision measures speed'],
        correct: 1,
        difficulty: 'intermediate',
        explanation: 'Precision measures how many predicted positives are actually positive, while recall measures how many actual positives were correctly identified.'
      },
      {
        id: 7,
        question: 'What is regularization in machine learning?',
        options: ['Making data regular', 'Technique to prevent overfitting by adding penalty terms', 'Data cleaning process', 'Feature selection method'],
        correct: 1,
        difficulty: 'advanced',
        explanation: 'Regularization adds penalty terms to the loss function to discourage complex models and prevent overfitting.'
      },
      {
        id: 8,
        question: 'What is the purpose of feature scaling?',
        options: ['To reduce features', 'To normalize feature ranges for better algorithm performance', 'To increase accuracy', 'To speed up training'],
        correct: 1,
        difficulty: 'intermediate',
        explanation: 'Feature scaling normalizes the range of features so that no single feature dominates others due to scale differences.'
      }
    ]
  }
];

interface EnhancedSkillAssessmentProps {
  onComplete?: (skillName: string, score: number) => void;
  category?: string;
}

const EnhancedSkillAssessment = ({ onComplete, category }: EnhancedSkillAssessmentProps) => {
  const [selectedExam, setSelectedExam] = useState<SkillExam | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [examStarted, setExamStarted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (category && !selectedExam) {
      const exam = comprehensiveExams.find(e => e.id.toLowerCase() === category.toLowerCase());
      if (exam) {
        setSelectedExam(exam);
      }
    }
  }, [category, selectedExam]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examStarted && timeLeft > 0 && !showResults) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResults) {
      finishExam();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, examStarted, showResults]);

  const startExam = (exam: SkillExam) => {
    setSelectedExam(exam);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setTimeLeft(1200);
    setExamStarted(false);
    setShowExplanation(false);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (selectedExam?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishExam();
    }
  };

  const finishExam = async () => {
    if (!selectedExam) return;
    
    setExamStarted(false);
    setShowResults(true);
    
    const score = calculateScore();
    const passed = score >= selectedExam.passingScore;
    
    if (user && passed) {
      const skillLevel = score >= 90 ? 9 : score >= 80 ? 7 : score >= 70 ? 5 : 3;
      const skillData = {
        user_id: user.id,
        name: selectedExam.title,
        level: skillLevel,
        experience_years: Math.floor(score / 20),
        is_verified: true,
        verification_source: 'RankMe.AI Advanced Assessment'
      };
      
      try {
        await addUserSkill(skillData);
        
        const { error: rankError } = await supabase.functions.invoke('rank-calculator', {
          body: { userId: user.id }
        });
        
        if (rankError) {
          console.error('Error recalculating rank:', rankError);
        } else {
          toast.success(`Excellent! "${skillData.name}" added to your profile with ${score}% score!`);
        }
        
        onComplete?.(skillData.name, score);
      } catch (error) {
        console.error('Error saving skill:', error);
        toast.error('Failed to save skill to profile');
      }
    }
  };

  const calculateScore = () => {
    if (!selectedExam) return 0;
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === selectedExam.questions[index]?.correct) {
        correct++;
      }
    });
    return Math.round((correct / selectedExam.questions.length) * 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetExam = () => {
    setSelectedExam(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setTimeLeft(1200);
    setExamStarted(false);
    setShowExplanation(false);
  };

  if (!selectedExam) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3 gradient-text">Professional Skill Assessments</h2>
          <p className="text-muted-foreground text-lg">
            Take comprehensive assessments to verify your expertise and boost your ranking
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comprehensiveExams.map((exam) => {
            const IconComponent = exam.icon;
            return (
              <Card key={exam.id} className="card-hover group relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${exam.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${exam.color} text-white`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    {exam.title}
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {exam.category}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {exam.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Questions:</span>
                      <span>{exam.questions.length} comprehensive</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Time Limit:</span>
                      <span>20 minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Passing Score:</span>
                      <span className="font-semibold text-primary">{exam.passingScore}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Difficulty:</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => startExam(exam)}
                    className="w-full"
                    size="lg"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Show assessment start screen
  if (selectedExam && !examStarted && !showResults) {
    const IconComponent = selectedExam.icon;
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${selectedExam.color} flex items-center justify-center text-white`}>
            <IconComponent className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">{selectedExam.title} Assessment</CardTitle>
          <CardDescription className="text-lg">{selectedExam.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 p-6 bg-secondary/50 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{selectedExam.questions.length}</div>
              <div className="text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">20</div>
              <div className="text-sm text-muted-foreground">Minutes</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="font-semibold">Assessment Guidelines:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Each question has detailed explanations</li>
              <li>• Questions cover beginner to advanced concepts</li>
              <li>• You need {selectedExam.passingScore}% to pass and add this skill to your profile</li>
              <li>• Take your time and read questions carefully</li>
              <li>• Once started, the timer cannot be paused</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={resetExam}
              className="flex-1"
            >
              Back to Assessments
            </Button>
            <Button 
              onClick={() => setExamStarted(true)}
              className="flex-1"
              size="lg"
            >
              <Clock className="h-4 w-4 mr-2" />
              Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show results
  if (showResults && selectedExam) {
    const score = calculateScore();
    const passed = score >= selectedExam.passingScore;
    const IconComponent = selectedExam.icon;
    
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${passed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-orange-500 to-red-500'} flex items-center justify-center text-white`}>
            {passed ? <Trophy className="h-8 w-8" /> : <Target className="h-8 w-8" />}
          </div>
          <CardTitle className="text-2xl">
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </CardTitle>
          <CardDescription className="text-lg">
            You scored {score}% on the {selectedExam.title} assessment
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <Progress value={score} className="w-full h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {passed ? `Passing score: ${selectedExam.passingScore}%` : `You need ${selectedExam.passingScore}% to pass`}
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 p-6 bg-secondary/50 rounded-xl">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                {answers.filter((answer, index) => answer === selectedExam.questions[index]?.correct).length}
              </div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">
                {selectedExam.questions.length - answers.filter((answer, index) => answer === selectedExam.questions[index]?.correct).length}
              </div>
              <div className="text-sm text-muted-foreground">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {formatTime(1200 - timeLeft)}
              </div>
              <div className="text-sm text-muted-foreground">Time Used</div>
            </div>
          </div>
          
          {passed && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                🎉 Skill added to your profile! Your ranking has been updated.
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={resetExam}
              className="flex-1"
            >
              Back to Assessments
            </Button>
            <Button 
              onClick={() => startExam(selectedExam)}
              className="flex-1"
            >
              Retake Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show current question during exam
  if (selectedExam && examStarted) {
    const question = selectedExam.questions[currentQuestion];
    const IconComponent = selectedExam.icon;
    
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedExam.color} text-white`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>{selectedExam.title}</CardTitle>
                <CardDescription>
                  Question {currentQuestion + 1} of {selectedExam.questions.length}
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{formatTime(timeLeft)}</div>
              <div className="text-sm text-muted-foreground">Time Remaining</div>
            </div>
          </div>
          
          <Progress 
            value={((currentQuestion + 1) / selectedExam.questions.length) * 100} 
            className="w-full h-2"
          />
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant={question.difficulty === 'beginner' ? 'secondary' : question.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                {question.difficulty}
              </Badge>
            </div>
            
            <h3 className="text-xl font-semibold leading-relaxed">
              {question.question}
            </h3>
          </div>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  answers[currentQuestion] === index
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                    answers[currentQuestion] === index
                      ? 'border-primary bg-primary text-white'
                      : 'border-muted-foreground'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>
          
          {showExplanation && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
              <p className="text-blue-800">{question.explanation}</p>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowExplanation(!showExplanation)}
              disabled={answers[currentQuestion] === undefined}
            >
              {showExplanation ? 'Hide' : 'Show'} Explanation
            </Button>
            
            <Button
              onClick={nextQuestion}
              disabled={answers[currentQuestion] === undefined}
              size="lg"
            >
              {currentQuestion === selectedExam.questions.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finish Assessment
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default EnhancedSkillAssessment;