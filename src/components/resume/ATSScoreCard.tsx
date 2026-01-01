import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronUp, Target, TrendingUp, Shield, FileText, Sparkles } from 'lucide-react';
import { ResumeData } from '@/pages/ResumeBuilder';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

interface KeywordMatch {
  keyword: string;
  found: boolean;
}

const ATSScoreCard = ({ data }: ATSScoreCardProps) => {
  const [score, setScore] = useState(0);
  const [checks, setChecks] = useState<ATSCheck[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [keywordMatches, setKeywordMatches] = useState<KeywordMatch[]>([]);
  const [jdScore, setJdScore] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  // Extract keywords from job description
  const extractKeywords = (text: string): string[] => {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
      'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
      'shall', 'can', 'need', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she',
      'it', 'we', 'they', 'what', 'which', 'who', 'whom', 'how', 'when', 'where', 'why',
      'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
      'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just',
      'about', 'above', 'after', 'again', 'against', 'any', 'because', 'before', 'below',
      'between', 'during', 'into', 'through', 'under', 'until', 'up', 'down', 'out', 'off',
      'over', 'then', 'once', 'here', 'there', 'also', 'ability', 'experience', 'work',
      'working', 'job', 'position', 'role', 'candidate', 'looking', 'seeking', 'etc',
      'years', 'year', 'required', 'requirements', 'strong', 'good', 'excellent', 'our',
      'your', 'their', 'company', 'team', 'skills', 'skill', 'knowledge', 'understanding'
    ]);

    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));

    // Get frequency of words
    const wordFreq: Record<string, number> = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Sort by frequency and get top keywords
    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => word);

    // Also extract common tech skills and tools
    const techPatterns = [
      /\b(react|angular|vue|javascript|typescript|python|java|node\.?js|express|mongodb|sql|aws|azure|docker|kubernetes|git|agile|scrum|html|css|tailwind|bootstrap|figma|photoshop|excel|tableau|power ?bi|machine learning|ai|data analysis|api|rest|graphql|ci\/cd|devops|linux|windows)\b/gi
    ];

    const techSkills: string[] = [];
    techPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          const normalized = match.toLowerCase().replace(/\s+/g, '');
          if (!techSkills.includes(normalized)) {
            techSkills.push(normalized);
          }
        });
      }
    });

    // Combine and dedupe
    const allKeywords = [...new Set([...techSkills, ...sortedWords])];
    return allKeywords.slice(0, 20);
  };

  // Check if keyword exists in resume
  const checkKeywordInResume = (keyword: string): boolean => {
    const resumeText = [
      data.personalInfo.fullName,
      data.personalInfo.summary,
      ...data.experience.map(e => `${e.title} ${e.company} ${e.description}`),
      ...data.education.map(e => `${e.degree} ${e.institution} ${e.location}`),
      ...data.skills.flatMap(s => s.items),
      ...data.certifications.map(c => c.name),
      ...data.projects.map(p => `${p.name} ${p.description} ${p.technologies}`)
    ].join(' ').toLowerCase();

    return resumeText.includes(keyword.toLowerCase());
  };

  // Analyze job description
  const analyzeJobDescription = () => {
    if (!jobDescription.trim()) {
      setKeywordMatches([]);
      setJdScore(null);
      return;
    }

    const keywords = extractKeywords(jobDescription);
    const matches = keywords.map(keyword => ({
      keyword,
      found: checkKeywordInResume(keyword)
    }));

    setKeywordMatches(matches);
    
    const foundCount = matches.filter(m => m.found).length;
    const matchScore = matches.length > 0 ? Math.round((foundCount / matches.length) * 100) : 0;
    setJdScore(matchScore);
  };

  useEffect(() => {
    if (jobDescription) {
      analyzeJobDescription();
    }
  }, [data, jobDescription]);

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

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreGradient = (s: number) => {
    if (s >= 80) return 'from-green-500/20 to-green-500/5';
    if (s >= 60) return 'from-amber-500/20 to-amber-500/5';
    return 'from-red-500/20 to-red-500/5';
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return { label: 'Excellent', icon: Shield, desc: 'Your resume is ATS-ready!' };
    if (s >= 60) return { label: 'Good', icon: TrendingUp, desc: 'A few improvements needed' };
    return { label: 'Needs Work', icon: Target, desc: 'Complete the items below' };
  };

  const displayScore = activeTab === 'job-match' && jdScore !== null ? jdScore : score;
  const scoreInfo = getScoreLabel(displayScore);
  const ScoreIcon = scoreInfo.icon;

  const foundKeywords = keywordMatches.filter(k => k.found);
  const missingKeywords = keywordMatches.filter(k => !k.found);

  return (
    <Card className={`p-4 sm:p-5 bg-gradient-to-br ${getScoreGradient(displayScore)} border-0 shadow-lg`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="general" className="text-xs sm:text-sm">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            General ATS
          </TabsTrigger>
          <TabsTrigger value="job-match" className="text-xs sm:text-sm">
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Job Match
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          {/* Score Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-background shadow-inner">
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
                  className={getScoreColor(score)}
                />
              </svg>
              <span className={`text-xl sm:text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <ScoreIcon className={`h-4 w-4 ${getScoreColor(score)}`} />
                <span className={`font-semibold ${getScoreColor(score)}`}>{getScoreLabel(score).label}</span>
              </div>
              <p className="text-sm text-muted-foreground">{getScoreLabel(score).desc}</p>
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
        </TabsContent>

        <TabsContent value="job-match" className="mt-0 space-y-4">
          {/* Job Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Paste Job Description
            </label>
            <Textarea
              placeholder="Paste the job description here to check how well your resume matches..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[100px] text-sm resize-none"
            />
            <Button 
              onClick={analyzeJobDescription} 
              size="sm" 
              className="w-full"
              disabled={!jobDescription.trim()}
            >
              <Target className="h-4 w-4 mr-2" />
              Analyze Match
            </Button>
          </div>

          {/* JD Match Score */}
          {jdScore !== null && (
            <>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-background/60">
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-background shadow-inner">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      className="text-muted/20"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="5"
                      strokeDasharray={`${jdScore * 2.83} 283`}
                      strokeLinecap="round"
                      className={getScoreColor(jdScore)}
                    />
                  </svg>
                  <span className={`text-lg font-bold ${getScoreColor(jdScore)}`}>{jdScore}%</span>
                </div>
                
                <div className="flex-1">
                  <p className={`font-semibold ${getScoreColor(jdScore)}`}>
                    {jdScore >= 80 ? 'Great Match!' : jdScore >= 60 ? 'Good Match' : 'Needs Improvement'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {foundKeywords.length} of {keywordMatches.length} keywords found
                  </p>
                </div>
              </div>

              {/* Missing Keywords */}
              {missingKeywords.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-destructive" />
                    Missing Keywords ({missingKeywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {missingKeywords.map((k, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/30">
                        {k.keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 Add these keywords to your resume to improve match score
                  </p>
                </div>
              )}

              {/* Found Keywords */}
              {foundKeywords.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Matched Keywords ({foundKeywords.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {foundKeywords.map((k, i) => (
                      <Badge key={i} variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/30">
                        {k.keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!jdScore && !jobDescription && (
            <div className="text-center py-6 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Paste a job description above to see how well your resume matches</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ATSScoreCard;