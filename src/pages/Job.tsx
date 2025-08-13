
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Building, 
  Loader2,
  Clock,
  Users,
  DollarSign,
  ArrowLeft
} from 'lucide-react';
import { toast } from "sonner";
import { getJobById, applyForJob } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import Layout from '@/components/Layout';
import CandidateRankDisplay from '@/components/ranking/CandidateRankDisplay';
import ContactEmployerButton from '@/components/messaging/ContactEmployerButton';
import { jobs as sampleJobs } from '@/data/sampleJobs';

const Job = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [isSampleJob, setIsSampleJob] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob(id);
    }
  }, [id]);

  const fetchJob = async (jobId: string) => {
    try {
      setLoading(true);
      const { job: fetchedJob, error } = await getJobById(jobId);
      
      if (!error && fetchedJob) {
        setJob(fetchedJob);
        // Check if user has already applied
        if (user && fetchedJob.applications) {
          const userApplication = fetchedJob.applications.find(
            (app: any) => app.candidate_id === user.id
          );
          setAlreadyApplied(!!userApplication);
        }
        setIsSampleJob(false);
        return;
      }
      
      // Fallback: try sample jobs
      const sample = (sampleJobs as any[]).find((j) => j.id === jobId);
      if (sample) {
        setJob({
          ...sample,
          employer: { company: sample.company },
          applications: []
        });
        setIsSampleJob(true);
        return;
      }
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Error fetching job:", error);
      // Final fallback to sample if possible
      const sample = (sampleJobs as any[]).find((j) => j.id === jobId);
      if (sample) {
        setJob({ ...sample, employer: { company: sample.company }, applications: [] });
        setIsSampleJob(true);
      } else {
        toast.error("Failed to load job details. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Prevent employers from applying to jobs
    if (user.user_type === 'employer') {
      toast.error("Employers cannot apply for jobs. Only candidates can apply.");
      return;
    }
    
    try {
      setApplying(true);
      
      const applicationData = {
        job_id: id,
        candidate_id: user.id,
        status: 'pending',
        candidate_note: 'I am interested in this position and believe my skills are a good match.'
      };
      
      const { error } = await applyForJob(applicationData);
      
      if (error) throw error;
      
      toast.success("Application submitted successfully!");
      setAlreadyApplied(true);
    } catch (error: any) {
      console.error("Error applying for job:", error);
      toast.error("Failed to apply: " + error.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
              <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/jobs')}>Browse All Jobs</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
    } else if (job.salary_min) {
      return `$${job.salary_min.toLocaleString()}+`;
    } else if (job.salary_max) {
      return `Up to $${job.salary_max.toLocaleString()}`;
    }
    return "Not disclosed";
  };

  const requiresRanking = job.min_rank_requirement && job.min_rank_requirement > 0;
  const userMeetsRankRequirement = user && user.rank_score >= (job.min_rank_requirement || 0);
  const showRankWarning = requiresRanking && user && !userMeetsRankRequirement;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/jobs')} 
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
          
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-1">{job.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground">
                    <Building className="h-4 w-4 mr-1" />
                    <span>
                      {job.employer?.company || job.employer?.name || 'Unknown Company'}
                    </span>
                  </div>
                </div>
                <Badge className="px-3 py-1">
                  {job.job_type || 'Full-time'}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{job.location || 'Remote'}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}</span>
                </div>
                {job.closing_date && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Closes on {new Date(job.closing_date).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>{formatSalary()}</span>
                </div>
              </div>
              
              {requiresRanking && (
                <div className={`p-3 rounded-md ${showRankWarning ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-center">
                    <Users className={`h-4 w-4 mr-2 ${showRankWarning ? 'text-amber-500' : 'text-blue-500'}`} />
                    <span className="font-medium">
                      {showRankWarning 
                        ? 'Rank Requirement Not Met' 
                        : 'Rank Requirement Met'}
                    </span>
                  </div>
                  <p className="text-sm mt-1">
                    This position requires a minimum rank score of <strong>{job.min_rank_requirement}</strong>.
                    {user ? (
                      showRankWarning
                        ? ` Your current rank (${user.rank_score}) doesn't meet this requirement, but you can still apply.`
                        : ` Your current rank (${user.rank_score}) meets this requirement!`
                    ) : ' Sign in to see if you meet this requirement.'}
                  </p>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                <div className="text-muted-foreground whitespace-pre-line">
                  {job.description}
                </div>
              </div>
              
              {job.required_skills && job.required_skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-4">
                {user?.user_type === 'employer' ? (
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm">As an employer, you can view job details but cannot apply for positions.</p>
                  </div>
                ) : alreadyApplied ? (
                  <Badge variant="outline" className="py-3 px-6 text-base">
                    Already Applied
                  </Badge>
                ) : isSampleJob ? (
                  <Badge variant="secondary" className="py-3 px-6 text-base">
                    Demo Job
                  </Badge>
                ) : (
                  <div className="flex gap-2">
                    <ContactEmployerButton
                      employerId={job.employer_id}
                      employerName={job.employer?.company || job.employer?.name || 'Employer'}
                      jobTitle={job.title}
                    />
                    <Button 
                      size="lg"
                      onClick={handleApply} 
                      disabled={applying}
                      className="flex-1"
                    >
                      {applying ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <Briefcase className="h-4 w-4 mr-2" />
                          Apply Now
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {user && user.user_type === 'candidate' && (
            <Card>
              <CardHeader>
                <CardTitle>Your Ranking</CardTitle>
                <CardDescription>
                  How you compare to other candidates for this role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CandidateRankDisplay 
                  rankScore={user.rank_score || 0} 
                  rankPosition={Math.floor(Math.random() * 1000) + 1} // This would come from actual data
                  totalCandidates={5000}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Job;
