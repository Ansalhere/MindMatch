import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ColorfulJobCard from '@/components/jobs/ColorfulJobCard';
import { jobs } from '@/data/sampleJobs';
import { supabase } from '@/integrations/supabase/client';

const FeaturedJobs = () => {
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Try to fetch from Supabase first
        const { data: supabaseJobs, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Error fetching jobs:', error);
          // Fallback to sample data
          setFeaturedJobs(jobs.slice(0, 6));
        } else if (supabaseJobs && supabaseJobs.length > 0) {
          setFeaturedJobs(supabaseJobs);
        } else {
          // Use sample data if no jobs in database
          setFeaturedJobs(jobs.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Fallback to sample data
        setFeaturedJobs(jobs.slice(0, 6));
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="container-responsive">
          <div className="text-center mb-12">
            <div className="h-8 w-64 bg-muted animate-pulse rounded mx-auto mb-4" />
            <div className="h-4 w-96 bg-muted animate-pulse rounded mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="container-responsive">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-blue-600 text-white">
              <Briefcase className="h-6 w-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold gradient-text">
              Featured Opportunities
            </h2>
            <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <Sparkles className="h-6 w-6" />
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover hand-picked opportunities from top companies actively hiring skilled professionals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 tight-grid mb-12">
          {featuredJobs.map((job) => (
            <ColorfulJobCard 
              key={job.id} 
              job={job} 
              compact={false}
            />
          ))}
        </div>

        <div className="text-center">
          <Card className="inline-block p-6 glass-effect">
            <CardContent className="flex items-center gap-4 p-0">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-5 w-5" />
                <span>Over 1,000+ jobs available</span>
              </div>
              <Button asChild size="lg" className="button-glow">
                <Link to="/jobs">
                  View All Jobs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;