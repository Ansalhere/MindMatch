
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddSkillForm from '@/components/profile/AddSkillForm';
import SkillAssessment from '@/components/skills/SkillAssessment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, Sparkles } from 'lucide-react';
import { toast } from "sonner";
import { addUserSkill, addUserCertification } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { useRankingCalculator } from '@/hooks/useRankingCalculator';

const AddSkill = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'assessment'>('assessment');
  const { user, refreshUser } = useUser();
  const { recalculateRanking, isCalculating, lastResult } = useRankingCalculator();

  const handleSubmit = async (formData: any) => {
    if (!user) {
      toast.error("You must be logged in to add skills");
      navigate('/auth');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (formData.type === 'skill') {
        // Map form data to skills table schema
        const skillData = {
          user_id: user.id,
          name: formData.skillName,
          level: getProficiencyLevel(formData.proficiency),
          experience_years: parseFloat(formData.experience),
          verification_source: formData.details ? `User provided: ${formData.details}` : null
        };
        
        await addUserSkill(skillData);
      } else if (formData.type === 'certification') {
        // Map form data to certifications table schema
        const certData = {
          user_id: user.id,
          name: formData.certName,
          issuer: formData.issuingOrg,
          issue_date: formData.issueDate,
          expiry_date: formData.expiration || null,
          credential_id: formData.credentialID || null,
          credential_url: formData.credentialURL || null
        };
        
        await addUserCertification(certData);
      }
      
      // Recalculate ranking after adding skill/certification
      const result = await recalculateRanking(user.id);
      
      if (result && result.improvement > 0) {
        toast.success(`Added successfully! Your ranking improved by +${result.improvement.toFixed(1)} points!`, {
          description: `New score: ${result.newScore.toFixed(1)}`,
          duration: 5000,
        });
      } else {
        toast.success("Added successfully!");
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding skill/certification:', error);
      toast.error("Failed to add. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert proficiency level to numeric value
  const getProficiencyLevel = (proficiency: string): number => {
    switch (proficiency) {
      case 'beginner': return 3;
      case 'intermediate': return 5;
      case 'advanced': return 8;
      case 'expert': return 10;
      default: return 1;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')} 
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-2">Add Skills & Certifications</h1>
        <p className="text-muted-foreground text-lg mb-4">
          Add your skills and certifications to improve your ranking and showcase your expertise
        </p>
        
        {/* Current Ranking Display */}
        {user && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-medium">Current Ranking Score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{(user.rank_score || 0).toFixed(1)}</span>
                <span className="text-muted-foreground">/100</span>
                {lastResult && lastResult.improvement > 0 && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    <Sparkles className="h-3 w-3 mr-1" />
                    +{lastResult.improvement.toFixed(1)}
                  </Badge>
                )}
              </div>
            </div>
            <Progress value={user.rank_score || 0} className="h-2 mt-3" />
          </div>
        )}
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'assessment' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('assessment')}
            className="px-8 py-2"
          >
            Take Assessment
          </Button>
          <Button
            variant={activeTab === 'manual' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('manual')}
            className="px-8 py-2"
          >
            Add Manually
          </Button>
        </div>
      </div>
      
      {activeTab === 'assessment' ? (
        <SkillAssessment onComplete={() => navigate('/dashboard')} />
      ) : (
        <AddSkillForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
};

export default AddSkill;
