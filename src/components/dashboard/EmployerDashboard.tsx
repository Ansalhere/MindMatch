
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, Users, Briefcase, Building, Award, Eye, CheckCircle, XCircle } from 'lucide-react';
import StatCard from './StatCard';
import ApplicationsList from './ApplicationsList';
import JobsList from './JobsList';
import JobManagement from '../employer/JobManagement';
import EnhancedApplicationManager from '../employer/EnhancedApplicationManager';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus } from '@/lib/supabase';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { useDailyLogin } from '@/hooks/useDailyLogin';

interface EmployerDashboardProps {
  userData: any;
  realJobs?: any[];
  loadingJobs?: boolean;
  currentSubscription?: any;
}

const EmployerDashboard = ({ userData, realJobs = [], loadingJobs = false, currentSubscription }: EmployerDashboardProps) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { loginResult } = useDailyLogin(); // Track daily login
  const [managedJobs, setManagedJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchEmployerData();
    }
  }, [user]);

  const fetchEmployerData = async () => {
    if (!user) return;
    
    try {
      setLoadingData(true);
      
      // Fetch jobs with application counts
      const { data: jobsData, error: jobsError } = await supabase
        .rpc('get_employer_jobs_with_applications', { employer_id: user.id });

      if (jobsError) throw jobsError;

      // Fetch applications for those jobs
      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select(`
          *,
          candidate:users!applications_candidate_id_fkey(*)
        `)
        .in('job_id', jobsData?.map((job: any) => job.id) || []);

      if (appsError) throw appsError;

      const formattedJobs = jobsData?.map((job: any) => ({
        ...job,
        _count: { applications: job.application_count }
      })) || [];

      setManagedJobs(formattedJobs);
      setApplications(appsData || []);
    } catch (error) {
      console.error('Error fetching employer data:', error);
    } finally {
      setLoadingData(false);
    }
  };
  
  const jobsToDisplay = realJobs.length > 0 ? realJobs : userData.jobs;
  
  const totalApplications = realJobs.reduce((total: number, job: any) => {
    return total + (job.applications ? job.applications.length : 0);
  }, 0);

  const handleJobClick = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  const handleViewCandidateDetails = (candidateId: string) => {
    navigate(`/profile/${candidateId}/candidate`);
  };

  const handleUpdateApplicationStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      const { application, error } = await updateApplicationStatus(applicationId, status);
      
      if (error) throw error;
      
      toast.success(`Application ${status === 'accepted' ? 'accepted' : 'rejected'} successfully`);
      
      // In a real app, we would refresh the data here
      // For now, let's just show a success message
    } catch (error: any) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };
  
  // Get applications from all jobs
  const allApplications = realJobs.flatMap(job => 
    job.applications?.map((app: any) => ({
      ...app,
      jobTitle: job.title,
      jobId: job.id
    })) || []
  );
  
  return (
    <>
      {userData && (currentSubscription ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2 text-primary" />
              Current Package
            </CardTitle>
            <CardDescription>Your active subscription details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <Badge variant="secondary">{currentSubscription.package?.name || 'Custom Plan'}</Badge>
              <span className="text-sm text-muted-foreground">
                Status: <strong>{currentSubscription.payment_status || 'paid'}</strong>
              </span>
              {currentSubscription.expires_at && (
                <span className="text-sm text-muted-foreground">
                  Expires: {new Date(currentSubscription.expires_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2 text-primary" />
              No Active Package
            </CardTitle>
            <CardDescription>Select a plan to unlock more features</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/packages')}>View Plans</Button>
          </CardContent>
        </Card>
      ))}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Active Job Posts" 
          value={jobsToDisplay.length}
          buttonText="Post New Job"
          onButtonClick={() => navigate('/post-job')}
        />
        
        <StatCard 
          title="Total Applications" 
          value={realJobs.length > 0 ? totalApplications : userData.jobs.reduce((total: number, job: any) => total + job.applicants, 0)}
          secondaryText={`${allApplications.filter((app: any) => app.status === 'pending').length} pending`}
          icon={<ChevronUp className="h-4 w-4 mr-1" />}
          bgColor="bg-emerald-50"
        />
        
        <StatCard 
          title="Company Rating" 
          value={`${userData.rating?.overall || "4.2"}/5`}
          secondaryText="Top Employer"
          icon={<Award className="h-4 w-4 mr-1" />}
          bgColor="bg-orange-50"
          progress={(userData.rating?.overall || 4.2) * 20}
        />
      </div>
      
      <div className="space-y-6">
        <JobManagement 
          jobs={managedJobs}
          onUpdate={fetchEmployerData}
        />
        
        <EnhancedApplicationManager 
          applications={applications}
          onStatusUpdate={fetchEmployerData}
        />
      </div>
    </>
  );
};

export default EmployerDashboard;
