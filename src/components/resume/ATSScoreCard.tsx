import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronUp, Target, TrendingUp, Shield } from 'lucide-react';
import { ResumeData } from '@/pages/ResumeBuilder';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ATSScoreCardProps {
  data: ResumeData;
}

interface ATSCheck {
  id: string;
  label: string;
  passed: boolean;
  tip: string;
  weight: number;
}

const ATSScoreCard = ({ data }: ATSScoreCardProps) => {
  const [score, setScore] = useState(0);
  const [checks, setChecks] = useState<ATSCheck[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const newChecks: ATSCheck[] = [
      {
        id: 'name',
        label: 'Full name included',
        passed: data.personalInfo.fullName.trim().length > 2,
        tip: 'Add your full name at the top',
        weight: 10,
      },
      {
        id: 'email',
        label: 'Valid email address',
        passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalInfo.email),
        tip: 'Use a professional email',
        weight: 10,
      },
      {
        id: 'phone',
        label: 'Phone number included',
        passed: data.personalInfo.phone.trim().length >= 10,
        tip: 'Add phone with area code',
        weight: 10,
      },
      {
        id: 'location',
        label: 'Location specified',
        passed: data.personalInfo.location.trim().length > 2,
        tip: 'Add city & state/country',
        weight: 5,
      },
      {
        id: 'summary',
        label: 'Professional summary (50+ words)',
        passed: data.personalInfo.summary.split(' ').length >= 50,
        tip: 'Write a 50-150 word summary',
        weight: 15,
      },
      {
        id: 'experience',
        label: 'Work experience added',
        passed: data.experience.length > 0,
        tip: 'Add your work history',
        weight: 15,
      },
      {
        id: 'exp-bullets',
        label: 'Action verbs in descriptions',
        passed: data.experience.some(exp => 
          /^(led|managed|developed|created|implemented|designed|achieved|increased|reduced|improved)/i.test(exp.description)
        ),
        tip: 'Start with: Led, Managed, etc.',
        weight: 10,
      },
      {
        id: 'education',
        label: 'Education section complete',
        passed: data.education.length > 0 && data.education.some(e => e.degree && e.institution),
        tip: 'Add your education',
        weight: 10,
      },
      {
        id: 'skills',
        label: 'Skills section (5+ skills)',
        passed: data.skills.reduce((acc, s) => acc + s.items.length, 0) >= 5,
        tip: 'List 5-10 relevant skills',
        weight: 15,
      },
    ];

    setChecks(newChecks);

    const totalWeight = newChecks.reduce((acc, c) => acc + c.weight, 0);
    const earnedWeight = newChecks.filter(c => c.passed).reduce((acc, c) => acc + c.weight, 0);
    setScore(Math.round((earnedWeight / totalWeight) * 100));
  }, [data]);

  const passedChecks = checks.filter(c => c.passed);
  const failedChecks = checks.filter(c => !c.passed);

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreGradient = () => {
    if (score >= 80) return 'from-green-500/20 to-green-500/5';
    if (score >= 60) return 'from-amber-500/20 to-amber-500/5';
    return 'from-red-500/20 to-red-500/5';
  };

  const getScoreLabel = () => {
    if (score >= 80) return { label: 'Excellent', icon: Shield, desc: 'Your resume is ATS-ready!' };
    if (score >= 60) return { label: 'Good', icon: TrendingUp, desc: 'A few improvements needed' };
    return { label: 'Needs Work', icon: Target, desc: 'Complete the items below' };
  };

  const scoreInfo = getScoreLabel();
  const ScoreIcon = scoreInfo.icon;

  return (
    <Card className={`p-4 sm:p-5 bg-gradient-to-br ${getScoreGradient()} border-0 shadow-lg`}>
      {/* Score Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-background shadow-inner`}>
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-muted/20"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeDasharray={`${score * 2.83} 283`}
              strokeLinecap="round"
              className={getScoreColor()}
            />
          </svg>
          <span className={`text-xl sm:text-2xl font-bold ${getScoreColor()}`}>{score}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <ScoreIcon className={`h-4 w-4 ${getScoreColor()}`} />
            <span className={`font-semibold ${getScoreColor()}`}>{scoreInfo.label}</span>
          </div>
          <p className="text-sm text-muted-foreground">{scoreInfo.desc}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              {passedChecks.length} passed
            </span>
            <span className="text-muted-foreground/50">•</span>
            <span className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-red-400" />
              {failedChecks.length} to fix
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions - Show top 2 failing items */}
      {failedChecks.length > 0 && (
        <div className="space-y-2 mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Fix to improve score:</p>
          {failedChecks.slice(0, 2).map((check) => (
            <div key={check.id} className="flex items-center gap-2 p-2 rounded-lg bg-background/60 border border-destructive/20">
              <XCircle className="h-4 w-4 text-destructive shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium truncate block">{check.label}</span>
                <span className="text-xs text-muted-foreground">{check.tip}</span>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">+{check.weight}%</Badge>
            </div>
          ))}
        </div>
      )}

      {/* Expandable Details */}
      <Collapsible open={showDetails} onOpenChange={setShowDetails}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground hover:text-foreground">
            <span className="flex items-center gap-2 text-xs">
              <Lightbulb className="h-3.5 w-3.5" />
              {showDetails ? 'Hide all checks' : 'View all checks'}
            </span>
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-1">
          <div className="grid gap-1.5">
            {checks.map((check) => (
              <div 
                key={check.id} 
                className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                  check.passed ? 'bg-green-500/10' : 'bg-background/50'
                }`}
              >
                {check.passed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                )}
                <span className={check.passed ? 'text-foreground' : 'text-muted-foreground'}>
                  {check.label}
                </span>
                <Badge variant="outline" className="ml-auto text-xs">
                  {check.weight}%
                </Badge>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ATSScoreCard;
