import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, CheckCircle, ArrowRight, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { addUserSkill } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { useRankingCalculator } from '@/hooks/useRankingCalculator';
import { skillExams as importedSkillExams, getAllCategories, type SkillExam } from '@/data/skillAssessments';

// Use imported skill exams from centralized data
const skillExams = importedSkillExams;

// Dynamic skill exams mapping based on category
const getSkillExamByCategory = (category: string): SkillExam => {
  const exam = skillExams.find(e => e.id === category || e.title.toLowerCase().includes(category.toLowerCase()));
  if (exam) return exam;
  
  // Default exam if category not found
  return {
    id: category,
    title: category.charAt(0).toUpperCase() + category.slice(1),
    description: `Test your knowledge in ${category}`,
    category: 'General',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      {
        id: 1,
        question: `What is the most important concept in ${category}?`,
        options: ['Concept A', 'Concept B', 'Concept C', 'All of the above'],
        correct: 3,
        difficulty: 'intermediate' as const
      }
    ]
  };
};

interface SkillAssessmentProps {
  onComplete?: (skillName: string, score: number) => void;
  category?: string; // Add category prop
}

const SkillAssessment = ({ onComplete, category }: SkillAssessmentProps) => {
  const [selectedExam, setSelectedExam] = useState<SkillExam | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [examStarted, setExamStarted] = useState(false);
  const { user } = useUser();

  // Auto-select exam based on category if provided
  useEffect(() => {
    if (category && !selectedExam) {
      const exam = getSkillExamByCategory(category);
      setSelectedExam({ ...exam, passingScore: 70, maxScore: 100 });
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
    setTimeLeft(300);
    setExamStarted(false); // Don't start timer immediately
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < (selectedExam?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
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
      // Save skill to user profile
      const skillLevel = score >= 90 ? 9 : score >= 80 ? 7 : score >= 70 ? 5 : 3;
      const skillData = {
        user_id: user.id,
        name: selectedExam.title.replace(' Fundamentals', '').replace(' Programming', ''),
        level: skillLevel,
        experience_years: 1,
        is_verified: true,
        verification_source: 'RankMe.AI Assessment'
      };
      
      try {
        await addUserSkill(skillData);
        
        // Trigger rank recalculation
        const { data: rankData, error: rankError } = await supabase.functions.invoke('rank-calculator', {
          body: { userId: user.id }
        });
        
        if (rankError) {
          console.error('Error recalculating rank:', rankError);
        } else {
          toast.success(`Skill "${skillData.name}" added to your profile! Rank updated.`);
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
    setTimeLeft(300);
    setExamStarted(false);
  };

  if (!selectedExam) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Skill Assessments</h2>
          <p className="text-muted-foreground">
            Take skill assessments to verify your knowledge and improve your ranking
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  {exam.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {exam.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Questions:</span>
                    <span>{exam.questions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Time Limit:</span>
                    <span>5 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Passing Score:</span>
                    <span>{exam.passingScore}%</span>
                  </div>
                </div>
                <Button 
                  onClick={() => startExam(exam)}
                  className="w-full"
                >
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show assessment start screen before beginning timer
  if (selectedExam && !examStarted && !showResults) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl mb-2">{selectedExam.title}</CardTitle>
          <CardDescription>{selectedExam.description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-semibold">Questions</p>
              <p className="text-2xl font-bold text-primary">{selectedExam.questions.length}</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-semibold">Time Limit</p>
              <p className="text-2xl font-bold text-primary">5 min</p>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-amber-800 font-medium mb-2">Assessment Instructions:</p>
            <ul className="text-amber-700 text-sm space-y-1 text-left">
              <li>• You have 5 minutes to complete all questions</li>
              <li>• Each question has only one correct answer</li>
              <li>• You need {selectedExam.passingScore}% to pass</li>
              <li>• Timer starts when you click "Begin Assessment"</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetExam} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={() => setExamStarted(true)} 
              className="flex-1"
            >
              Begin Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= selectedExam.passingScore;
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {passed ? <CheckCircle className="h-8 w-8" /> : <Trophy className="h-8 w-8" />}
          </div>
          <CardTitle className="text-2xl">
            {passed ? 'Congratulations!' : 'Assessment Complete'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <div className="text-4xl font-bold mb-2">{score}%</div>
            <p className="text-muted-foreground">
              You scored {score}% on {selectedExam.title}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Your Score:</span>
              <span className="font-medium">{score}%</span>
            </div>
            <div className="flex justify-between">
              <span>Passing Score:</span>
              <span>{selectedExam.passingScore}%</span>
            </div>
            <div className="flex justify-between">
              <span>Correct Answers:</span>
              <span>{answers.filter((answer, index) => answer === selectedExam.questions[index]?.correct).length} / {selectedExam.questions.length}</span>
            </div>
          </div>
          
          {passed ? (
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ Assessment passed! This skill has been added to your profile.
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-orange-800">
                Keep practicing! You can retake this assessment anytime.
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={resetExam} className="flex-1">
              Take Another Assessment
            </Button>
            {!passed ? (
              <Button onClick={() => startExam(selectedExam)} className="flex-1">
                Retake Assessment
              </Button>
            ) : (
              <Button onClick={() => window.location.href = '/dashboard'} className="flex-1">
                View Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const question = selectedExam.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / selectedExam.questions.length) * 100;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <CardTitle>{selectedExam.title}</CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timeLeft)}
            </Badge>
            <Badge variant="secondary">
              {currentQuestion + 1} / {selectedExam.questions.length}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <Badge 
            variant="outline" 
            className={`mb-3 ${
              question.difficulty === 'beginner' ? 'bg-green-50 text-green-700' :
              question.difficulty === 'intermediate' ? 'bg-yellow-50 text-yellow-700' :
              'bg-red-50 text-red-700'
            }`}
          >
            {question.difficulty}
          </Badge>
          <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
        </div>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={answers[currentQuestion] === index ? "default" : "outline"}
              className="w-full text-left justify-start h-auto p-4"
              onClick={() => selectAnswer(index)}
            >
              <span className="mr-3 font-mono">{String.fromCharCode(65 + index)}.</span>
              {option}
            </Button>
          ))}
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={resetExam}
          >
            Exit Assessment
          </Button>
          
          <Button
            onClick={nextQuestion}
            disabled={answers[currentQuestion] === undefined}
            className="flex items-center gap-2"
          >
            {currentQuestion === selectedExam.questions.length - 1 ? 'Finish' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillAssessment;