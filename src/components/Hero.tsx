
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
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-gradient-to-tl from-blue-500/15 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[85vh]">
          {/* Hero Content */}
          <div className={`space-y-6 lg:space-y-8 text-center lg:text-left transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-4 lg:space-y-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 backdrop-blur-sm border border-primary/20 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mx-auto lg:mx-0 shadow-lg shadow-primary/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Where Fresh Talent Meets Innovation
              </div>
              
              <div className="space-y-3 lg:space-y-4">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[1.1]">
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                      FresherPools
                    </span>
                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0"></span>
                  </span>
                </h1>
                
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground/90 leading-tight">
                  The Future of{' '}
                  <span className="relative inline-block">
                    <span className="text-primary">Talent Discovery</span>
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-primary/30 blur-sm"></span>
                  </span>
                </h2>
                
                <p className="text-lg lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                  AI-powered skill matching that puts your abilities first. Get discovered by top employers through merit, not luck.
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
                    <Link to="/resume-builder">Build Resume</Link>
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
                    <Link to="/resume-builder">Build Resume</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-6 lg:gap-8 pt-8 lg:pt-10 justify-center lg:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 border-2 border-background flex items-center justify-center text-white text-xs font-bold">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-foreground">5,000+ Active Users</div>
                  <div className="text-muted-foreground text-xs">Trusted by leading companies</div>
                </div>
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
