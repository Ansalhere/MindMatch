
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Building, Clock, Search, Filter, Trophy, IndianRupee, TrendingUp, Briefcase, AlertTriangle, RefreshCw, CheckCircle, Info, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from "sonner";
import { getJobs, applyForJob, getUserApplications } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { Loader } from '@/components/ui/loader';
import Layout from '@/components/Layout';
import CandidateRankDisplay from '@/components/ranking/CandidateRankDisplay';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { jobs as sampleJobs } from '@/data/sampleJobs';
import { getJobLocationsFromData, globalCities } from '@/data/globalLocations';

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyingToJob, setApplyingToJob] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [userApplications, setUserApplications] = useState<any[]>([]);
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  const fetchUserApplications = async () => {
    if (!user) return;
    try {
      const { applications, error } = await getUserApplications(user.id);
      if (!error && applications) {
        setUserApplications(applications);
      }
    } catch (error) {
      console.error("Error fetching user applications:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching jobs...");
      
      const { jobs: fetchedJobs, error } = await getJobs();
      
      if (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to load jobs. Please check your connection and try again.");
        // Show sample jobs as fallback
        setJobs(sampleJobs as any[]);
        return;
      }
      
      console.log("Jobs fetched:", fetchedJobs?.length || 0);
      
      // Always combine real jobs with sample jobs for better user experience
      const allJobs = [];
      if (fetchedJobs && fetchedJobs.length > 0) {
        allJobs.push(...fetchedJobs);
      }
      // Add sample jobs if we have fewer than 5 real jobs
      if (allJobs.length < 5) {
        allJobs.push(...sampleJobs);
      }
      
      setJobs(allJobs);
    } catch (error) {
      console.error("Exception in fetchJobs:", error);
      setError("An unexpected error occurred. Please try again later.");
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
      // Refresh user applications to show updated status
      fetchUserApplications();
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
                         job.employer?.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || job.job_type?.toLowerCase().includes(filterType.toLowerCase());
    const matchesLocation = filterLocation === 'all' || 
                           job.location?.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const availableLocations = getJobLocationsFromData(jobs);
  const locations = availableLocations.length > 0 ? availableLocations : globalCities.slice(0, 20);

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Discover Your Next Career Opportunity
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with leading employers worldwide. Browse opportunities across all industries and experience levels.
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Main Content */}
          <div>
            {/* Search and Filter Section */}
            <Card className="mb-8 shadow-sm">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search jobs by title, company, skills, or keywords" 
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
                  <CardContent className="flex flex-col items-center py-10">
                    <Loader size={32} className="mx-auto mb-3" />
                    <p className="text-base font-medium">Loading jobs...</p>
                    <p className="text-muted-foreground">Please wait</p>
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
                    <p className="text-xl font-medium mb-2">No matching opportunities found</p>
                    <p className="text-muted-foreground mb-4">Try adjusting your search criteria or explore all available positions</p>
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
                      Showing {filteredJobs.length} of {jobs.length} opportunities
                    </p>
                    <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </Button>
                  </div>
                  
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                     {filteredJobs.map((job) => {
                       const hasApplied = userApplications.some(app => app.job_id === job.id);
                       return (
                       <Card key={job.id} className={`overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 ${
                         hasApplied 
                           ? 'border-l-green-500 bg-green-50/50' 
                           : 'border-l-primary/20 hover:border-l-primary'
                       }`}>
                         <CardContent className="p-0">
                           <div className="p-4">
                           <div className="flex flex-col justify-between mb-3">
                             <div className="flex-1">
                               <div className="flex items-center gap-2 mb-2">
                                 <h3 className="text-lg font-semibold hover:text-primary transition-colors cursor-pointer" 
                                     onClick={() => handleViewJob(job.id)}>
                                   {job.title}
                                 </h3>
                                 {hasApplied && (
                                   <Badge variant="default" className="bg-green-500 text-white">
                                     Applied
                                   </Badge>
                                 )}
                               </div>
                               <div className="flex items-center text-muted-foreground mb-2">
                                 <Building className="h-4 w-4 mr-2" />
                                 <span className="font-medium">{job.employer?.company || job.employer?.name || 'Great Company'}</span>
                               </div>
                             </div>
                             <Badge className="mt-2 md:mt-0 w-fit" variant="secondary">
                               {(job.job_type || 'Full-time').toString()}
                             </Badge>
                           </div>
                           
                           <div className="grid grid-cols-1 gap-2 mb-3">
                             <div className="flex items-center text-muted-foreground text-sm">
                               <MapPin className="h-3 w-3 mr-1 text-primary" />
                               <span>{job.location || 'Remote'}</span>
                             </div>
                             {(job.salary_min || job.salary_max) && (
                               <div className="flex items-center text-muted-foreground text-sm">
                                 <IndianRupee className="h-3 w-3 mr-1 text-primary" />
                                 <span>
                                   ₹{job.salary_min ? job.salary_min.toLocaleString() : ''}
                                   {job.salary_min && job.salary_max && ' - '}
                                   {job.salary_max ? `₹${job.salary_max.toLocaleString()}` : ''} /month
                                 </span>
                               </div>
                             )}
                           </div>
                           
                           <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                             {job.description?.substring(0, 120) || 'Exciting opportunity to join our dynamic team and make a real impact.'}
                             {job.description && job.description.length > 120 && '...'}
                           </p>
                           
                           <div className="flex flex-wrap gap-1 mb-3">
                             {job.required_skills && job.required_skills.length > 0 ? (
                               job.required_skills.slice(0, 3).map((skill: string, index: number) => (
                                 <Badge key={index} variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs">
                                   {skill}
                                 </Badge>
                               ))
                             ) : (
                               <Badge variant="outline" className="text-muted-foreground text-xs">
                                 Open to all skill levels
                               </Badge>
                             )}
                             {job.required_skills && job.required_skills.length > 3 && (
                               <Badge variant="outline" className="text-muted-foreground text-xs">
                                 +{job.required_skills.length - 3} more
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
                           
                           <div className="flex gap-2 pt-3 border-t">
                             <Button 
                               variant="outline"
                               onClick={() => handleViewJob(job.id)}
                               className="flex-1"
                               size="sm"
                             >
                               View
                             </Button>
                             
                             <Button 
                               onClick={() => handleApply(job.id)} 
                               disabled={applyingToJob === job.id || (user?.user_type === 'employer') || hasApplied}
                               className="flex-1"
                               size="sm"
                               variant={hasApplied ? 'outline' : 'default'}
                             >
                               {hasApplied ? (
                                 <>
                                   <CheckCircle className="h-3 w-3 mr-1" />
                                   Applied
                                 </>
                               ) : applyingToJob === job.id ? (
                                 <>
                                   <Loader2 className="h-3 w-3 mr-1 animate-spin" />
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
                       );
                     })}
                   </div>
                 </>
               )}
             </div>
           </div>
          
          {/* Sidebar */}
          <div>
            {user && user.user_type === 'candidate' ? (
              <Card className="sticky top-24 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                  <CardTitle className="text-xl">Career Profile</CardTitle>
                  <CardDescription>
                    Track your professional ranking and application progress
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
                    Already have an account? <button onClick={() => navigate('/auth')} className="text-primary hover:underline">Sign in</button>
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
