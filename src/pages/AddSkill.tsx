
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddSkillForm from '@/components/profile/AddSkillForm';
import SkillAssessment from '@/components/skills/SkillAssessment';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { addUserSkill, addUserCertification } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';

const AddSkill = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'assessment'>('assessment');
  const { user } = useUser();

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
      
      toast.success("Added successfully!");
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
    <div className="container mx-auto px-6 py-12">
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')} 
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Add Skills & Certifications</h1>
        <p className="text-muted-foreground">
          Add your skills and certifications to improve your ranking
        </p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'assessment' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('assessment')}
            className="px-6"
          >
            Take Assessment
          </Button>
          <Button
            variant={activeTab === 'manual' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('manual')}
            className="px-6"
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
