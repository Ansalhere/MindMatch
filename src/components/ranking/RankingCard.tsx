import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown, Medal, Crown } from 'lucide-react';

interface RankingCardProps {
  rank: number;
  name: string;
  score: number;
  userType?: string;
  company?: string;
  location?: string;
  change?: number;
  isCurrentUser?: boolean;
  skills?: string[];
}

const RankingCard = ({ 
  rank, 
  name, 
  score, 
  userType = 'candidate',
  company,
  location,
  change = 0,
  isCurrentUser = false,
  skills = []
}: RankingCardProps) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Trophy className="h-4 w-4 text-primary" />;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100";
    if (rank === 2) return "border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100";
    if (rank === 3) return "border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100";
    return "";
  };

  return (
    <Card className={`hover:shadow-md transition-all duration-200 ${
      isCurrentUser ? 'ring-2 ring-primary/50 bg-primary/5' : ''
    } ${getRankStyle(rank)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
              rank <= 3 ? 'text-white' : 'text-primary'
            } ${
              rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
              rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
              rank === 3 ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
              'bg-primary/10'
            }`}>
              {rank <= 3 ? getRankIcon(rank) : `#${rank}`}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{name}</h3>
                {isCurrentUser && <Badge variant="secondary" className="text-xs">You</Badge>}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {company && <span>{company}</span>}
                {location && <span>• {location}</span>}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="font-bold text-lg">{score.toFixed(1)}</span>
            </div>
            {change !== 0 && (
              <div className={`flex items-center gap-1 text-xs ${
                change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {change > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(change)}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      {skills.length > 0 && (
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{skills.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default RankingCard;