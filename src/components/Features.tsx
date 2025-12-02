
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
    <section className="py-32 relative overflow-hidden bg-gradient-to-b from-background to-muted/30" ref={featuresRef}>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className={cn(
            "inline-flex items-center gap-2 glass-card border border-primary/20 px-4 py-2 rounded-full text-sm font-semibold mb-6 transition-all duration-700",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}>
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Why Choose FresherPools
            </span>
          </div>
          
          <h2 className={cn(
            "text-5xl md:text-6xl font-black mb-6 transition-all duration-700 delay-100 leading-[1.1]",
            isVisible ? "opacity-100" : "opacity-0 translate-y-10"
          )}>
            Built for{' '}
            <span className="block mt-2 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Modern Talent
            </span>
          </h2>
          
          <p className={cn(
            "text-xl text-muted-foreground transition-all duration-700 delay-200 leading-relaxed max-w-2xl mx-auto",
            isVisible ? "opacity-100" : "opacity-0 translate-y-10"
          )}>
            A revolutionary platform that matches skills to opportunities using advanced AI, eliminating bias and focusing on what truly matters—capability.
          </p>
        </div>

        {/* Bento Grid Layout - Modern Approach */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                "group relative glass-card p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer overflow-hidden",
                index === 0 && "md:col-span-2 lg:col-span-2 lg:row-span-2",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
              onMouseEnter={() => setActiveFeature(index)}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-purple-500/5 group-hover:to-transparent transition-all duration-500 rounded-3xl"></div>
              
              {/* Icon */}
              <div className="relative mb-6 z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 space-y-3">
                <h3 className={cn(
                  "font-bold transition-all duration-300",
                  index === 0 ? "text-2xl lg:text-3xl" : "text-xl"
                )}>
                  {feature.title}
                </h3>
                <p className={cn(
                  "text-muted-foreground leading-relaxed",
                  index === 0 ? "text-base lg:text-lg max-w-xl" : "text-sm"
                )}>
                  {feature.description}
                </p>
              </div>
              
              {/* Active indicator */}
              {activeFeature === index && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary animate-pulse z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
