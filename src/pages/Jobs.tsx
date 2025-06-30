
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, Search, Filter, Building, Loader2, Trophy, Info, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { getJobs, applyForJob } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { Loader } from '@/components/ui/loader';
import Layout from '@/components/Layout';
import CandidateRankDisplay from '@/components/ranking/CandidateRankDisplay';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingToJob, setApplyingToJob] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching jobs...");
      
      const { jobs: fetchedJobs, error } = await getJobs();
      
      if (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to load jobs. Please check your connection and try again.");
        toast.error("Failed to load jobs");
        return;
      }
      
      console.log("Jobs fetched:", fetchedJobs?.length || 0);
      
      if (!fetchedJobs || fetchedJobs.length === 0) {
        console.log("No jobs returned from API");
        setError("No jobs available at the moment. Please check back later.");
      }
      
      setJobs(fetchedJobs || []);
    } catch (error) {
      console.error("Exception in fetchJobs:", error);
      setError("An unexpected error occurred. Please try again later.");
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchJobs();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter will happen client-side based on searchTerm, filterType, and filterLocation
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      toast.error("Please log in to apply for jobs");
      navigate('/login', { state: { returnUrl: `/jobs` } });
      return;
    }
    
    if (user.user_type !== 'candidate') {
      toast.error("Only candidates can apply for jobs. Please log in as a candidate.");
      return;
    }
    
    try {
      setApplyingToJob(jobId);
      
      const applicationData = {
        job_id: jobId,
        candidate_id: user.id,
        status: 'pending',
        candidate_note: 'Interested in this position'
      };
      
      const { application, error } = await applyForJob(applicationData);
      
      if (error) {
        if (error.message.includes('duplicate key')) {
          toast.error("You have already applied for this job");
        } else {
          throw error;
        }
        return;
      }
      
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Error applying for job:", error);
      toast.error("Failed to apply: " + (error.message || "Please try again"));
    } finally {
      setApplyingToJob(null);
    }
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.employer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.employer?.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || job.job_type?.toLowerCase() === filterType.toLowerCase();
    const matchesLocation = filterLocation === 'all' || job.location?.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const locations = ['New York', 'San Francisco', 'London', 'Remote', 'Tokyo', 'Berlin', 'Sydney'];

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Find Your Perfect Job
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Browse through opportunities to find the perfect job for your skills and experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Search and Filter Section */}
            <Card className="mb-8 shadow-sm">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search by title, company, or keywords" 
                      className="pl-10 h-12"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {jobTypes.map(type => (
                          <SelectItem key={type} value={type.toLowerCase()}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterLocation} onValueChange={setFilterLocation}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map(location => (
                          <SelectItem key={location} value={location.toLowerCase()}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button type="submit" className="gap-2 px-6">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            {/* Results Section */}
            <div className="space-y-6">
              {loading ? (
                <Card>
                  <CardContent className="flex flex-col items-center py-12">
                    <Loader size={32} className="mx-auto mb-4" />
                    <p className="text-lg font-medium">Loading amazing job opportunities...</p>
                    <p className="text-muted-foreground">This may take a moment</p>
                  </CardContent>
                </Card>
              ) : error ? (
                <Card>
                  <CardContent className="flex flex-col items-center py-12">
                    <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
                    <p className="text-xl font-medium mb-2">Oops! Something went wrong</p>
                    <p className="text-muted-foreground mb-6 text-center max-w-md">{error}</p>
                    <Button onClick={handleRefresh} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              ) : filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center py-12">
                    <Briefcase className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <p className="text-xl font-medium mb-2">No jobs found</p>
                    <p className="text-muted-foreground mb-4">Try adjusting your search criteria or check back later</p>
                    <Button variant="outline" onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                      setFilterLocation('all');
                    }}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">
                      Showing {filteredJobs.length} of {jobs.length} jobs
                    </p>
                    <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                  
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
                      <CardContent className="p-0">
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors cursor-pointer" 
                                  onClick={() => handleViewJob(job.id)}>
                                {job.title}
                              </h3>
                              <div className="flex items-center text-muted-foreground mb-2">
                                <Building className="h-4 w-4 mr-2" />
                                <span className="font-medium">{job.employer?.company || job.employer?.name || 'Great Company'}</span>
                              </div>
                            </div>
                            <Badge className="mt-2 md:mt-0 w-fit" variant="secondary">
                              {job.job_type || 'Full-time'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2 text-primary" />
                              <span>{job.location || 'Remote'}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2 text-primary" />
                              <span>Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}</span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-4 line-clamp-3">
                            {job.description || 'Exciting opportunity to join our dynamic team and make a real impact.'}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.required_skills && job.required_skills.length > 0 ? (
                              job.required_skills.map((skill: string, index: number) => (
                                <Badge key={index} variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                  {skill}
                                </Badge>
                              ))
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                Open to all skill levels
                              </Badge>
                            )}
                          </div>
                          
                          {job.min_rank_requirement > 0 && (
                            <div className="flex items-center mb-4">
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                Minimum Rank: {job.min_rank_requirement}
                              </Badge>
                              {user && user.rank_score < job.min_rank_requirement && (
                                <span className="ml-2 text-amber-600 text-xs">
                                  Your rank ({user.rank_score}) is below requirement
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center pt-4 border-t">
                            <Button 
                              variant="outline"
                              onClick={() => handleViewJob(job.id)}
                              className="flex-1 mr-3"
                            >
                              View Details
                            </Button>
                            
                            <Button 
                              onClick={() => handleApply(job.id)} 
                              disabled={applyingToJob === job.id || (user?.user_type === 'employer')}
                              className="flex-1"
                            >
                              {applyingToJob === job.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Applying...
                                </>
                              ) : (
                                <>
                                  <Briefcase className="h-4 w-4 mr-2" />
                                  {user?.user_type === 'employer' ? 'Employers Cannot Apply' : 'Apply Now'}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            {user && user.user_type === 'candidate' ? (
              <Card className="sticky top-24 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle className="text-xl">Your Profile</CardTitle>
                  <CardDescription>
                    Your current ranking and application stats
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <CandidateRankDisplay 
                    rankScore={user.rank_score || 0}
                    rankPosition={Math.floor((user.rank_score || 50) / 100 * 5000) + 1} 
                    totalCandidates={5000}
                    showDetailedScore={true}
                  />
                  
                  <div className="mt-6 space-y-4">
                    <h3 className="text-sm font-semibold">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-blue-600">{user.applications?.length || 0}</div>
                        <div className="text-xs text-blue-600">Applications</div>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-green-600">{filteredJobs.length}</div>
                        <div className="text-xs text-green-600">Available Jobs</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-2">
                      <Button variant="default" size="sm" className="w-full" onClick={() => navigate('/add-skill')}>
                        <Trophy className="h-4 w-4 mr-2" />
                        Improve Your Ranking
                      </Button>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/dashboard')}>
                        View Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle className="text-xl">Job Seeker?</CardTitle>
                  <CardDescription>
                    Join RankMe.AI to unlock your career potential
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Create a candidate account to access:
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0 rounded-full bg-primary text-white border-primary">1</Badge>
                      <span>One-click job applications</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0 rounded-full bg-primary text-white border-primary">2</Badge>
                      <span>AI-powered candidate ranking</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0 rounded-full bg-primary text-white border-primary">3</Badge>
                      <span>Application tracking dashboard</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Badge variant="outline" className="h-6 w-6 flex items-center justify-center p-0 rounded-full bg-primary text-white border-primary">4</Badge>
                      <span>Personalized job recommendations</span>
                    </li>
                  </ul>
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => navigate('/register')}
                    size="lg"
                  >
                    Get Started Free
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Already have an account? <button onClick={() => navigate('/login')} className="text-primary hover:underline">Sign in</button>
                  </p>
                </CardContent>
              </Card>
            )}
            
            {/* Additional Info Card */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">Pro Tip</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete your profile and add skills to improve your ranking and get better job matches.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Jobs;
