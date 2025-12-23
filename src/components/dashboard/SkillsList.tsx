import { useState, useEffect, useCallback } from 'react';
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
  ExternalLink,
  RefreshCw,
  Trash2
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
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const fetchUserSkills = useCallback(async () => {
    if (!user) return;
    
    try {
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
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserSkills();
    }
  }, [user, fetchUserSkills]);

  // Real-time subscription for skill updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('skills-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'skills',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Skills updated:', payload);
          fetchUserSkills();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchUserSkills]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserSkills();
    toast.success('Skills refreshed');
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;
      setSkills(skills.filter(s => s.id !== skillId));
      toast.success('Skill removed');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to remove skill');
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
    if (level >= 9) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (level >= 7) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    if (level >= 5) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
    if (level >= 3) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
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
              Showcase your technical expertise
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={() => navigate('/add-skill')} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {skills.length === 0 ? (
          <div className="text-center py-8">
            <Code className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No skills added yet</h3>
            <p className="text-muted-foreground mb-4">
              Add skills to boost your ranking
            </p>
            <Button onClick={() => navigate('/add-skill')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Skill
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {skills.slice(0, 5).map((skill) => (
              <div key={skill.id} className="p-3 border rounded-lg hover:shadow-sm transition-shadow group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{skill.name}</h4>
                    {skill.is_verified && (
                      <Badge variant="default" className="bg-green-500 text-white text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getSkillLevelColor(skill.level)}
                    >
                      {getSkillLevelLabel(skill.level)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteSkill(skill.id)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Level</span>
                      <span className="font-medium">{skill.level}/10</span>
                    </div>
                    <Progress value={skill.level * 10} className="h-1.5" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{skill.experience_years} years exp</span>
                    {!skill.is_verified && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-xs h-auto p-0"
                        onClick={() => navigate('/skills')}
                      >
                        Verify Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {skills.length > 5 && (
              <Button 
                variant="ghost" 
                className="w-full text-sm"
                onClick={() => navigate('/edit-profile')}
              >
                View all {skills.length} skills
              </Button>
            )}

            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm mb-1">Boost Your Ranking</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Add more skills or verify existing ones
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => navigate('/add-skill')}
                    >
                      Add Skills
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => navigate('/skills')}
                    >
                      Take Test
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