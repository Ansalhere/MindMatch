
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
}

const EmployerDashboard = ({ userData, realJobs = [], loadingJobs = false }: EmployerDashboardProps) => {
  const navigate = useNavigate();
  
  const jobsToDisplay = realJobs.length > 0 ? realJobs : userData.jobs;
  
  const totalApplications = realJobs.reduce((total: number, job: any) => {
    return total + (job.applications ? job.applications.length : 0);
  }, 0);

  const handleViewCandidateDetails = (candidateId: string) => {
    navigate(`/candidate/${candidateId}`);
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Candidate Applications
                  </CardTitle>
                  <CardDescription>Review and manage applications</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>{userData.size || 'SME'}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {allApplications.length > 0 ? (
                <div className="space-y-4">
                  {allApplications.map((application: any) => (
                    <div key={application.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">Application for: {application.jobTitle}</h3>
                          <p className="text-sm text-muted-foreground">
                            Application date: {new Date(application.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            application.status === 'accepted' ? 'success' : 
                            application.status === 'rejected' ? 'destructive' : 
                            'outline'
                          }
                        >
                          {application.status === 'accepted' ? 'Accepted' : 
                           application.status === 'rejected' ? 'Rejected' : 
                           'Pending'}
                        </Badge>
                      </div>
                      
                      {application.candidate_note && (
                        <div className="bg-muted/30 p-3 rounded-md text-sm mb-3">
                          <p className="italic">{application.candidate_note}</p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center"
                          onClick={() => handleViewCandidateDetails(application.candidate_id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Profile
                        </Button>
                        
                        {application.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="default"
                              className="flex items-center"
                              onClick={() => handleUpdateApplicationStatus(application.id, 'accepted')}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accept
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="flex items-center"
                              onClick={() => handleUpdateApplicationStatus(application.id, 'rejected')}
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No applications yet</p>
                  <Button onClick={() => navigate('/profiles')}>Browse Candidate Profiles</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Your Job Posts
              </CardTitle>
              <CardDescription>Latest job openings</CardDescription>
            </CardHeader>
            <CardContent>
              <JobsList 
                jobs={jobsToDisplay}
                userData={userData}
                loading={loadingJobs}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;
