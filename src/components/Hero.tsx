
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import RankingDemo from './RankingDemo';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const { user } = useUser();
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="min-h-screen hero-gradient flex items-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[85vh]">
          {/* Hero Content */}
          <div className={`space-y-6 lg:space-y-8 text-center lg:text-left transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-4 lg:space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mx-auto lg:mx-0">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                Where Fresh Talent Meets Innovation
              </div>
              
              <div className="space-y-3 lg:space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    FresherPools
                  </span>
                </h1>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground/90">
                  Revolutionary <span className="text-primary">Ranking System</span>
                </h2>
                
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Skip the resume lottery. Get ranked on pure skills and watch opportunities find you.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {user ? (
                <>
                  <Button size="lg" className="px-6 lg:px-8 py-4 lg:py-6 text-base lg:text-lg font-semibold button-glow" asChild>
                    <Link to={`/profile/${user.id}/${user.user_type === 'employer' ? 'employer' : 'candidate'}`}>
                      View My Profile <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-6 lg:px-8 py-4 lg:py-6 text-base lg:text-lg border-2" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="px-6 lg:px-8 py-4 lg:py-6 text-base lg:text-lg font-semibold button-glow" asChild>
                    <Link to="/register">
                      Get My Ranking <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-6 lg:px-8 py-4 lg:py-6 text-base lg:text-lg border-2" asChild>
                    <Link to="/login">Try Demo</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8 pt-6 lg:pt-8 justify-center lg:justify-start">
              <div className="text-sm text-muted-foreground">Trusted by:</div>
              <div className="flex items-center gap-4 lg:gap-6">
                {['TCS', 'Infosys', 'Wipro', 'HCL'].map((company, index) => (
                  <div key={index} className="text-muted-foreground/70 font-medium text-sm">
                    {company}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Ranking Demo */}
          <div className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl">
              <RankingDemo />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
