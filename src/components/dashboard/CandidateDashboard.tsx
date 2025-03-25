
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import RecommendedJobs from './RecommendedJobs';
import SkillRanking from './SkillRanking';
import { Award, ChevronUp, Trophy, TrendingUp, BarChart3, Briefcase } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CandidateRankDisplay from '@/components/ranking/CandidateRankDisplay';

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
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-2 flex items-center">
              <Trophy className="h-5 w-5 text-amber-500 mr-2" />
              Your Career Ranking
            </h2>
            <p className="text-muted-foreground mb-4">
              Your ranking determines your visibility to top employers and eligibility for premium jobs
            </p>
            <div className="flex gap-4">
              <Button size="sm" variant="default" onClick={handleAddSkill}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Improve Ranking
              </Button>
              <Button size="sm" variant="outline" onClick={viewRankingExplanation}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Ranking Details
              </Button>
            </div>
          </div>
          <div className="w-full md:w-1/2 bg-white rounded-lg p-4 shadow-sm">
            <CandidateRankDisplay 
              rankScore={userData.ranking.overall}
              rankPosition={userData.ranking.position}
              totalCandidates={userData.ranking.total}
              showDetailedScore={true}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Profile Completion" 
          value="75%" 
          buttonText="Complete Profile"
          onButtonClick={() => navigate(`/profile/${userData.id}/candidate`)}
          progress={75}
        />
        
        <StatCard 
          title="Applications Sent" 
          value={userData.applications.length}
          secondaryText="3 this week"
          icon={<ChevronUp className="h-4 w-4 mr-1" />}
          bgColor="bg-emerald-50"
          progress={60}
        />
        
        <StatCard 
          title="Job Match Rate" 
          value={`${Math.round(userData.ranking.overall * 0.8)}%`}
          secondaryText="Based on your skills"
          icon={<Briefcase className="h-4 w-4 mr-1" />}
          bgColor="bg-blue-50"
          progress={Math.round(userData.ranking.overall * 0.8)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecommendedJobs userData={userData} />
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-amber-500" />
                Your Skills Ranking
              </CardTitle>
              <CardDescription>
                Skills ranked by market demand and your proficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SkillRanking userData={userData} />
              <Button 
                variant="outline" 
                className="w-full mt-4" 
                onClick={handleAddSkill}
              >
                Add New Skills
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CandidateDashboard;
