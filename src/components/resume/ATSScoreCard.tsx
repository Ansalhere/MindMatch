import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [tipsOpen, setTipsOpen] = useState(false);

  useEffect(() => {
    const newChecks: ATSCheck[] = [
      {
        id: 'name',
        label: 'Full name included',
        passed: data.personalInfo.fullName.trim().length > 2,
        tip: 'Include your full professional name at the top',
        weight: 10,
      },
      {
        id: 'email',
        label: 'Valid email address',
        passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.personalInfo.email),
        tip: 'Use a professional email address',
        weight: 10,
      },
      {
        id: 'phone',
        label: 'Phone number included',
        passed: data.personalInfo.phone.trim().length >= 10,
        tip: 'Include a valid phone number with area code',
        weight: 10,
      },
      {
        id: 'location',
        label: 'Location specified',
        passed: data.personalInfo.location.trim().length > 2,
        tip: 'Add city and state/country for ATS matching',
        weight: 5,
      },
      {
        id: 'summary',
        label: 'Professional summary (50+ words)',
        passed: data.personalInfo.summary.split(' ').length >= 50,
        tip: 'Write a compelling 50-150 word summary with relevant keywords',
        weight: 15,
      },
      {
        id: 'experience',
        label: 'At least one work experience',
        passed: data.experience.length > 0,
        tip: 'Add your relevant work experience with detailed descriptions',
        weight: 15,
      },
      {
        id: 'exp-bullets',
        label: 'Experience descriptions use action verbs',
        passed: data.experience.some(exp => 
          /^(led|managed|developed|created|implemented|designed|achieved|increased|reduced|improved)/i.test(exp.description)
        ),
        tip: 'Start bullet points with action verbs: Led, Managed, Developed, etc.',
        weight: 10,
      },
      {
        id: 'education',
        label: 'Education section complete',
        passed: data.education.length > 0 && data.education.some(e => e.degree && e.institution),
        tip: 'Include your highest relevant education',
        weight: 10,
      },
      {
        id: 'skills',
        label: 'Skills section with 5+ skills',
        passed: data.skills.reduce((acc, s) => acc + s.items.length, 0) >= 5,
        tip: 'List at least 5-10 relevant skills matching job requirements',
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
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadge = () => {
    if (score >= 80) return { label: 'ATS Ready', variant: 'default' as const };
    if (score >= 60) return { label: 'Needs Improvement', variant: 'secondary' as const };
    return { label: 'Low Score', variant: 'destructive' as const };
  };

  const atsTips = [
    'Use standard section headings: Experience, Education, Skills',
    'Avoid tables, graphics, and complex formatting',
    'Use standard fonts like Arial, Calibri, or Times New Roman',
    'Include keywords from the job description',
    'Use reverse chronological order for experience',
    'Save as PDF or .docx format',
    'Avoid headers and footers - ATS may skip them',
    'Use standard bullet points (•) not special characters',
    'Spell out acronyms at least once',
    'Keep formatting consistent throughout',
  ];

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg">ATS Score</h3>
          <p className="text-sm text-muted-foreground">Applicant Tracking System compatibility</p>
        </div>
        <div className="text-right">
          <span className={`text-3xl font-bold ${getScoreColor()}`}>{score}%</span>
          <Badge className="ml-2" variant={getScoreBadge().variant}>
            {getScoreBadge().label}
          </Badge>
        </div>
      </div>

      <Progress value={score} className="h-2 mb-4" />

      <div className="space-y-2 mb-4">
        {failedChecks.slice(0, 3).map((check) => (
          <div key={check.id} className="flex items-start gap-2 text-sm">
            <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
            <div>
              <span className="text-muted-foreground">{check.label}</span>
              <p className="text-xs text-muted-foreground/70">{check.tip}</p>
            </div>
          </div>
        ))}
        {passedChecks.slice(0, 2).map((check) => (
          <div key={check.id} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
            <span className="text-muted-foreground">{check.label}</span>
          </div>
        ))}
      </div>

      <Collapsible open={tipsOpen} onOpenChange={setTipsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              ATS Optimization Tips
            </span>
            {tipsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="bg-background/50 rounded-lg p-3 space-y-2">
            {atsTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <AlertTriangle className="h-3 w-3 text-yellow-500 shrink-0 mt-1" />
                <span className="text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ATSScoreCard;
