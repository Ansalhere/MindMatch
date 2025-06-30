
import { Code, Laptop, Book, Trophy, TrendingUp, Award, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';
import EnhancedRankingDisplay from '@/components/ranking/EnhancedRankingDisplay';

interface SkillRankingProps {
  userData: any;
}

const SkillRanking = ({ userData }: SkillRankingProps) => {
  // More sophisticated ranking calculation
  const calculateAdvancedBreakdown = (userData: any) => {
    const skills = Math.min(40, (userData.skillRankings?.length || 0) * 10 + 
      (userData.skillRankings?.reduce((acc: number, skill: any) => acc + (skill.score || 0), 0) || 0) / 10);
    
    const education = Math.min(25, userData.education?.length * 15 || 20);
    const experience = Math.min(25, userData.experience?.length * 12 || 15);
    const certifications = Math.min(10, userData.certifications?.length * 8 || 5);
    
    return { skills, education, experience, certifications };
  };

  const breakdown = calculateAdvancedBreakdown(userData);
  const totalScore = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

  const mockImprovements = [
    {
      category: "Technical Skills",
      current: breakdown.skills,
      potential: 40,
      suggestion: "Add certifications in cloud technologies (AWS, Azure) and modern frameworks (React, Node.js)",
      priority: "High",
      estimatedIncrease: "+15-20 points"
    },
    {
      category: "Professional Experience",
      current: breakdown.experience,
      potential: 25,
      suggestion: "Update your experience with quantifiable achievements, leadership roles, and impact metrics",
      priority: "Medium",
      estimatedIncrease: "+8-12 points"
    },
    {
      category: "Certifications",
      current: breakdown.certifications,
      potential: 10,
      suggestion: "Obtain industry-recognized certifications in your field of expertise",
      priority: "High",
      estimatedIncrease: "+5-8 points"
    }
  ];

  const getSkillIcon = (skillName: string) => {
    const name = skillName.toLowerCase();
    if (name.includes('react') || name.includes('javascript') || name.includes('typescript')) {
      return <Code className="h-4 w-4 mr-2 text-blue-600" />;
    }
    if (name.includes('design') || name.includes('ui') || name.includes('ux')) {
      return <Book className="h-4 w-4 mr-2 text-purple-600" />;
    }
    return <Laptop className="h-4 w-4 mr-2 text-green-600" />;
  };

  const getRankTier = (score: number) => {
    if (score >= 90) return { tier: "Elite", color: "text-yellow-600", bgColor: "bg-yellow-50" };
    if (score >= 75) return { tier: "Expert", color: "text-blue-600", bgColor: "bg-blue-50" };
    if (score >= 60) return { tier: "Advanced", color: "text-green-600", bgColor: "bg-green-50" };
    if (score >= 40) return { tier: "Intermediate", color: "text-orange-600", bgColor: "bg-orange-50" };
    return { tier: "Beginner", color: "text-gray-600", bgColor: "bg-gray-50" };
  };

  const rankTier = getRankTier(totalScore);

  return (
    <div className="space-y-6">
      <EnhancedRankingDisplay
        rankScore={userData.rank_score || totalScore}
        rankPosition={Math.floor((userData.rank_score || totalScore) / 100 * 5000) + 1}
        totalCandidates={5000}
        breakdown={breakdown}
        improvements={mockImprovements}
      />
      
      {/* Ranking Overview Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Your Ranking Overview
            </CardTitle>
            <Badge className={`${rankTier.bgColor} ${rankTier.color} border-current`}>
              {rankTier.tier}
            </Badge>
          </div>
          <CardDescription>Comprehensive analysis of your professional standing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">{breakdown.skills}</div>
              <div className="text-xs text-blue-600 font-medium">Skills</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-50">
              <div className="text-2xl font-bold text-green-600">{breakdown.experience}</div>
              <div className="text-xs text-green-600 font-medium">Experience</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50">
              <div className="text-2xl font-bold text-purple-600">{breakdown.education}</div>
              <div className="text-xs text-purple-600 font-medium">Education</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-orange-50">
              <div className="text-2xl font-bold text-orange-600">{breakdown.certifications}</div>
              <div className="text-xs text-orange-600 font-medium">Certifications</div>
            </div>
          </div>

          {/* Progress to Next Tier */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progress to Next Tier</span>
              <span className="text-muted-foreground">{totalScore}/100</span>
            </div>
            <Progress value={totalScore} className="h-3" />
          </div>
        </CardContent>
      </Card>
      
      {/* Skills Performance Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Skills Performance
            </CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
              <Star className="h-3 w-3" />
              Top Performer
            </Badge>
          </div>
          <CardDescription>Your strongest skills compared to the market</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userData.skillRankings && userData.skillRankings.length > 0 ? (
              userData.skillRankings.map((skill: any, index: number) => (
                <div key={index} className="space-y-3 p-3 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {getSkillIcon(skill.name)}
                      <span className="text-sm font-semibold">{skill.name}</span>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {skill.score}%
                    </Badge>
                  </div>
                  <Progress value={skill.score} className="h-2" />
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-3 w-3 text-amber-500" />
                      Rank: #{skill.ranking || Math.floor(Math.random() * 100) + 1}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-green-500" />
                      Top {Math.round(((skill.ranking || 50) / (skill.total || 1000)) * 100)}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="font-medium">No skills added yet</p>
                <p className="text-sm">Add your skills to see your ranking</p>
              </div>
            )}
            
            <div className="pt-4 space-y-2">
              <Button asChild variant="default" className="w-full">
                <Link to="/add-skill">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Improve Your Ranking
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link to={`/profile/${userData.id}/candidate`}>
                  View Full Profile
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillRanking;
