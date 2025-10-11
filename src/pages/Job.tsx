import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Building, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  Briefcase,
  ArrowLeft,
  Send,
  CheckCircle,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import EmployerJobView from '@/components/employer/EmployerJobView';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_min: number;
  salary_max: number;
  required_skills: string[];
  min_rank_requirement: number;
  closing_date: string;
  created_at: string;
  employer_id: string;
  company_name?: string;
  external_apply_url?: string;
  employer?: {
    name: string;
    company: string;
    industry: string;
    location: string;
  };
  applications?: Array<{
    id: string;
    status: string;
    candidate_id: string;
    created_at: string;
    candidate_note: string;
  }>;
}

const Job = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const shouldAutoApply = searchParams.get('apply') === 'true';
  const navigate = useNavigate();
  const { user } = useUser();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob();
      if (user) {
        checkIfApplied();
      }
    }
  }, [id, user]);

  const fetchJob = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:users!employer_id (
            name,
            company,
            industry,
            location
          ),
          applications:applications (
            id,
            status,
            candidate_id,
            created_at,
            candidate_note
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    if (!user || !id) return;
    
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', id)
        .eq('candidate_id', user.id)
        .single();

      if (data) {
        setHasApplied(true);
      }
    } catch (error) {
      // No application found, which is fine
    }
  };

  // Generate shareable URL with meta info for social media
  const getShareableUrl = () => {
    if (!job) return window.location.href;
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      title: job.title,
      desc: job.description.substring(0, 200)
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const copyShareLink = () => {
    const shareUrl = getShareableUrl();
    navigator.clipboard.writeText(shareUrl);
    toast.success("Shareable link copied! This link will show proper preview on WhatsApp and social media.");
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please log in to apply for jobs');
      navigate('/auth');
      return;
    }

    if (user.user_type !== 'candidate') {
      toast.error('Only candidates can apply for jobs');
      return;
    }

    setApplying(true);

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: id,
          candidate_id: user.id,
          candidate_note: coverLetter,
          status: 'pending'
        });

      if (error) throw error;

      setHasApplied(true);
      setCoverLetter('');
      toast.success('Application submitted successfully!');
    } catch (error: any) {
      console.error('Error applying for job:', error);
      toast.error(error.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (min: number, max: number) => {
    if (!min && !max) return 'Not disclosed';
    
    const formatAmount = (amount: number) => {
      if (amount >= 100000) {
        return `${(amount / 100000).toFixed(0)}L`;
      }
      return `${(amount / 1000).toFixed(0)}K`;
    };
    
    if (min && max) {
      return `₹${formatAmount(min)} - ${formatAmount(max)} per year`;
    }
    return min ? `₹${formatAmount(min)}+ per year` : `Up to ₹${formatAmount(max)} per year`;
  };

  const getPostedDate = () => {
    if (!job) return '';
    const date = new Date(job.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Posted today';
    if (diffDays === 2) return 'Posted yesterday';
    if (diffDays <= 7) return `Posted ${diffDays} days ago`;
    if (diffDays <= 30) return `Posted ${Math.ceil(diffDays / 7)} weeks ago`;
    return `Posted ${Math.ceil(diffDays / 30)} months ago`;
  };

  const companyName = job?.company_name || job?.employer?.company || job?.employer?.name || 'Company';
  
  const getCompanyInitials = (companyName: string) => {
    if (!companyName) return 'CO';
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
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

  if (!job) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Job not found</h3>
            <p className="text-muted-foreground mb-4">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Check if current user is the employer who posted this job
  const isEmployer = user && user.id === job.employer_id;

  return (
    <Layout>
      <SEOHead
        title={`${job.title} at ${companyName} | FresherPools`}
        description={job.description.substring(0, 160)}
        canonical={`/job/${job.id}`}
        type="article"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": job.title,
          "description": job.description,
          "datePosted": job.created_at,
          "validThrough": job.closing_date,
          "employmentType": job.job_type,
          "hiringOrganization": {
            "@type": "Organization",
            "name": companyName
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": job.location
            }
          },
          "baseSalary": job.salary_min && job.salary_max ? {
            "@type": "MonetaryAmount",
            "currency": "INR",
            "value": {
              "@type": "QuantitativeValue",
              "minValue": job.salary_min,
              "maxValue": job.salary_max,
              "unitText": "YEAR"
            }
          } : undefined
        }}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button and Share Link */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" asChild>
            <Link to="/jobs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
          <Button onClick={copyShareLink} variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Copy Share Link
          </Button>
        </div>

        {isEmployer ? (
          // Employer view - show applications and candidate suggestions
          <div className="space-y-8">
            {/* Job Header for Employer */}
            <Card>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                       {getCompanyInitials(job.company_name || job.employer?.company || job.employer?.name || 'Company')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <Badge variant="default" className="text-sm">Your Job Post</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-lg text-muted-foreground mb-3">
                      <Building className="h-5 w-5" />
                       {job.company_name || job.employer?.company || job.employer?.name}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {getPostedDate()}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {formatSalary(job.salary_min, job.salary_max)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="default">{job.job_type}</Badge>
                      {job.employer?.industry && (
                        <Badge variant="secondary">{job.employer.industry}</Badge>
                      )}
                      {job.min_rank_requirement && (
                        <Badge variant="outline">
                          <Star className="h-3 w-3 mr-1" />
                          Rank {job.min_rank_requirement}+ required
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Employer Job Management */}
            <EmployerJobView job={job} applications={job.applications || []} />
          </div>
        ) : (
          // Candidate view - show job details and application form
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                        {getCompanyInitials(job.company_name || job.employer?.company || job.employer?.name || 'Company')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <div className="flex items-center gap-2 text-lg text-muted-foreground mb-3">
                        <Building className="h-5 w-5" />
                         {job.company_name || job.employer?.company || job.employer?.name}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {getPostedDate()}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {formatSalary(job.salary_min, job.salary_max)}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="default">{job.job_type}</Badge>
                        {job.employer?.industry && (
                          <Badge variant="secondary">{job.employer.industry}</Badge>
                        )}
                        {job.min_rank_requirement && (
                          <Badge variant="outline">
                            <Star className="h-3 w-3 mr-1" />
                            Rank {job.min_rank_requirement}+ required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Required Skills */}
              {job.required_skills && job.required_skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Card */}
              {!showApplyForm ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      {job?.external_apply_url ? (
                        <Button 
                          asChild
                          size="lg"
                          className="w-full"
                        >
                          <a href={job.external_apply_url} target="_blank" rel="noopener noreferrer">
                            <Send className="h-5 w-5 mr-2" />
                            Apply on Company Website
                          </a>
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => setShowApplyForm(true)}
                          size="lg"
                          className="w-full"
                        >
                          <Send className="h-5 w-5 mr-2" />
                          Apply for this Job
                        </Button>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {job?.external_apply_url 
                          ? 'You will be redirected to the company\'s application page'
                          : 'Click to view application form'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {hasApplied ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                          Application Submitted
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Apply for this Job
                        </>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {hasApplied ? (
                      <div className="text-center py-4">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          You have already applied for this position. The employer will contact you if you're selected.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Cover Letter (Optional)</label>
                          <Textarea
                            placeholder="Tell the employer why you're interested in this position..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={4}
                          />
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            onClick={() => setShowApplyForm(false)}
                            className="w-full"
                          >
                            View Details
                          </Button>
                          <Button 
                            onClick={handleApply} 
                            disabled={applying}
                            className="w-full"
                          >
                            {applying ? 'Submitting...' : 'Apply Now'}
                          </Button>
                        </div>
                        
                        {!user && (
                          <p className="text-xs text-muted-foreground text-center">
                            You need to <Link to="/auth" className="text-primary hover:underline">log in</Link> to apply for jobs
                          </p>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About the Company</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Company</span>
                    <span className="text-sm font-medium">{job.employer?.company || job.employer?.name}</span>
                  </div>
                  
                  <Separator />
                  
                  {job.employer?.industry && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Industry</span>
                        <span className="text-sm font-medium">{job.employer.industry}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  
                  {job.employer?.location && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Location</span>
                        <span className="text-sm font-medium">{job.employer.location}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  
                  {job.closing_date && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Application Deadline</span>
                      <span className="text-sm font-medium">
                        {new Date(job.closing_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Job;