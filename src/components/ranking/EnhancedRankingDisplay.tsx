
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, TrendingUp, Award, BookOpen, Briefcase, Zap, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnhancedRankingDisplayProps {
  rankScore: number;
  rankPosition: number;
  totalCandidates: number;
  improvements?: {
    category: string;
    current: number;
    potential: number;
    suggestion: string;
  }[];
  breakdown?: {
    skills: number;
    education: number;
    experience: number;
    certifications: number;
  };
}

const EnhancedRankingDisplay = ({ 
  rankScore, 
  rankPosition, 
  totalCandidates,
  improvements = [],
  breakdown = { skills: 35, education: 25, experience: 25, certifications: 15 }
}: EnhancedRankingDisplayProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const percentile = Math.round((1 - rankPosition / totalCandidates) * 100);
  const getRankTier = (score: number) => {
    if (score >= 90) return { tier: 'Elite', color: 'bg-gradient-to-r from-yellow-400 to-yellow-600', icon: Trophy };
    if (score >= 75) return { tier: 'Expert', color: 'bg-gradient-to-r from-purple-500 to-purple-700', icon: Star };
    if (score >= 60) return { tier: 'Professional', color: 'bg-gradient-to-r from-blue-500 to-blue-700', icon: Award };
    if (score >= 40) return { tier: 'Skilled', color: 'bg-gradient-to-r from-green-500 to-green-700', icon: Target };
    return { tier: 'Emerging', color: 'bg-gradient-to-r from-gray-500 to-gray-700', icon: TrendingUp };
  };

  const { tier, color, icon: TierIcon } = getRankTier(rankScore);

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-xl">
      <CardHeader className={`${color} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white/20 rounded-full">
                <TierIcon className="h-8 w-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">RankMe Score</CardTitle>
                <p className="text-white/90 font-medium">{tier} Tier Candidate</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{rankScore.toFixed(1)}</div>
              <div className="text-white/90 text-sm">out of 100</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">#{rankPosition.toLocaleString()}</div>
              <div className="text-white/80 text-sm">Global Rank</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">Top {percentile}%</div>
              <div className="text-white/80 text-sm">Percentile</div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="improve">Improve</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Score Distribution</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-sm font-medium">Skills</span>
                  </div>
                  <span className="text-sm font-medium">{breakdown.skills}%</span>
                </div>
                <Progress value={breakdown.skills} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Education</span>
                  </div>
                  <span className="text-sm font-medium">{breakdown.education}%</span>
                </div>
                <Progress value={breakdown.education} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Experience</span>
                  </div>
                  <span className="text-sm font-medium">{breakdown.experience}%</span>
                </div>
                <Progress value={breakdown.experience} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Certifications</span>
                  </div>
                  <span className="text-sm font-medium">{breakdown.certifications}%</span>
                </div>
                <Progress value={breakdown.certifications} className="h-2" />
              </div>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Your Competitive Edge</h4>
              <p className="text-sm text-muted-foreground">
                You rank higher than {((totalCandidates - rankPosition) / totalCandidates * 100).toFixed(1)}% 
                of candidates on RankMe.AI. Your {tier.toLowerCase()} tier status puts you in high demand 
                with premium employers.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="breakdown" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Skills Assessment</h4>
                </div>
                <div className="text-2xl font-bold text-amber-600">{breakdown.skills}/40</div>
                <p className="text-xs text-muted-foreground">Technical & soft skills evaluation</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <h4 className="font-medium">Education</h4>
                </div>
                <div className="text-2xl font-bold text-blue-600">{breakdown.education}/25</div>
                <p className="text-xs text-muted-foreground">Degree level, GPA, institution rank</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase className="h-5 w-5 text-green-500" />
                  <h4 className="font-medium">Experience</h4>
                </div>
                <div className="text-2xl font-bold text-green-600">{breakdown.experience}/25</div>
                <p className="text-xs text-muted-foreground">Years, relevance, company tier</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <h4 className="font-medium">Certifications</h4>
                </div>
                <div className="text-2xl font-bold text-purple-600">{breakdown.certifications}/10</div>
                <p className="text-xs text-muted-foreground">Industry certifications & licenses</p>
              </motion.div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Ranking Algorithm</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Our AI-powered system evaluates your profile across multiple dimensions:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Skill verification & proficiency</span>
                  <Badge variant="secondary">40%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Experience quality & duration</span>
                  <Badge variant="secondary">25%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Educational background</span>
                  <Badge variant="secondary">25%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Professional certifications</span>
                  <Badge variant="secondary">10%</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="improve" className="space-y-6">
            {improvements.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Improvement Opportunities</h3>
                {improvements.map((improvement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{improvement.category}</h4>
                      <Badge variant="outline">
                        +{improvement.potential - improvement.current} points
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{improvement.suggestion}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Current: {improvement.current}</span>
                        <span>Potential: {improvement.potential}</span>
                      </div>
                      <Progress value={(improvement.current / improvement.potential) * 100} className="h-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Maximize Your Potential</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete your profile to unlock personalized improvement suggestions
                </p>
                <Button>Complete Profile Assessment</Button>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Quick Wins</h4>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Add 2-3 relevant skills to increase visibility</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Update your experience descriptions with achievements</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Add industry-relevant certifications</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedRankingDisplay;
