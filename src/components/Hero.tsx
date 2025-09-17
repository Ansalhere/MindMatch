
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const { user } = useUser();
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="min-h-screen hero-gradient flex items-center justify-center pt-16">
      <div className="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between">
        {/* Hero Text */}
        <div className={`md:max-w-[50%] space-y-6 md:space-y-8 text-center md:text-left mb-12 md:mb-0 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block overflow-hidden rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            ✨ Smart Career Platform - Where Fresh Talent Meets Opportunity
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            <span className="text-blue-600">FresherPools</span>
          </h1>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Bridging <span className="text-primary">Talent & Opportunity</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            In today's competitive job market, fresh graduates and entry-level professionals need a platform that truly understands their potential. FresherPools connects emerging talent with forward-thinking employers through our revolutionary ranking system.
          </p>
          
          <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-6 my-8 border border-primary/20">
            <h3 className="text-xl font-bold text-primary mb-4 text-center">🎯 Revolutionary Ranking System</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/50 rounded-lg p-4">
                <strong className="text-primary">Smart Skill Assessment:</strong> Our AI analyzes your technical skills, certifications, education, and experience to create a comprehensive ranking score from 0-100.
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <strong className="text-primary">Fair & Transparent:</strong> Unlike traditional hiring where connections matter more than skills, our ranking ensures the best candidates rise to the top based purely on merit.
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <strong className="text-primary">Employer Confidence:</strong> Recruiters can instantly identify top talent with verified rankings, making hiring decisions faster and more accurate.
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <strong className="text-primary">Career Growth:</strong> Track your ranking improvement over time as you gain new skills and experience, opening doors to better opportunities.
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 my-8 p-6 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">98%</div>
              <div className="text-sm text-muted-foreground">Accuracy in Matching</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5x</div>
              <div className="text-sm text-muted-foreground">Faster Hiring Process</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">50k+</div>
              <div className="text-sm text-muted-foreground">Successful Placements</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            {user ? (
              <>
                <Button size="lg" className="px-8 py-6 text-base rounded-xl" asChild>
                  <Link to={`/profile/${user.id}/${user.user_type === 'employer' ? 'employer' : 'candidate'}`}>
                    Go to Profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-6 text-base rounded-xl" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="px-8 py-6 text-base rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg" asChild>
                  <Link to="/register">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-6 text-base rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold" asChild>
                  <Link to="/login">
                    Login to Demo
                  </Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center justify-center md:justify-start pt-4 space-x-4">
            <p className="text-sm text-muted-foreground">Trusted by:</p>
            <div className="flex space-x-6">
              {['TCS', 'Infosys', 'Wipro', 'HCL Tech'].map((company, index) => (
                <div key={index} className="flex items-center text-muted-foreground/80 font-medium">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className={`relative md:max-w-[45%] transition-all duration-1000 delay-300 ${loaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <div className="glass-card rounded-2xl overflow-hidden p-4 relative animate-float">
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/20 rounded-xl flex items-center justify-center">
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-white/40">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xs">
                  <div className="absolute top-6 left-6 right-6 bg-white/70 backdrop-blur-md h-12 rounded-lg"></div>
                  <div className="absolute top-24 left-6 w-1/2 bg-white/70 backdrop-blur-md h-32 rounded-lg"></div>
                  <div className="absolute top-24 right-6 w-1/3 bg-white/70 backdrop-blur-md h-48 rounded-lg"></div>
                  <div className="absolute bottom-6 left-6 right-6 bg-primary/10 backdrop-blur-md h-16 rounded-lg flex items-center justify-center">
                    <div className="w-1/4 h-8 bg-primary rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 bg-primary/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                98
              </div>
              <div className="text-sm">
                <p className="font-medium">Skill Match</p>
                <p className="text-xs text-muted-foreground">Top 5% candidate</p>
              </div>
            </div>
          </div>
          <div className="absolute -top-6 -left-6 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">
                24
              </div>
              <div className="text-sm">
                <p className="font-medium">New Jobs</p>
                <p className="text-xs text-muted-foreground">Matching your profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
