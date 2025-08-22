import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Code, 
  Plus, 
  Star, 
  TrendingUp, 
  Award, 
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';

interface Skill {
  id: string;
  name: string;
  level: number;
  experience_years: number;
  is_verified: boolean;
  verification_source?: string;
}

const SkillsList = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserSkills();
    }
  }, [user]);

  const fetchUserSkills = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)
        .order('level', { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const getSkillLevelLabel = (level: number) => {
    if (level >= 9) return 'Expert';
    if (level >= 7) return 'Advanced';
    if (level >= 5) return 'Intermediate';
    if (level >= 3) return 'Beginner';
    return 'Novice';
  };

  const getSkillLevelColor = (level: number) => {
    if (level >= 9) return 'text-green-600 bg-green-50';
    if (level >= 7) return 'text-blue-600 bg-blue-50';
    if (level >= 5) return 'text-yellow-600 bg-yellow-50';
    if (level >= 3) return 'text-orange-600 bg-orange-50';
    return 'text-gray-600 bg-gray-50';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Your Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading skills...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Your Skills ({skills.length})
            </CardTitle>
            <CardDescription>
              Showcase your technical expertise and competencies
            </CardDescription>
          </div>
          <Button onClick={() => navigate('/add-skill')} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center py-8">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No skills added yet</h3>
            <p className="text-muted-foreground mb-4">
              Start building your profile by adding your technical skills
            </p>
            <Button onClick={() => navigate('/add-skill')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-lg">{skill.name}</h4>
                    {skill.is_verified && (
                      <Badge variant="default" className="bg-green-500 text-white text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getSkillLevelColor(skill.level)}
                  >
                    {getSkillLevelLabel(skill.level)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Proficiency Level</span>
                      <span className="font-medium">{skill.level}/10</span>
                    </div>
                    <Progress value={skill.level * 10} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>Experience: {skill.experience_years} years</span>
                    </div>
                    {skill.verification_source && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Award className="h-4 w-4" />
                        <span className="text-xs">{skill.verification_source}</span>
                      </div>
                    )}
                  </div>

                  {!skill.is_verified && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-md">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-xs text-yellow-700">
                        Take an assessment to verify this skill and boost your ranking
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="ml-auto text-xs"
                        onClick={() => navigate('/skills')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Verify
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Boost Your Ranking</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Add more skills or verify existing ones to improve your candidate ranking
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/add-skill')}
                    >
                      Add More Skills
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/skills')}
                    >
                      Take Assessments
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsList;