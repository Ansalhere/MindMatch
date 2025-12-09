import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Target, Award, Briefcase, GraduationCap, 
  Code, CheckCircle, ArrowRight, Sparkles, Zap, Star,
  FileText, User, Shield, Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RankingImprovementGuideProps {
  currentScore: number;
  breakdown: {
    skills: number;
    education: number;
    experience: number;
    certifications: number;
    profile?: number;
  };
  onActionClick?: (action: string) => void;
}

const RankingImprovementGuide = ({ 
  currentScore, 
  breakdown, 
  onActionClick 
}: RankingImprovementGuideProps) => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const improvementAreas = [
    {
      id: 'skills',
      title: 'Skills & Expertise',
      icon: Code,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      currentScore: breakdown.skills,
      maxScore: 40,
      weight: '40%',
      actions: [
        { label: 'Add new skills', path: '/add-skill', points: '+5-15 pts' },
        { label: 'Take skill assessment', path: '/skills', points: '+10-20 pts' },
        { label: 'Get skills verified', path: '/skills', points: '+5-10 pts' },
      ],
      tips: [
        'Add at least 5-7 relevant skills',
        'Include years of experience for each skill',
        'Take assessments to verify your proficiency',
        'Focus on in-demand technologies like React, Python, AWS'
      ]
    },
    {
      id: 'experience',
      title: 'Work Experience',
      icon: Briefcase,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      currentScore: breakdown.experience,
      maxScore: 25,
      weight: '25%',
      actions: [
        { label: 'Add experience', path: '/edit-profile', points: '+8-12 pts' },
        { label: 'Update descriptions', path: '/edit-profile', points: '+3-5 pts' },
      ],
      tips: [
        'Include all relevant work experiences',
        'Add detailed descriptions with achievements',
        'Mention quantifiable results (e.g., "increased sales by 30%")',
        'Include leadership roles and responsibilities'
      ]
    },
    {
      id: 'education',
      title: 'Education',
      icon: GraduationCap,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      currentScore: breakdown.education,
      maxScore: 25,
      weight: '25%',
      actions: [
        { label: 'Add education', path: '/edit-profile', points: '+10-15 pts' },
        { label: 'Update GPA/grades', path: '/edit-profile', points: '+2-5 pts' },
      ],
      tips: [
        'Add your highest degree first',
        'Include relevant coursework and projects',
        'Mention GPA if above 3.0',
        'Add any honors or achievements'
      ]
    },
    {
      id: 'certifications',
      title: 'Certifications',
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      currentScore: breakdown.certifications,
      maxScore: 10,
      weight: '10%',
      actions: [
        { label: 'Add certification', path: '/edit-profile', points: '+5-8 pts' },
        { label: 'Verify credentials', path: '/edit-profile', points: '+2-3 pts' },
      ],
      tips: [
        'Add industry-recognized certifications (AWS, Google, Microsoft)',
        'Include credential IDs for verification',
        'Keep certifications up to date',
        'Prioritize certifications relevant to your target roles'
      ]
    },
    {
      id: 'profile',
      title: 'Profile Completeness',
      icon: User,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      currentScore: breakdown.profile || 0,
      maxScore: 10,
      weight: 'Bonus',
      actions: [
        { label: 'Complete profile', path: '/edit-profile', points: '+5-10 pts' },
        { label: 'Upload resume', path: '/edit-profile', points: '+5 pts' },
        { label: 'Add photo', path: '/edit-profile', points: '+2 pts' },
      ],
      tips: [
        'Fill in all profile fields',
        'Upload a professional resume',
        'Add a profile photo',
        'Write a compelling bio'
      ]
    }
  ];

  const handleAction = (path: string) => {
    if (onActionClick) {
      onActionClick(path);
    } else {
      navigate(path);
    }
  };

  const getNextTier = (score: number) => {
    if (score >= 90) return { name: 'Elite', target: 100, color: 'text-yellow-500' };
    if (score >= 75) return { name: 'Elite', target: 90, color: 'text-yellow-500' };
    if (score >= 60) return { name: 'Expert', target: 75, color: 'text-purple-500' };
    if (score >= 40) return { name: 'Professional', target: 60, color: 'text-blue-500' };
    return { name: 'Skilled', target: 40, color: 'text-green-500' };
  };

  const nextTier = getNextTier(currentScore);
  const pointsToNext = Math.max(0, nextTier.target - currentScore);

  return (
    <div className="space-y-6">
      {/* Progress to Next Tier */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Next Goal: {nextTier.name} Tier
              </h3>
              <p className="text-sm text-muted-foreground">
                {pointsToNext.toFixed(1)} more points needed
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-primary">{currentScore.toFixed(1)}</span>
              <span className="text-muted-foreground">/{nextTier.target}</span>
            </div>
          </div>
          <Progress value={(currentScore / nextTier.target) * 100} className="h-3" />
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-background">
              <Sparkles className="h-3 w-3 mr-1" />
              {Math.round((currentScore / 100) * 100)}% Complete
            </Badge>
            <Badge variant="secondary">
              <TrendingUp className="h-3 w-3 mr-1" />
              Rank #{Math.floor((1 - currentScore / 100) * 5000) + 1}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Improvement Areas */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          How to Improve Your Ranking
        </h3>
        
        {improvementAreas.map((area, index) => {
          const Icon = area.icon;
          const percentage = (area.currentScore / area.maxScore) * 100;
          const isExpanded = expandedSection === area.id;
          
          return (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${area.borderColor} border-2 ${isExpanded ? 'ring-2 ring-primary/20' : ''}`}
                onClick={() => setExpandedSection(isExpanded ? null : area.id)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${area.bgColor}`}>
                        <Icon className={`h-5 w-5 ${area.color}`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{area.title}</h4>
                        <p className="text-xs text-muted-foreground">Weight: {area.weight}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold">{area.currentScore.toFixed(0)}</span>
                      <span className="text-muted-foreground text-sm">/{area.maxScore}</span>
                    </div>
                  </div>
                  
                  <Progress value={percentage} className="h-2 mb-3" />
                  
                  {percentage < 80 && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 mb-3">
                      <Star className="h-4 w-4" />
                      <span>Room for improvement! Add more to boost your rank.</span>
                    </div>
                  )}
                  
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 space-y-4"
                    >
                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Quick Actions:</p>
                        {area.actions.map((action, actionIndex) => (
                          <Button
                            key={actionIndex}
                            variant="outline"
                            size="sm"
                            className="w-full justify-between"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAction(action.path);
                            }}
                          >
                            <span className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              {action.label}
                            </span>
                            <Badge variant="secondary" className="ml-2">
                              {action.points}
                            </Badge>
                          </Button>
                        ))}
                      </div>
                      
                      {/* Tips */}
                      <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium">Pro Tips:</p>
                        <ul className="space-y-1">
                          {area.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
        <CardContent className="pt-6 text-center">
          <Shield className="h-12 w-12 mx-auto text-primary mb-3" />
          <h3 className="font-semibold text-lg mb-2">Ready to Boost Your Ranking?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete your profile and add your skills to improve visibility to employers
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => handleAction('/edit-profile')}>
              <FileText className="h-4 w-4 mr-2" />
              Complete Profile
            </Button>
            <Button variant="outline" onClick={() => handleAction('/add-skill')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skills
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingImprovementGuide;
