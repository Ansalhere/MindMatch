import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SkillAssessment from '@/components/skills/SkillAssessment';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SkillAssessmentPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container-responsive section-padding">
        <Button 
          variant="outline" 
          onClick={() => navigate('/skills')} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assessments
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Skill Assessment</h1>
          <p className="text-muted-foreground mb-8">Complete the assessment to improve your ranking</p>
          
          <SkillAssessment 
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