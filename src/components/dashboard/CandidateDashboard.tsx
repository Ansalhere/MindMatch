
import { useNavigate } from 'react-router-dom';
import StatCard from './StatCard';
import RecommendedJobs from './RecommendedJobs';
import SkillRanking from './SkillRanking';
import { Award, ChevronUp, Trophy } from 'lucide-react';

interface CandidateDashboardProps {
  userData: any;
}

const CandidateDashboard = ({ userData }: CandidateDashboardProps) => {
  const navigate = useNavigate();

  const handleAddSkill = () => {
    navigate('/add-skill');
  };

  return (
    <>
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
          title="Skill Strength" 
          value={`${userData.ranking.overall}/100`}
          secondaryText={`Top ${Math.round((userData.ranking.position / userData.ranking.total) * 100)}%`}
          icon={<Award className="h-4 w-4 mr-1" />}
          bgColor="bg-orange-50"
          progress={userData.ranking.overall}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecommendedJobs userData={userData} />
        </div>
        
        <div>
          <SkillRanking userData={userData} />
        </div>
      </div>
    </>
  );
};

export default CandidateDashboard;
