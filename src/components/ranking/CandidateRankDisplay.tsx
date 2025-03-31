
import React, { useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Trophy, Info, Star, Award, TrendingUp, Zap, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  const [displayMode, setDisplayMode] = useState<'score' | 'percentile' | 'tier'>('score');
  
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
  
  // Performance metrics (example values)
  const performanceMetrics = [
    { name: 'Technical Skills', value: rankScore * 0.9 },
    { name: 'Experience', value: rankScore * 1.1 > 100 ? 100 : rankScore * 1.1 },
    { name: 'Education', value: rankScore * 0.85 },
    { name: 'Certifications', value: rankScore * 0.95 }
  ];

  // Industry rank (example)
  const industryRank = Math.max(1, Math.floor(rankPosition * 0.8));
  
  const renderDisplayContent = () => {
    switch(displayMode) {
      case 'percentile':
        return (
          <CircularProgressbar
            value={percentile}
            maxValue={100}
            text={`${percentile}%`}
            styles={buildStyles({
              textSize: '24px',
              pathColor: getColor(percentile),
              textColor: getColor(percentile),
              trailColor: '#e5e7eb',
            })}
          />
        );
      case 'tier':
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative">
              <Trophy 
                className={`h-16 w-16 ${
                  rankTierIndex === 4 ? 'text-violet-500' : 
                  rankTierIndex === 3 ? 'text-sky-500' : 
                  rankTierIndex === 2 ? 'text-amber-500' : 
                  rankTierIndex === 1 ? 'text-slate-400' : 
                  'text-amber-800'
                }`} 
              />
              <Badge className="absolute bottom-0 right-0 bg-primary">{rankTier}</Badge>
            </div>
            <span className="text-base font-medium mt-2">{rankTier} Tier</span>
          </div>
        );
      default: // 'score'
        return (
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
        );
    }
  };
  
  return (
    <div className="relative">
      <div className="flex flex-col items-center mb-4">
        <div className="w-32 h-32 mb-3">
          {renderDisplayContent()}
        </div>
        
        <div className="w-full flex justify-center mb-3">
          <Select value={displayMode} onValueChange={(value) => setDisplayMode(value as 'score' | 'percentile' | 'tier')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View as" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>View Mode</SelectLabel>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="percentile">Percentile</SelectItem>
                <SelectItem value="tier">Tier</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
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
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="rank-breakdown">
              <AccordionTrigger className="text-sm font-medium">
                Rank Score Breakdown
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground ml-2" />
                    </TooltipTrigger>
                    <TooltipContent className="w-64">
                      <p>Your rank score is calculated based on your skills, experience, education, and certifications.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Skills proficiency</span>
                      <Badge variant="outline">{getSkillLevel(rankScore)}</Badge>
                    </div>
                    <Progress value={rankScore} className="h-1.5" />
                  </div>
                  
                  {performanceMetrics.map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{metric.name}</span>
                        <span className="text-xs text-muted-foreground">{Math.round(metric.value)}%</span>
                      </div>
                      <Progress value={metric.value} className="h-1.5" />
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="industry-comparison">
              <AccordionTrigger className="text-sm font-medium">
                Industry Comparison
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/30 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Industry Rank</span>
                      <Badge variant="secondary">{industryRank} / {Math.round(totalCandidates * 0.7)}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You rank in the top {Math.round((industryRank / (totalCandidates * 0.7)) * 100)}% of candidates in your industry.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <p className="text-xs text-muted-foreground">Improve your ranking by adding more skills and certifications.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
    </div>
  );
};

export default CandidateRankDisplay;
