import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Search, 
  Zap, 
  Target, 
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Star,
  Award,
  Briefcase
} from 'lucide-react';
import { toast } from "sonner";
import { motion, AnimatePresence } from 'framer-motion';

interface AIRecommendation {
  id: string;
  type: 'skill' | 'job' | 'learning-path';
  title: string;
  description: string;
  relevanceScore: number;
  reason: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: string;
  prerequisites?: string[];
  relatedSkills?: string[];
}

interface UserProfile {
  currentSkills: string[];
  experience: string;
  careerGoals: string;
  interests: string[];
  availability: string;
}

const AISkillMatcher = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    currentSkills: [],
    experience: '',
    careerGoals: '',
    interests: [],
    availability: ''
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  const popularSkills = [
    'React', 'Python', 'JavaScript', 'Node.js', 'AWS', 'TypeScript',
    'SQL', 'Docker', 'MongoDB', 'Git', 'Next.js', 'GraphQL',
    'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Project Management'
  ];

  const addSkill = () => {
    if (newSkill.trim() && !userProfile.currentSkills.includes(newSkill.trim())) {
      setUserProfile(prev => ({
        ...prev,
        currentSkills: [...prev.currentSkills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setUserProfile(prev => ({
      ...prev,
      currentSkills: prev.currentSkills.filter(s => s !== skill)
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !userProfile.interests.includes(newInterest.trim())) {
      setUserProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setUserProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const generateRecommendations = async () => {
    if (!userProfile.careerGoals.trim()) {
      toast.error("Please describe your career goals first");
      return;
    }

    setLoading(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendations: AIRecommendation[] = [
        {
          id: '1',
          type: 'skill',
          title: 'TypeScript',
          description: 'Enhance your JavaScript skills with type safety',
          relevanceScore: 95,
          reason: 'Based on your React experience, TypeScript will improve code quality and developer experience',
          difficulty: 'intermediate',
          estimatedTime: '2-3 weeks',
          prerequisites: ['JavaScript', 'React'],
          relatedSkills: ['Next.js', 'Angular']
        },
        {
          id: '2',
          type: 'learning-path',
          title: 'Full Stack Developer Path',
          description: 'Complete learning path from frontend to backend',
          relevanceScore: 88,
          reason: 'Aligns with your goal to become a full-stack developer',
          difficulty: 'intermediate',
          estimatedTime: '3-4 months',
          prerequisites: ['HTML', 'CSS', 'JavaScript'],
          relatedSkills: ['Node.js', 'Express', 'MongoDB', 'React']
        },
        {
          id: '3',
          type: 'job',
          title: 'Frontend Developer Roles',
          description: 'Positions matching your current skill set',
          relevanceScore: 82,
          reason: 'Your React and JavaScript skills are in high demand',
          difficulty: 'intermediate',
          relatedSkills: ['React', 'JavaScript', 'CSS']
        },
        {
          id: '4',
          type: 'skill',
          title: 'AWS Cloud Fundamentals',
          description: 'Learn cloud computing basics for modern applications',
          relevanceScore: 78,
          reason: 'Cloud skills complement your development background',
          difficulty: 'beginner',
          estimatedTime: '4-6 weeks',
          prerequisites: ['Basic programming'],
          relatedSkills: ['Docker', 'DevOps', 'Serverless']
        }
      ];

      setRecommendations(mockRecommendations);
      setActiveTab('recommendations');
      toast.success("AI recommendations generated!");
    } catch (error) {
      toast.error("Failed to generate recommendations");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'skill': return Target;
      case 'job': return Briefcase;
      case 'learning-path': return TrendingUp;
      default: return Star;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'skill': return 'bg-blue-500';
      case 'job': return 'bg-green-500';
      case 'learning-path': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">AI Skill Matcher</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Get personalized skill recommendations based on your profile, goals, and current market trends
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Build Profile</TabsTrigger>
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Your Professional Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="experience">Current Experience Level</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your current role, years of experience, and main responsibilities..."
                  value={userProfile.experience}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, experience: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="careerGoals">Career Goals</Label>
                <Textarea
                  id="careerGoals"
                  placeholder="What are your career aspirations? What role do you want to achieve?"
                  value={userProfile.careerGoals}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, careerGoals: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Current Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill..."
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill}>Add</Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {userProfile.currentSkills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button 
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Popular Skills:</div>
                    <div className="flex flex-wrap gap-2">
                      {popularSkills.filter(skill => !userProfile.currentSkills.includes(skill)).map((skill) => (
                        <Badge 
                          key={skill} 
                          variant="outline" 
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => setUserProfile(prev => ({ ...prev, currentSkills: [...prev.currentSkills, skill] }))}
                        >
                          + {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interests & Industry Preferences</Label>
                <div className="flex gap-2">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    placeholder="Add an interest..."
                    onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                  />
                  <Button onClick={addInterest}>Add</Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {userProfile.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                      {interest}
                      <button 
                        onClick={() => removeInterest(interest)}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Learning Availability</Label>
                <Input
                  id="availability"
                  placeholder="e.g., 10 hours/week, weekends only, full-time"
                  value={userProfile.availability}
                  onChange={(e) => setUserProfile(prev => ({ ...prev, availability: e.target.value }))}
                />
              </div>

              <Button 
                onClick={() => setActiveTab('analysis')} 
                className="w-full"
                disabled={!userProfile.careerGoals.trim()}
              >
                Continue to AI Analysis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">AI is analyzing your profile</h3>
                <p className="text-muted-foreground">
                  Our AI is processing your skills, goals, and preferences to generate personalized recommendations
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Skills Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      {userProfile.currentSkills.length} skills identified
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Market Trends</h4>
                    <p className="text-sm text-muted-foreground">
                      Analyzing current job market demands
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Learning Paths</h4>
                    <p className="text-sm text-muted-foreground">
                      Mapping optimal skill progression
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Career Alignment</h4>
                    <p className="text-sm text-muted-foreground">
                      Matching with career objectives
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={generateRecommendations}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Recommendations...
                  </>
                ) : (
                  <>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Generate AI Recommendations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          {recommendations.length > 0 ? (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Your Personalized Recommendations</h3>
                <p className="text-muted-foreground">
                  Based on AI analysis of your profile and current market trends
                </p>
              </div>

              <div className="grid gap-4">
                <AnimatePresence>
                  {recommendations.map((rec, index) => {
                    const IconComponent = getTypeIcon(rec.type);
                    return (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className={`p-3 rounded-lg ${getTypeColor(rec.type)} text-white`}>
                                <IconComponent className="h-6 w-6" />
                              </div>
                              
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-lg">{rec.title}</h4>
                                    <p className="text-muted-foreground">{rec.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500" />
                                      <span className="font-medium">{rec.relevanceScore}%</span>
                                    </div>
                                    <Badge variant={rec.difficulty === 'beginner' ? 'secondary' : 
                                                  rec.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                                      {rec.difficulty}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <p className="text-sm bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                  <strong>Why this recommendation:</strong> {rec.reason}
                                </p>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  {rec.estimatedTime && (
                                    <div>⏱️ {rec.estimatedTime}</div>
                                  )}
                                  {rec.prerequisites && (
                                    <div>📋 Prerequisites: {rec.prerequisites.join(', ')}</div>
                                  )}
                                </div>
                                
                                {rec.relatedSkills && (
                                  <div className="space-y-2">
                                    <div className="text-sm font-medium">Related Skills:</div>
                                    <div className="flex flex-wrap gap-2">
                                      {rec.relatedSkills.map((skill) => (
                                        <Badge key={skill} variant="outline" className="text-xs">
                                          {skill}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                
                                <div className="flex gap-2 pt-2">
                                  <Button size="sm">
                                    {rec.type === 'skill' ? 'Start Learning' : 
                                     rec.type === 'job' ? 'View Jobs' : 'Begin Path'}
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Save for Later
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No recommendations yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete your profile and run AI analysis to get personalized recommendations
              </p>
              <Button onClick={() => setActiveTab('profile')}>
                Build Your Profile
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AISkillMatcher;