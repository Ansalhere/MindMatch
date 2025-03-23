
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddSkillForm from '@/components/profile/AddSkillForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { addUserSkill } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';

const AddSkill = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (formData: any) => {
    if (!user) {
      toast.error("You must be logged in to add skills");
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const skillData = {
        ...formData,
        user_id: user.id
      };
      
      await addUserSkill(skillData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding skill:', error);
      toast.error("Failed to add skill. Please try again.");
    } finally {
      setIsSubmitting(false);
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
