
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostJobForm from '@/components/employer/PostJobForm';
import AIJobPostAssistant from '@/components/employer/AIJobPostAssistant';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { createJob } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import Layout from '@/components/Layout';

const PostJob = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const { user } = useUser();

  // Redirect if not logged in or not an employer
  if (user === null) {
    // If still loading, show loading state
    if (isSubmitting) {
      return (
        <Layout>
          <div className="container mx-auto px-6 py-12 text-center">
            <p>Loading...</p>
          </div>
        </Layout>
      );
    }
    
    toast.error("You must be logged in to post a job");
    navigate('/auth');
    return null;
  }

  if (user && user.user_type !== 'employer') {
    toast.error("Only employers can post jobs");
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting job data:", formData);
      
      // Transform form data to match the database schema
      const jobPostData = {
        title: formData.jobTitle,
        description: formData.description,
        job_type: formData.jobType,
        location: formData.location || 'Remote',
        required_skills: formData.requiredSkills || [],
        closing_date: formData.deadline,
        salary_min: formData.salary?.min ? parseInt(formData.salary.min) : null,
        salary_max: formData.salary?.max ? parseInt(formData.salary.max) : null,
        min_rank_requirement: formData.rankRestriction ? formData.minRank : null,
        min_experience: formData.minExperience || null,
        company_name: formData.companyName || null,
        external_apply_url: formData.externalApplyUrl || null
      };
      
      console.log("Formatted job data for DB:", jobPostData);
      
      const result = await createJob(jobPostData);
      
      if (result.error) throw result.error;
      
      toast.success("Job posted successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error posting job:', error);
      toast.error("Failed to post job: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAISuggestion = (suggestion: any) => {
    setFormData(suggestion);
  };

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
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Post a New Job on RankMe</h1>
          <p className="text-muted-foreground mb-8">
            Find the best ranked candidates by posting your job requirements. Use AI to generate professional job posts instantly.
          </p>
          
          <AIJobPostAssistant onSuggestion={handleAISuggestion} />
          
          <PostJobForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            initialData={formData}
          />
        </div>
      </div>
    </Layout>
  );
};

export default PostJob;
