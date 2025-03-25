
import { Code, Laptop, Book, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from 'lucide-react';

interface SkillRankingProps {
  userData: any;
}

const SkillRanking = ({ userData }: SkillRankingProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Your Top Skills</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            <Star className="h-3 w-3 mr-1" />
            Ranking
          </Badge>
        </div>
        <CardDescription>How you rank compared to others</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {userData.skillRankings.map((skill: any, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center">
                  {skill.name === 'React.js' && <Code className="h-4 w-4 mr-2 text-primary" />}
                  {skill.name === 'TypeScript' && <Laptop className="h-4 w-4 mr-2 text-primary" />}
                  {skill.name === 'UI/UX' && <Book className="h-4 w-4 mr-2 text-primary" />}
                  <span className="text-sm font-medium">{skill.name}</span>
                </div>
                <span className="text-sm font-medium">{skill.score}%</span>
              </div>
              <Progress value={skill.score} className="h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                  Rank: #{skill.ranking}
                </span>
                <span>Top {Math.round((skill.ranking / skill.total) * 100)}%</span>
              </div>
            </div>
          ))}
          
          <Button asChild variant="outline" className="w-full mt-2">
            <Link to={`/profile/${userData.id}/candidate`}>
              View Full Profile
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillRanking;
