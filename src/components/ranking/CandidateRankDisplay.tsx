
import { Trophy, Star, Award, TrendingUp } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CandidateRankDisplayProps {
  rankScore: number;
  rankPosition?: number;
  totalCandidates?: number;
  compact?: boolean;
  showExplanationLink?: boolean;
  showDetailedScore?: boolean; // Added new prop
}

const CandidateRankDisplay = ({
  rankScore = 0,
  rankPosition,
  totalCandidates = 1000,
  compact = false,
  showExplanationLink = true,
  showDetailedScore = false // Added default value
}: CandidateRankDisplayProps) => {
  
  const getTierLabel = (score: number) => {
    if (score >= 90) return { label: 'Elite', color: 'text-purple-600' };
    if (score >= 80) return { label: 'Expert', color: 'text-indigo-600' };
    if (score >= 70) return { label: 'Advanced', color: 'text-blue-600' };
    if (score >= 60) return { label: 'Intermediate', color: 'text-teal-600' };
    if (score >= 50) return { label: 'Developing', color: 'text-green-600' };
    return { label: 'Beginner', color: 'text-orange-600' };
  };

  const tier = getTierLabel(rankScore);
  const rankPercentile = rankPosition ? Math.round((rankPosition / totalCandidates) * 100) : null;
  
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Trophy className="h-4 w-4 text-amber-500" />
        <span className="font-semibold">{rankScore}</span>
        {rankPosition && (
          <span className="text-xs text-muted-foreground">
            (#{rankPosition})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-muted/30 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-amber-500 mr-2" />
          <h3 className="font-medium">Rank Score</h3>
        </div>
        <Badge className={`${tier.color} bg-white border`}>
          {tier.label} Tier
        </Badge>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Overall Score</span>
          <span className="font-bold text-lg">{rankScore}/100</span>
        </div>
        <Progress value={rankScore} className="h-2" />
      </div>
      
      {rankPosition && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1 text-primary" />
            <span>Ranking position: <strong>#{rankPosition}</strong></span>
          </div>
          <span className="text-muted-foreground">Top {rankPercentile}%</span>
        </div>
      )}
      
      {showExplanationLink && (
        <div className="mt-3 text-center">
          <Button variant="link" size="sm" asChild>
            <Link to="/ranking-explanation">
              <Award className="h-3 w-3 mr-1" />
              How is this calculated?
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default CandidateRankDisplay;
