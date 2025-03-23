
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RankingExplanation } from '@/components/ranking/RankingExplanation';

const RankingExplanationPage = () => {
  const navigate = useNavigate();

  return (
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
        <h1 className="text-3xl font-bold mb-2">Understanding Your Ranking</h1>
        <p className="text-muted-foreground mb-8">
          Learn how our ranking system works and how to improve your position
        </p>
        
        <RankingExplanation />
      </div>
    </div>
  );
};

export default RankingExplanationPage;
