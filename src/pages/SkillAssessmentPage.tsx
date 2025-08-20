import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import BackNavigation from '@/components/navigation/BackNavigation';
import SkillAssessment from '@/components/skills/SkillAssessment';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SkillAssessmentPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container-responsive section-padding">
        <BackNavigation customBack="/skills" />
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Skill Assessment</h1>
          <p className="text-muted-foreground mb-6">Complete the assessment to improve your ranking</p>
          
        <SkillAssessment 
          category={category}
          onComplete={() => {
            navigate('/dashboard');
          }} 
        />
        </div>
      </div>
    </Layout>
  );
};

export default SkillAssessmentPage;