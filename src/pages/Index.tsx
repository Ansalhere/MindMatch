
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import RankingShowcase from '@/components/RankingShowcase';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Building, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getJobs } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';

const Index = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchJobs();
  }, []);
  
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { jobs, error } = await getJobs();
      
      if (error) {
        console.error("Error fetching jobs:", error);
        return;
      }
      
      // Get featured jobs (first 3)
      setFeaturedJobs((jobs || []).slice(0, 3));
    } catch (error) {
      console.error("Error in fetchJobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Hero />
      
      {/* Featured Jobs Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Featured Jobs</h2>
            <p className="text-muted-foreground">Discover top opportunities available right now</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader size={32} />
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No job posts available right now</p>
              <Button onClick={() => navigate('/jobs')}>Browse All Jobs</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{job.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Building className="h-3 w-3 mr-1" />
                            <span>{job.employer?.company || job.employer?.name || 'Unknown Company'}</span>
                          </CardDescription>
                        </div>
                        <Badge>{job.job_type || 'Full-time'}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-muted-foreground text-sm mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{job.location || 'Remote'}</span>
                      </div>
                      
                      <p className="text-sm line-clamp-2 mb-4">
                        {job.description || 'No description provided.'}
                      </p>
                      
                      <Button 
                        className="w-full flex items-center justify-center gap-2" 
                        onClick={() => navigate(`/job/${job.id}`)}
                      >
                        <Briefcase className="h-4 w-4" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/jobs')}
                >
                  View All Jobs
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      
      <Features />
      <RankingShowcase />
      <HowItWorksSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
