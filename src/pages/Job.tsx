import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { getJobById, applyForJob } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import Layout from '@/components/Layout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Users,
  Star,
  Building2,
  Eye,
  CheckCircle,
  XCircle,
  Send,
  Calendar
} from 'lucide-react';

const Job = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [candidateNote, setCandidateNote] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const { job: jobData, error } = await getJobById(id!);
      
      if (error) throw error;
      
      setJob(jobData);
      
      // Check if user has already applied
      if (user && jobData?.applications) {
        const userApplication = jobData.applications.find((app: any) => app.candidate_id === user.id);
        setHasApplied(!!userApplication);
      }
    } catch (error: any) {
      console.error('Error fetching job:', error);
      toast.error("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to apply for jobs");
      navigate('/auth');
      return;
    }

    if (user.user_type !== 'candidate') {
      toast.error("Only candidates can apply for jobs");
      return;
    }

    try {
      setApplying(true);
      
      const applicationData = {
        job_id: job.id,
        candidate_id: user.id,
        candidate_note: candidateNote.trim() || null
      };

      const { application, error } = await applyForJob(applicationData);
      
      if (error) throw error;
      
      toast.success("Application submitted successfully!");
      setHasApplied(true);
      setCandidateNote('');
      
      // Refresh job data to show the new application
      fetchJob();
    } catch (error: any) {
      console.error('Error applying for job:', error);
      toast.error("Failed to submit application: " + error.message);
    } finally {
      setApplying(false);
    }
  };

  const isEmployer = user?.user_type === 'employer' && user?.id === job?.employer_id;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 flex justify-center items-center min-h-[60vh]">
          <Loader size={40} />
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/jobs')}>Browse Jobs</Button>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-lg font-bold">
                      {job.employer?.company?.substring(0, 2) || 'CO'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <Building2 className="h-4 w-4" />
                      <span>{job.employer?.company || job.employer?.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                    {job.job_type}
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Applications for employer */}
            {isEmployer && job.applications && job.applications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Applications ({job.applications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {job.applications.map((application: any) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">Candidate Application</h4>
                            <p className="text-sm text-muted-foreground">
                              Applied: {new Date(application.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={application.status === 'accepted' ? 'default' : application.status === 'rejected' ? 'destructive' : 'outline'}>
                            {application.status}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(`/profile/${application.candidate_id}/candidate`)}>
                            <Eye className="h-3 w-3 mr-1" />
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Application Panel */}
          <div className="space-y-6">
            {!isEmployer && (
              <Card>
                <CardHeader>
                  <CardTitle>Apply for this Position</CardTitle>
                  <CardDescription>
                    {hasApplied ? "You have already applied for this position" : "Submit your application"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!hasApplied ? (
                    <>
                      <div>
                        <Label htmlFor="note">Cover Letter / Note (Optional)</Label>
                        <Textarea
                          id="note"
                          value={candidateNote}
                          onChange={(e) => setCandidateNote(e.target.value)}
                          placeholder="Tell the employer why you're interested in this position..."
                          rows={4}
                          className="mt-1"
                        />
                      </div>
                      
                      <Button 
                        onClick={handleApply}
                        disabled={applying}
                        className="w-full"
                        size="lg"
                      >
                        {applying ? (
                          <Loader className="h-4 w-4 mr-2" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <p className="text-lg font-medium">Application Submitted</p>
                      <p className="text-sm text-muted-foreground">
                        Your application is under review
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Job Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Job Type</span>
                  <Badge variant="outline">{job.job_type}</Badge>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm font-medium">{job.location}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Applications</span>
                  <span className="text-sm font-medium">
                    {job.applications?.length || 0} received
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Job;