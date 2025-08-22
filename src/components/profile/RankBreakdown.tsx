import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Award, 
  Code, 
  GraduationCap,
  Building,
  MapPin,
  Calendar,
  Star,
  BookOpen,
  Zap
} from 'lucide-react';

interface RankBreakdownProps {
  user: any;
  detailed?: boolean;
}

const RankBreakdown = ({ user, detailed = false }: RankBreakdownProps) => {
  // Mock breakdown data based on user's rank score
  const rankScore = user.rank_score || 0;
  
  // Calculate component scores (simplified version)
  const skillsScore = Math.min(rankScore * 1.2, 100);
  const experienceScore = Math.min(rankScore * 0.9, 100);
  const educationScore = Math.min(rankScore * 1.1, 100);
  const projectsScore = Math.min(rankScore * 0.8, 100);
  const certificationsScore = Math.min(rankScore * 0.7, 100);
  const codingScore = Math.min(rankScore * 0.6, 100);

  const components = [
    {
      name: 'Technical Skills',
      score: skillsScore,
      icon: Code,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Your programming languages, frameworks, and technical expertise',
      recommendations: skillsScore < 70 ? ['Add more in-demand skills', 'Get certifications', 'Complete coding assessments'] : []
    },
    {
      name: 'Experience',
      score: experienceScore,
      icon: Building,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Professional work experience and career progression',
      recommendations: experienceScore < 70 ? ['Gain more experience', 'Work on diverse projects', 'Join reputable companies'] : []
    },
    {
      name: 'Education',
      score: educationScore,
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Academic qualifications and educational background',
      recommendations: educationScore < 70 ? ['Complete higher education', 'Take specialized courses', 'Join prestigious institutions'] : []
    },
    {
      name: 'Projects',
      score: projectsScore,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: 'Portfolio projects and practical implementations',
      recommendations: projectsScore < 70 ? ['Build more projects', 'Showcase your work', 'Contribute to open source'] : []
    },
    {
      name: 'Certifications',
      score: certificationsScore,
      icon: Award,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: 'Industry certifications and professional credentials',
      recommendations: certificationsScore < 70 ? ['Get AWS/Azure certs', 'Obtain vendor certifications', 'Complete online courses'] : []
    },
    {
      name: 'Coding Assessment',
      score: codingScore,
      icon: Zap,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Algorithm solving and coding interview performance',
      recommendations: codingScore < 70 ? ['Practice DSA problems', 'Take coding assessments', 'Improve problem-solving'] : []
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Overall Rank Summary */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Your Ranking Breakdown
          </CardTitle>
          <CardDescription>
            Understand how your rank is calculated across different areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-primary">#{Math.floor(rankScore)}</div>
              <div className="text-sm text-muted-foreground">Overall Rank</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">{rankScore.toFixed(1)}/100</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>
          <Progress value={rankScore} className="h-3" />
          <div className="mt-2 text-sm text-muted-foreground">
            You're in the top {Math.round((100 - rankScore) / 2)}% of candidates
          </div>
        </CardContent>
      </Card>

      {/* Component Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {components.map((component) => {
          const Icon = component.icon;
          return (
            <Card key={component.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${component.bgColor}`}>
                    <Icon className={`h-5 w-5 ${component.color}`} />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getScoreColor(component.score)}
                  >
                    {component.score.toFixed(0)}%
                  </Badge>
                </div>
                <CardTitle className="text-lg">{component.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress 
                  value={component.score} 
                  className="h-2 mb-3"
                />
                {detailed && (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">
                      {component.description}
                    </p>
                    {component.recommendations.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">Recommendations:</div>
                        {component.recommendations.map((rec, index) => (
                          <div key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                            <Star className="h-3 w-3 mt-0.5 text-yellow-500" />
                            {rec}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Location-based Ranking */}
      {user.location && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">#{Math.floor(rankScore * 0.8)}</div>
                <div className="text-sm text-muted-foreground">in {user.location}</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">#{Math.floor(rankScore * 1.2)}</div>
                <div className="text-sm text-muted-foreground">in your field</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">#{Math.floor(rankScore * 0.9)}</div>
                <div className="text-sm text-muted-foreground">with similar experience</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Improvement Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Quick Improvement Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rankScore < 60 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900">Complete your profile</div>
                  <div className="text-sm text-blue-700">Add skills, experience, and education details</div>
                </div>
              </div>
            )}
            {codingScore < 70 && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <Code className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900">Take coding assessments</div>
                  <div className="text-sm text-green-700">Boost your rank with verified coding skills</div>
                </div>
              </div>
            )}
            {certificationsScore < 70 && (
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <Award className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <div className="font-medium text-purple-900">Get certifications</div>
                  <div className="text-sm text-purple-700">Industry certifications significantly boost rankings</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankBreakdown;