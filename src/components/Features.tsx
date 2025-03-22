
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
    <section className="py-24 bg-secondary/50" ref={featuresRef}>
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold mb-6 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0 translate-y-10"
          )}>
            Designed for <span className="text-primary">Freshers & Employers</span>
          </h2>
          <p className={cn(
            "text-lg text-muted-foreground transition-all duration-700 delay-100",
            isVisible ? "opacity-100" : "opacity-0 translate-y-10"
          )}>
            FresherPools bridges the gap between entry-level talent and employers with an intuitive platform focused on skills and potential rather than experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Interactive Feature Display */}
          <div className={cn(
            "bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-700 delay-200 h-96 flex items-center justify-center",
            isVisible ? "opacity-100" : "opacity-0"
          )}>
            <div className="relative w-full h-full">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center text-center p-8 transition-all duration-500",
                    activeFeature === index 
                      ? "opacity-100 scale-100" 
                      : "opacity-0 scale-95 pointer-events-none"
                  )}
                >
                  <div className="bg-primary/10 text-primary p-4 rounded-2xl mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feature List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-start p-4 rounded-xl cursor-pointer transition-all duration-300",
                  activeFeature === index 
                    ? "bg-primary text-white" 
                    : "hover:bg-white/80",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10",
                  `transition-all duration-700 delay-${300 + index * 100}`
                )}
                onClick={() => setActiveFeature(index)}
              >
                <div className={cn(
                  "mr-4 p-2 rounded-lg",
                  activeFeature === index 
                    ? "bg-white text-primary" 
                    : "bg-primary/10 text-primary"
                )}>
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className={cn(
                    "text-sm mt-1",
                    activeFeature === index 
                      ? "text-white/80" 
                      : "text-muted-foreground"
                  )}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
