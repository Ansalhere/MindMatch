
import { Code, Laptop, Book, Trophy } from 'lucide-react';
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
  const mockBreakdown = {
    skills: Math.min(35, (userData.skillRankings?.length || 0) * 8),
    education: Math.min(25, userData.education?.length * 12 || 15),
    experience: Math.min(25, userData.experience?.length * 10 || 18),
    certifications: Math.min(15, userData.certifications?.length * 5 || 8)
  };

  const mockImprovements = [
    {
      category: "Technical Skills",
      current: mockBreakdown.skills,
      potential: 35,
      suggestion: "Add certifications in cloud technologies and modern frameworks"
    },
    {
      category: "Professional Experience",
      current: mockBreakdown.experience,
      potential: 25,
      suggestion: "Update your experience with quantifiable achievements and impact metrics"
    }
  ];

  return (
    <div className="space-y-6">
      <EnhancedRankingDisplay
        rankScore={userData.rank_score || 0}
        rankPosition={Math.floor((userData.rank_score || 50) / 100 * 5000) + 1}
        totalCandidates={5000}
        breakdown={mockBreakdown}
        improvements={mockImprovements}
      />
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Top Skills Performance</CardTitle>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              <Star className="h-3 w-3 mr-1" />
              Trending
            </Badge>
          </div>
          <CardDescription>Your strongest skills compared to the market</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userData.skillRankings && userData.skillRankings.map((skill: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    {skill.name === 'React.js' && <Code className="h-4 w-4 mr-2 text-primary" />}
                    {skill.name === 'TypeScript' && <Laptop className="h-4 w-4 mr-2 text-primary" />}
                    {skill.name === 'UI/UX' && <Book className="h-4 w-4 mr-2 text-primary" />}
                    <span className="text-sm font-medium">{skill.name}</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{skill.score}%</span>
                </div>
                <Progress value={skill.score} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                    Rank: #{skill.ranking}
                  </span>
                  <span>Top {Math.round((skill.ranking / skill.total) * 100)}%</span>
                </div>
              </div>
            ))}
            
            <Button asChild variant="outline" className="w-full mt-4">
              <Link to={`/profile/${userData.id}/candidate`}>
                View Full Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillRanking;
