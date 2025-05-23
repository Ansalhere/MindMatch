
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import RankingShowcase from '@/components/RankingShowcase';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import StatsSection from '@/components/sections/StatsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import CTASection from '@/components/sections/CTASection';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Building, Clock, Users, Star, Award, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getJobs } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const navigate = useNavigate();
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isVisible = useScrollAnimation();
  
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
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Jobs</h2>
            <p className="text-muted-foreground">Discover top opportunities available right now on RankMe</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size={32} />
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-6">No job posts available right now</p>
              <Button onClick={() => navigate('/jobs')}>Browse All Jobs</Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-800">{job.title}</CardTitle>
                          <CardDescription className="flex items-center mt-2">
                            <Building className="h-4 w-4 mr-1" />
                            <span>{job.employer?.company || job.employer?.name || 'Unknown Company'}</span>
                          </CardDescription>
                        </div>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                          {job.job_type || 'Full-time'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location || 'Remote'}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'Recently'}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm line-clamp-2 mb-4">
                        {job.description || 'No description provided.'}
                      </p>
                      
                      {job.required_skills && job.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {job.required_skills.slice(0, 3).map((skill: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-slate-50">{skill}</Badge>
                          ))}
                          {job.required_skills.length > 3 && (
                            <Badge variant="outline" className="bg-slate-50">+{job.required_skills.length - 3} more</Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="border-t bg-slate-50/50 pt-4">
                      <Button 
                        className="w-full flex items-center justify-center gap-2" 
                        onClick={() => navigate(`/job/${job.id}`)}
                      >
                        <Briefcase className="h-4 w-4" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/jobs')}
                  className="hover:bg-primary hover:text-white transition-colors"
                >
                  View All Jobs
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
      
      <Features />
      
      <div className="bg-white">
        <RankingShowcase isVisible={isVisible.ranking} />
      </div>
      
      <HowItWorksSection isVisible={isVisible.howItWorks} />
      <StatsSection isVisible={isVisible.stats} />
      <TestimonialsSection isVisible={isVisible.testimonials} />
      <CTASection isVisible={isVisible.cta} />
    </Layout>
  );
};

export default Index;
