
import { useState, useEffect, useRef } from 'react';
import { Briefcase, Users, BarChart3, Award, Zap, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: <Briefcase className="h-6 w-6" />,
    title: "Unlimited Free Job Postings",
    description: "Employers can post as many job openings as needed with detailed skill requirements, at no cost."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "AI-Powered Candidate Matching",
    description: "Our algorithm intelligently ranks and matches candidates based on skill compatibility with job requirements."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Skill Analytics",
    description: "Candidates can track their ranking and see how they compare to others applying for similar positions."
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "Smart Filtering System",
    description: "Filter candidates by education, skills, location and more to quickly find the perfect match."
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Detailed Profiles",
    description: "Candidates can showcase their education, skills, and experience with quantifiable proficiency levels."
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Quick Application Process",
    description: "Apply to multiple jobs with just a few clicks once your profile is complete."
  }
];

const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden" ref={featuresRef}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className={cn(
            "inline-block mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold transition-all duration-700",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}>
            Why Choose FresherPools
          </div>
          <h2 className={cn(
            "text-4xl md:text-5xl font-black mb-6 transition-all duration-700 delay-100 leading-tight",
            isVisible ? "opacity-100" : "opacity-0 translate-y-10"
          )}>
            Built for <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">Modern Talent</span> Acquisition
          </h2>
          <p className={cn(
            "text-lg text-muted-foreground transition-all duration-700 delay-200 leading-relaxed",
            isVisible ? "opacity-100" : "opacity-0 translate-y-10"
          )}>
            A revolutionary platform that matches skills to opportunities using advanced AI, eliminating bias and focusing on what truly matters—capability.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Interactive Feature Display */}
          <div className={cn(
            "relative bg-gradient-to-br from-card to-card/50 rounded-3xl p-10 border border-border/50 transition-all duration-700 delay-300 h-[450px] flex items-center justify-center shadow-elegant overflow-hidden",
            isVisible ? "opacity-100" : "opacity-0"
          )}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative w-full h-full">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center text-center p-10 transition-all duration-500",
                    activeFeature === index 
                      ? "opacity-100 scale-100" 
                      : "opacity-0 scale-90 pointer-events-none"
                  )}
                >
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-xl"></div>
                    <div className="relative bg-gradient-to-br from-primary to-purple-600 text-white p-5 rounded-3xl shadow-lg">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed max-w-md">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={cn(
                  "group relative flex items-start p-5 rounded-2xl cursor-pointer transition-all duration-300 border",
                  activeFeature === index 
                    ? "bg-gradient-to-r from-primary to-purple-600 text-white border-primary shadow-lg shadow-primary/25 scale-[1.02]" 
                    : "bg-card/50 hover:bg-card border-border/50 hover:border-primary/30 hover:shadow-md",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                )}
                style={{ transitionDelay: `${400 + index * 50}ms` }}
                onClick={() => setActiveFeature(index)}
              >
                <div className={cn(
                  "mr-4 p-3 rounded-xl transition-all duration-300",
                  activeFeature === index 
                    ? "bg-white/20 backdrop-blur-sm text-white shadow-lg" 
                    : "bg-primary/10 text-primary group-hover:bg-primary/15"
                )}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h4 className={cn(
                    "font-bold text-base mb-1 transition-colors",
                    activeFeature === index ? "text-white" : "text-foreground"
                  )}>
                    {feature.title}
                  </h4>
                  <p className={cn(
                    "text-sm leading-relaxed transition-colors",
                    activeFeature === index 
                      ? "text-white/90" 
                      : "text-muted-foreground"
                  )}>
                    {feature.description}
                  </p>
                </div>
                {activeFeature === index && (
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-white rounded-full shadow-lg"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
