
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import RecommendedJobs from './RecommendedJobs';
import SkillRanking from './SkillRanking';
import SkillsList from './SkillsList';
import { Award, ChevronUp, Trophy, TrendingUp, BarChart3, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CandidateRankDisplay from '@/components/ranking/CandidateRankDisplay';
import RankBreakdown from '@/components/profile/RankBreakdown';

interface CandidateDashboardProps {
  userData: any;
}

const CandidateDashboard = ({ userData }: CandidateDashboardProps) => {
  const navigate = useNavigate();

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
          
          {/* Applied Jobs Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Your Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userData.applications && userData.applications.length > 0 ? (
                <div className="space-y-3">
                  {userData.applications.slice(0, 5).map((application: any) => (
                    <div key={application.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-sm">
                            {application.job?.title || 'Job Application'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {application.job?.employer?.company || 'Company Name'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          application.status === 'accepted' 
                            ? 'bg-green-100 text-green-700' 
                            : application.status === 'rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {userData.applications.length > 5 && (
                    <p className="text-xs text-muted-foreground text-center">
                      +{userData.applications.length - 5} more applications
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">No applications yet</p>
                  <Button size="sm" onClick={() => navigate('/jobs')}>Browse Jobs</Button>
                </div>
              )}
            </CardContent>
          </Card>
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
