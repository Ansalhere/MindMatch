
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import RankingExplanation from '@/components/ranking/RankingExplanation';
import Layout from '@/components/Layout';
import { useEffect } from 'react';

const RankingExplanationPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Ranking Explained | RankMe.AI';
    const meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (meta) meta.content = 'Simple guide to your ranking and how to improve. Full-time, part-time, contract, internship and remote jobs supported.';
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Ranking, Made Simple</h1>
          <p className="text-muted-foreground mb-8">Understand your score and how to improve it</p>
          
          <RankingExplanation />
        </div>
      </div>
    </Layout>
  );
};

export default RankingExplanationPage;
