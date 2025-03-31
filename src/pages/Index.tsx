
import { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import StatsSection from '../components/sections/StatsSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import CTASection from '../components/sections/CTASection';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import RankingShowcase from '../components/RankingShowcase';
import { getJobs } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Building, MapPin } from 'lucide-react';
import { Loader } from '@/components/ui/loader';

const Index = () => {
  const isVisible = useScrollAnimation();
  const location = useLocation();
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const rankingRef = useRef<HTMLDivElement>(null);
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  useEffect(() => {
    // Handle scroll to section when redirected from another page or when hash is present
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        const section = document.getElementById(location.state.scrollTo);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (location.hash) {
      // Also handle direct URL with hash
      const sectionId = location.hash.substring(1); // Remove the # character
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.state, location.hash]);

  // Fetch featured jobs
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoadingJobs(true);
        const { jobs, error } = await getJobs();
        if (error) throw error;
        
        // Take only the first 3 jobs
        setFeaturedJobs(jobs?.slice(0, 3) || []);
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2">Featured Job Opportunities</h2>
            <p className="text-center text-muted-foreground mb-8">Browse our latest job openings and find your next career move</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {loadingJobs ? (
                <div className="col-span-3 flex flex-col items-center py-10">
                  <Loader size={32} className="mb-2" />
                  <p>Loading opportunities...</p>
                </div>
              ) : featuredJobs.length === 0 ? (
                <div className="col-span-3 text-center py-10">
                  <p className="text-lg">No job listings currently available</p>
                  <Button asChild className="mt-4">
                    <Link to="/post-job">Post a Job</Link>
                  </Button>
                </div>
              ) : (
                featuredJobs.map((job) => (
                  <Card key={job.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{job.title}</h3>
                        <Badge variant="secondary">{job.job_type || 'Full-time'}</Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Building className="h-4 w-4 mr-1" />
                        <span>{job.employer?.company || job.employer?.name || 'Unknown Company'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{job.location || 'Remote'}</span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {job.description || 'No description provided.'}
                      </p>
                      
                      <Button asChild className="w-full">
                        <Link to={`/job/${job.id}`}>
                          <Briefcase className="h-4 w-4 mr-2" />
                          View Job
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            
            <div className="text-center">
              <Button asChild size="lg">
                <Link to="/jobs">View All Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div id="stats" ref={statsRef}>
          <StatsSection isVisible={isVisible.stats} />
        </div>
        <Features />
        <div id="ranking-system" ref={rankingRef}>
          <RankingShowcase isVisible={isVisible.ranking} />
        </div>
        <div id="how-it-works" ref={howItWorksRef}>
          <HowItWorksSection isVisible={isVisible.howItWorks} />
        </div>
        <div id="testimonials" ref={testimonialsRef}>
          <TestimonialsSection isVisible={isVisible.testimonials} />
        </div>
        <div id="cta" ref={ctaRef}>
          <CTASection isVisible={isVisible.cta} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
