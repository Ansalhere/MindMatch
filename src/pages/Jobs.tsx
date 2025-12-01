import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Briefcase, DollarSign, Clock } from 'lucide-react';
import Layout from '@/components/Layout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorfulJobCard from '@/components/jobs/ColorfulJobCard';
import SEOHead from '@/components/SEOHead';
import { jobs as sampleJobs } from '@/data/sampleJobs';
import { supabase } from '@/integrations/supabase/client';
import { globalCities } from '@/data/centralizedLocations';

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data: supabaseJobs, error } = await supabase
          .from('jobs')
          .select(`
            *,
            employer:users!employer_id (
              name,
              company,
              industry
            )
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error || !supabaseJobs?.length) {
          setJobs(sampleJobs);
        } else {
          // Transform jobs to include company name from employer
          const jobsWithCompany = supabaseJobs.map(job => ({
            ...job,
            company: job.employer?.company || job.employer?.name || 'Company'
          }));
          setJobs(jobsWithCompany);
        }
      } catch (error) {
        setJobs(sampleJobs);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !locationFilter || locationFilter === 'all' || 
        job.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      const matchesJobType = !jobTypeFilter || jobTypeFilter === 'all' || 
        job.job_type.toLowerCase() === jobTypeFilter.toLowerCase();

      return matchesSearch && matchesLocation && matchesJobType;
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, locationFilter, jobTypeFilter]);

  return (
    <>
      <SEOHead
        title="Latest Job Opportunities - RankMe.AI"
        description="Browse thousands of job opportunities from top companies. Find your perfect role with our AI-powered job matching."
        keywords="jobs, careers, employment, job search, hiring, tech jobs"
        canonical="/jobs"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
          <section className="section-padding">
            <div className="container-responsive">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                  Discover Your Next Opportunity
                </h1>
                <p className="text-xl text-muted-foreground">
                  Find jobs that match your skills and ranking
                </p>
              </div>

              <Card className="p-6 mb-8">
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search jobs, companies, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <SelectItem value="all">All Locations</SelectItem>
                        {globalCities.slice(0, 80).map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('');
                        setLocationFilter('');
                        setJobTypeFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs.map((job) => (
                    <ColorfulJobCard key={job.id} job={job} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default Jobs;