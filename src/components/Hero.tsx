
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Modern background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/30 via-purple-500/20 to-transparent rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/20 via-primary/15 to-transparent rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-gradient-to-t from-purple-500/25 to-transparent rounded-full blur-[90px]"></div>
        
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(var(--primary-rgb),0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(var(--primary-rgb),0.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,black_20%,transparent_80%)]"></div>
      </div>

      <div className="container mx-auto px-6 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          {/* Hero Content - Enhanced Typography & Layout */}
          <div className={`space-y-8 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-card border border-primary/20 px-4 py-2 rounded-full text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Where Fresh Talent Meets Innovation
              </span>
            </div>
            
            {/* Headline - Modern Typography */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
                <span className="block bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                  Fresher
                </span>
                <span className="block mt-2 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Pools
                </span>
              </h1>
              
              <div className="max-w-xl">
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-medium">
                  AI-powered skill matching that puts your 
                  <span className="text-foreground font-bold"> abilities first</span>. 
                  Get discovered by top employers through 
                  <span className="text-primary font-bold"> merit, not luck</span>.
                </p>
              </div>
            </div>

            {/* CTAs - Modern Button Group */}
            <div className="flex flex-wrap gap-4">
              {user ? (
                <>
                  <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" asChild>
                    <Link to={`/profile/${user.id}/${user.user_type === 'employer' ? 'employer' : 'candidate'}`}>
                      View My Profile 
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold border-2 hover:bg-card" asChild>
                    <Link to="/resume-builder">Build Resume</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all" asChild>
                    <Link to="/register">
                      Get My Ranking 
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold border-2 hover:bg-card" asChild>
                    <Link to="/resume-builder">Build Resume</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Social Proof - Redesigned */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 border-2 border-background flex items-center justify-center text-white text-sm font-bold shadow-lg"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">5,000+ Active Users</div>
                <div className="text-xs text-muted-foreground">Trusted by leading companies</div>
              </div>
            </div>
          </div>

          {/* Interactive Demo - Enhanced Card */}
          <div className={`relative transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 rounded-[2rem] blur-2xl opacity-60"></div>
              
              {/* Main card */}
              <div className="relative glass-card p-8 rounded-3xl border border-border/50 shadow-2xl">
                <RankingDemo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
