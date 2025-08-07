
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddSkillForm from '@/components/profile/AddSkillForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { addUserSkill, addUserCertification } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';

const AddSkill = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        onClick={() => navigate(-1)} 
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Add New Skill or Certification</h1>
        <p className="text-muted-foreground mb-8">
          Improve your ranking by adding new skills, certifications, or experience
        </p>
        
        <AddSkillForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default AddSkill;
