
import { useNavigate } from 'react-router-dom';
import { ChevronUp, Users, Briefcase, Building, Award, Eye, CheckCircle, XCircle } from 'lucide-react';
import StatCard from './StatCard';
import ApplicationsList from './ApplicationsList';
import JobsList from './JobsList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus } from '@/lib/supabase';
import { toast } from 'sonner';

interface EmployerDashboardProps {
  userData: any;
  realJobs?: any[];
  loadingJobs?: boolean;
  currentSubscription?: any;
}

const EmployerDashboard = ({ userData, realJobs = [], loadingJobs = false, currentSubscription }: EmployerDashboardProps) => {
  const navigate = useNavigate();
  
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-primary" />
              Your Job Posts
            </CardTitle>
            <CardDescription>Manage your job openings and view applications</CardDescription>
          </CardHeader>
          <CardContent>
            <JobsList 
              jobs={jobsToDisplay}
              userData={userData}
              loading={loadingJobs}
              onJobClick={handleJobClick}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Recent Applications
                </CardTitle>
                <CardDescription>Latest candidate applications</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/profiles')}>
                Browse Candidates
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {allApplications.length > 0 ? (
              <div className="space-y-3">
                {allApplications.slice(0, 5).map((application: any) => (
                  <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{application.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(application.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          application.status === 'accepted' ? 'default' : 
                          application.status === 'rejected' ? 'destructive' : 
                          'outline'
                        }
                        className="text-xs"
                      >
                        {application.status}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewCandidateDetails(application.candidate_id)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {allApplications.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full">
                    View All Applications
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No applications yet</p>
                <Button onClick={() => navigate('/profiles')}>Browse Candidates</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EmployerDashboard;
