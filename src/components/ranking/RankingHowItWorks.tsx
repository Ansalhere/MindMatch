import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Star, 
  Target,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RankingHowItWorksProps {
  currentScore?: number;
}

const RankingHowItWorks = ({ currentScore = 0 }: RankingHowItWorksProps) => {
  const navigate = useNavigate();

  const rankingFactors = [
    {
      icon: TrendingUp,
      title: 'Skills & Proficiency',
      weight: '40%',
      description: 'Add skills and rate your proficiency level',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      action: { label: 'Add Skills', path: '/add-skill' },
      tips: ['Add at least 5-10 relevant skills', 'Rate honestly for better job matches', 'Verify skills with assessments']
    },
    {
      icon: Briefcase,
      title: 'Work Experience',
      weight: '25%',
      description: 'Add your professional experience',
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
      action: { label: 'Add Experience', path: '/edit-profile' },
      tips: ['Include internships & projects', 'Add detailed descriptions', 'Quantify achievements']
    },
    {
      icon: GraduationCap,
      title: 'Education',
      weight: '20%',
      description: 'Your educational background matters',
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
      action: { label: 'Add Education', path: '/edit-profile' },
      tips: ['Add all degrees & courses', 'Include relevant coursework', 'Add GPA if strong']
    },
    {
      icon: Award,
      title: 'Certifications',
      weight: '15%',
      description: 'Industry certifications boost your rank',
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
      action: { label: 'Add Certifications', path: '/edit-profile' },
      tips: ['Add industry certifications', 'Include online course certificates', 'Keep credentials updated']
    },
  ];

  const quickBoosts = [
    { label: 'Complete Profile', points: '+10', done: false },
    { label: 'Add 5+ Skills', points: '+15', done: false },
    { label: 'Verify 1 Skill', points: '+8', done: false },
    { label: 'Add Experience', points: '+12', done: false },
    { label: 'Upload Resume', points: '+5', done: false },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl shadow-primary/25">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
                <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Rank #{Math.floor((100 - currentScore) * 50) + 1}
                </Badge>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Your Ranking Score: {currentScore.toFixed(1)}</h2>
              <p className="text-muted-foreground mb-4">
                Your ranking is calculated based on skills, experience, education, and certifications. Improve your score to get noticed by top employers!
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Button onClick={() => navigate('/add-skill')} className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Improve Rank
                </Button>
                <Button variant="outline" onClick={() => navigate('/ranking-explanation')} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranking Factors */}
      <div className="grid md:grid-cols-2 gap-4">
        {rankingFactors.map((factor, index) => {
          const Icon = factor.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${factor.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{factor.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {factor.weight} weight
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{factor.description}</p>
                <ul className="space-y-1 mb-4">
                  {factor.tips.map((tip, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {tip}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2"
                  onClick={() => navigate(factor.action.path)}
                >
                  {factor.action.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Boost Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Zap className="h-5 w-5 text-amber-500" />
            Quick Boosts
          </CardTitle>
          <CardDescription>Complete these actions to quickly improve your ranking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {quickBoosts.map((boost, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg border text-center hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all"
                onClick={() => navigate('/edit-profile')}
              >
                <div className="text-lg font-bold text-primary">{boost.points}</div>
                <div className="text-xs text-muted-foreground">{boost.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingHowItWorks;