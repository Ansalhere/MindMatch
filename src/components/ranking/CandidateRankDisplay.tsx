
import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Trophy, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface CandidateRankDisplayProps {
  rankScore: number;
  rankPosition: number;
  totalCandidates: number;
  showDetailedScore?: boolean;
}

const CandidateRankDisplay: React.FC<CandidateRankDisplayProps> = ({
  rankScore,
  rankPosition,
  totalCandidates,
  showDetailedScore = false
}) => {
  // Calculate percentile (higher is better)
  const percentile = Math.round((1 - (rankPosition / totalCandidates)) * 100);
  
  // Calculate color based on score
  const getColor = (score: number) => {
    if (score >= 80) return '#22c55e'; // Green
    if (score >= 60) return '#3b82f6'; // Blue
    if (score >= 40) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };
  
  // Skills proficiency rating based on score
  const getSkillLevel = (score: number) => {
    if (score >= 80) return 'Expert';
    if (score >= 60) return 'Advanced';
    if (score >= 40) return 'Intermediate';
    return 'Beginner';
  };
  
  // Rank tier calculation
  const rankTiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const rankTierIndex = Math.min(Math.floor(rankScore / 20), 4);
  const rankTier = rankTiers[rankTierIndex];
  
  return (
    <div className="relative">
      <div className="flex flex-col items-center mb-4">
        <div className="w-28 h-28 mb-3">
          <CircularProgressbar
            value={rankScore}
            maxValue={100}
            text={`${rankScore}`}
            styles={buildStyles({
              textSize: '24px',
              pathColor: getColor(rankScore),
              textColor: getColor(rankScore),
              trailColor: '#e5e7eb',
            })}
          />
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-base font-medium">{rankTier} Tier</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Top {percentile}% ({rankPosition} of {totalCandidates})
          </div>
        </div>
      </div>
      
      {showDetailedScore && (
        <div className="space-y-3 mt-6">
          <h3 className="text-sm font-medium flex items-center gap-2">
            Rank Score Breakdown
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="w-64">
                  <p>Your rank score is calculated based on your skills, experience, education, and certifications.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Skills proficiency</span>
              <Badge variant="outline">{getSkillLevel(rankScore)}</Badge>
            </div>
            <Progress value={rankScore} className="h-1.5" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateRankDisplay;
