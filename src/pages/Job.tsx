
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Briefcase, Building, MapPin, Clock, Calendar, DollarSign, Trophy, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { applyForJob } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { jobs as sampleJobs } from '../data/sampleJobs';

const Job = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      
      // In a real scenario, fetch from API 
      // For now, we'll use the sample data
      setTimeout(() => {
        const foundJob = sampleJobs.find(j => j.id === id) || {
          id,
          title: "Software Developer",
          company: "TechCorp",
          location: "San Francisco, CA",
          job_type: "Full-time",
          description: "We are looking for a skilled software developer to join our team...",
          required_skills: ["JavaScript", "React", "Node.js"],
          salary_min: 90000,
          salary_max: 120000,
          posted_date: "2023-10-01",
          closing_date: "2023-11-01"
        };
        
        setJob(foundJob);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching job:", error);
      toast.error("Failed to load job details");
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setApplying(true);
      
      const applicationData = {
        job_id: id,
        candidate_id: user.id,
        status: 'pending',
        candidate_note: note || 'Interested in this position'
      };
      
      const { application, error } = await applyForJob(applicationData);
      
      if (error) throw error;
      
      toast.success("Application submitted successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Error applying for job:", error);
      toast.error("Failed to apply: " + error.message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Jobs
        </Button>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading job details...</p>
          </div>
        ) : job ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{job.title}</CardTitle>
                      <div className="flex items-center text-muted-foreground mt-1">
                        <Building className="h-4 w-4 mr-1" />
                        <span>{job.employer?.company || job.company || 'Unknown Company'}</span>
                      </div>
                    </div>
                    <Badge>{job.job_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Posted {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'Recently'}</span>
                    </div>
                    {job.closing_date && (
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Closes {new Date(job.closing_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {(job.salary_min || job.salary_max) && (
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>
                          {job.salary_min && job.salary_max 
                            ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                            : job.salary_min 
                              ? `From $${job.salary_min.toLocaleString()}`
                              : `Up to $${job.salary_max.toLocaleString()}`
                          }
                        </span>
                      </div>
                    )}
                  </div>
                  
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
                  
                  {job.requirements && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                      <div className="text-muted-foreground whitespace-pre-line">
                        {job.requirements}
                      </div>
                    </div>
                  )}
                  
                  {job.benefits && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                      <div className="text-muted-foreground whitespace-pre-line">
                        {job.benefits}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Apply for this Position</CardTitle>
                  <CardDescription>Share why you're a good fit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.min_rank_requirement && (
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
                      <Trophy className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800">Rank Requirement</p>
                        <p className="text-sm text-amber-700">
                          This job requires a minimum rank score of {job.min_rank_requirement}.
                        </p>
                      </div>
                    </div>
                  )}
                
                  <div>
                    <label htmlFor="note" className="block text-sm font-medium mb-1">
                      Add a note (optional)
                    </label>
                    <Textarea
                      id="note"
                      placeholder="Why are you interested in this position?"
                      rows={5}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleApply} 
                    className="w-full" 
                    disabled={applying}
                  >
                    {applying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <Briefcase className="h-4 w-4 mr-2" />
                        Apply Now
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Your profile and skills will be shared with the employer.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>About the Company</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-secondary flex items-center justify-center rounded-full mr-3">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.employer?.company || job.company || 'Unknown Company'}</h3>
                      <p className="text-sm text-muted-foreground">{job.industry || 'Technology'}</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    View Company Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="mb-4">Job not found or has been removed.</p>
              <Button onClick={() => navigate('/jobs')}>Browse All Jobs</Button>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Job;
