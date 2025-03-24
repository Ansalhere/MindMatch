
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Clock, Search, Filter, Building, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getJobs, applyForJob } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import { Loader } from '@/components/ui/loader';

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingToJob, setApplyingToJob] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log("Fetching jobs...");
      const { jobs: fetchedJobs, error } = await getJobs();
      
      if (error) {
        console.error("Error fetching jobs:", error);
        throw error;
      }
      
      console.log("Jobs fetched:", fetchedJobs);
      setJobs(fetchedJobs || []);
    } catch (error) {
      console.error("Error in fetchJobs:", error);
      toast.error("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter will happen client-side based on searchTerm, filterType, and filterLocation
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      navigate('/login');
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
      
      if (error) throw error;
      
      toast.success("Application submitted successfully!");
    } catch (error: any) {
      console.error("Error applying for job:", error);
      toast.error("Failed to apply: " + error.message);
    } finally {
      setApplyingToJob(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.employer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.employer?.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || job.job_type?.toLowerCase() === filterType;
    const matchesLocation = filterLocation === 'all' || job.location?.toLowerCase() === filterLocation;
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
  const locations = ['New York', 'San Francisco', 'London', 'Remote', 'Tokyo', 'Berlin', 'Sydney'];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Find Your Perfect Job</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through thousands of opportunities to find the perfect job for your skills and experience
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search by title, company, or keywords" 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
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
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location.toLowerCase()}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button type="submit" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <Loader size={32} className="mx-auto mb-2" />
              <p>Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center py-10">
                <p className="text-lg font-medium mb-2">No jobs found</p>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </CardContent>
            </Card>
          ) : (
            filteredJobs.map((job) => (
              <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <div className="flex items-center text-muted-foreground mt-1">
                          <Building className="h-4 w-4 mr-1" />
                          <span>{job.employer?.company || job.employer?.name || 'Unknown Company'}</span>
                        </div>
                      </div>
                      <Badge className="mt-2 md:mt-0 w-fit" variant="secondary">
                        {job.job_type || 'Full-time'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location || 'Remote'}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {job.description || 'No description provided.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.required_skills && job.required_skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                      {(!job.required_skills || job.required_skills.length === 0) && (
                        <Badge variant="outline">No specific skills required</Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => handleApply(job.id)} 
                        disabled={applyingToJob === job.id}
                      >
                        {applyingToJob === job.id ? (
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
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Jobs;
