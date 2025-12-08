import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Briefcase, X, SlidersHorizontal, Sparkles, TrendingUp } from 'lucide-react';
import Layout from '@/components/Layout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ColorfulJobCard from '@/components/jobs/ColorfulJobCard';
import SEOHead from '@/components/SEOHead';
import { jobs as sampleJobs } from '@/data/sampleJobs';
import { supabase } from '@/integrations/supabase/client';
import { globalCities } from '@/data/centralizedLocations';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal';

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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

  const activeFiltersCount = [
    searchTerm,
    locationFilter && locationFilter !== 'all' ? locationFilter : '',
    jobTypeFilter !== 'all' ? jobTypeFilter : ''
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setJobTypeFilter('all');
  };

  return (
    <>
      <SEOHead
        title="Latest Job Opportunities - RankMe.AI"
        description="Browse thousands of job opportunities from top companies. Find your perfect role with our AI-powered job matching."
        keywords="jobs, careers, employment, job search, hiring, tech jobs"
        canonical="/jobs"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-16 md:py-24">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
            
            <div className="container-responsive relative z-10">
              <ScrollReveal>
                <div className="text-center max-w-3xl mx-auto mb-10">
                  <Badge variant="secondary" className="mb-4 px-4 py-1.5">
                    <Sparkles className="h-3.5 w-3.5 mr-2" />
                    AI-Powered Job Matching
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                    Find Your{' '}
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                      Dream Job
                    </span>
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Discover opportunities that match your skills and ranking. Your next career move starts here.
                  </p>
                </div>
              </ScrollReveal>

              {/* Search Bar */}
              <ScrollReveal delay={0.1}>
                <Card className="p-4 md:p-6 shadow-xl border-primary/10 bg-background/80 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                      <Input
                        placeholder="Search jobs, companies, or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-14 text-lg bg-muted/50 border-0 focus-visible:ring-primary/50"
                      />
                      {searchTerm && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setSearchTerm('')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Filter Toggle for Mobile */}
                    <div className="flex items-center justify-between md:hidden">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                          Clear all
                        </Button>
                      )}
                    </div>

                    {/* Filters */}
                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${showFilters ? 'block' : 'hidden md:grid'}`}>
                      <Select value={locationFilter} onValueChange={setLocationFilter}>
                        <SelectTrigger className="h-11 bg-muted/50 border-0">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Location" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="all">All Locations</SelectItem>
                          {globalCities.slice(0, 80).map(city => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                        <SelectTrigger className="h-11 bg-muted/50 border-0">
                          <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Job Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="outline" 
                        onClick={clearAllFilters}
                        className="h-11 hidden md:flex"
                        disabled={activeFiltersCount === 0}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear Filters
                      </Button>
                    </div>

                    {/* Active Filters */}
                    {activeFiltersCount > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {searchTerm && (
                          <Badge variant="secondary" className="gap-1 pr-1">
                            Search: {searchTerm}
                            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => setSearchTerm('')}>
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        )}
                        {locationFilter && locationFilter !== 'all' && (
                          <Badge variant="secondary" className="gap-1 pr-1">
                            <MapPin className="h-3 w-3" /> {locationFilter}
                            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => setLocationFilter('')}>
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        )}
                        {jobTypeFilter !== 'all' && (
                          <Badge variant="secondary" className="gap-1 pr-1">
                            <Briefcase className="h-3 w-3" /> {jobTypeFilter}
                            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => setJobTypeFilter('all')}>
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </ScrollReveal>
            </div>
          </section>

          {/* Results Section */}
          <section className="section-padding pt-0">
            <div className="container-responsive">
              <ScrollReveal delay={0.2}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
                    </h2>
                    <p className="text-muted-foreground text-sm mt-1">
                      Sorted by most recent
                    </p>
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    Updated in real-time
                  </div>
                </div>
              </ScrollReveal>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-80 bg-muted animate-pulse rounded-2xl" />
                  ))}
                </div>
              ) : filteredJobs.length === 0 ? (
                <ScrollReveal>
                  <Card className="p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filters to find more opportunities
                    </p>
                    <Button onClick={clearAllFilters}>Clear all filters</Button>
                  </Card>
                </ScrollReveal>
              ) : (
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.05}>
                  {filteredJobs.map((job, index) => (
                    <StaggerItem key={job.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                      >
                        <ColorfulJobCard job={job} />
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default Jobs;
