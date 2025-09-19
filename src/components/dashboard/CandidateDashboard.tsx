
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import RecommendedJobs from './RecommendedJobs';
import SkillRanking from './SkillRanking';
import SkillsList from './SkillsList';
import ApplicationActions from '../candidate/ApplicationActions';
import { Award, ChevronUp, Trophy, TrendingUp, BarChart3, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CandidateRankDisplay from '@/components/ranking/CandidateRankDisplay';
import RankBreakdown from '@/components/profile/RankBreakdown';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

interface CandidateDashboardProps {
  userData: any;
}

const CandidateDashboard = ({ userData }: CandidateDashboardProps) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      setLoadingApplications(true);
      const { data, error } = await supabase
        .rpc('get_candidate_applications', { candidate_id: user.id });

      if (error) throw error;
      
      const formattedApplications = data?.map((app: any) => ({
        id: app.id,
        status: app.status,
        created_at: app.created_at,
        job: {
          id: app.job_id,
          title: app.job_title,
          company: app.job_company
        }
      })) || [];
      
      setApplications(formattedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleAddSkill = () => {
    navigate('/add-skill');
  };

  const viewRankingExplanation = () => {
    navigate('/ranking-explanation');
  };

  return (
    <>
      {/* Clean Ranking Overview */}
      <Card className="mb-6 border-primary/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Your Global Ranking
              </h2>
              <p className="text-muted-foreground">
                Rank #{userData.ranking.position} of {userData.ranking.total.toLocaleString()} candidates
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{Math.round(userData.ranking.overall)}</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={handleAddSkill}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Improve Ranking
            </Button>
            <Button size="sm" variant="outline" onClick={viewRankingExplanation}>
              How It Works
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clean Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">{userData.applications.length}</p>
              </div>
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Score</p>
                <p className="text-2xl font-bold">{Math.round(userData.ranking.overall)}</p>
              </div>
              <Award className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rank Position</p>
                <p className="text-2xl font-bold">#{userData.ranking.position}</p>
              </div>
              <Trophy className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RecommendedJobs userData={userData} />
          <ApplicationActions 
            applications={applications}
            onUpdate={fetchApplications}
          />
        </div>
        
        <div className="space-y-6">
          <SkillsList />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" className="w-full" onClick={handleAddSkill}>
                Add Skills
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={() => navigate('/skills')}>
                Take Assessment
              </Button>
              <Button size="sm" variant="outline" className="w-full" onClick={() => navigate('/ranking-explanation')}>
                View Ranking Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CandidateDashboard;
