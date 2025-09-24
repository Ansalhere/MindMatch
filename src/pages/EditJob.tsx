// Edit Job Page Component
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EditJobForm from '@/components/employer/EditJobForm';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import Layout from '@/components/Layout';

// EditJob Component - Allows editing of job postings
const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Redirect if not logged in or not an employer/admin
  if (user === null) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 text-center">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (user && user.user_type !== 'employer' && user.user_type !== 'admin') {
    toast.error("Only employers and admins can edit jobs");
    navigate('/dashboard');
    return null;
  }

  useEffect(() => {
    if (id && user) {
      fetchJobData();
    }
  }, [id, user]);

  const fetchJobData = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Check if user has permission to edit this job
      if (user?.user_type !== 'admin' && data.employer_id !== user?.id) {
        toast.error("You don't have permission to edit this job");
        navigate('/dashboard');
        return;
      }

      setJobData(data);
    } catch (error: any) {
      console.error('Error fetching job:', error);
      toast.error('Job not found or access denied');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      // Transform form data to match the database schema
      const updateData = {
        title: formData.jobTitle,
        description: formData.description,
        job_type: formData.jobType,
        location: formData.location,
        required_skills: formData.requiredSkills || [],
        closing_date: formData.deadline || null,
        salary_min: formData.salary?.min ? parseInt(formData.salary.min) : null,
        salary_max: formData.salary?.max ? parseInt(formData.salary.max) : null,
        min_rank_requirement: formData.rankRestriction ? formData.minRank : null,
        min_experience: formData.minExperience ? parseFloat(formData.minExperience) : null,
        company_name: formData.companyName || null,
        external_apply_url: formData.externalApplyUrl || null
      };
      
      const { error } = await supabase
        .from('jobs')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Job updated successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating job:', error);
      toast.error("Failed to update job: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading job details...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2">Edit Job Posting</h1>
          <p className="text-muted-foreground mb-8">
            Update your job requirements and details
          </p>
          
          <EditJobForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            initialData={jobData}
            isAdmin={user?.user_type === 'admin'}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EditJob;