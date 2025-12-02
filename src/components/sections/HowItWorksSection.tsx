
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface HowItWorksSectionProps {
  isVisible: boolean;
}

const HowItWorksSection = ({ isVisible }: HowItWorksSectionProps) => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/register');
  };
  
  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Sign up and build your comprehensive profile highlighting your education, skills, and strengths.',
      delay: 200
    },
    {
      step: '02',
      title: 'Get Ranked',
      description: 'Our intelligent system analyzes your profile and assigns you a rank based on your skills and qualifications.',
      delay: 400
    },
    {
      step: '03',
      title: 'Apply & Connect',
      description: 'Apply to jobs with a single click and let employers discover you through our ranking system.',
      delay: 600
    }
  ];

  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className={`inline-flex items-center gap-2 glass-card border border-primary/20 px-4 py-2 rounded-full text-sm font-semibold mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              How It Works
            </span>
          </div>
          
          <h2 className={`text-5xl md:text-6xl font-black mb-6 transition-all duration-700 delay-100 leading-[1.1] ${
            isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            Get Started in{' '}
            <span className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
              3 Simple Steps
            </span>
          </h2>
          
          <p className={`text-xl text-muted-foreground transition-all duration-700 delay-200 leading-relaxed ${
            isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            Our ranking-powered platform makes it easy to connect talent with perfect opportunities.
          </p>
        </div>
        
        {/* Steps with connecting line */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((item, index) => (
              <div 
                key={index}
                className={`relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${item.delay}ms` }}
              >
                {/* Card */}
                <div className="glass-card p-8 rounded-3xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 group relative overflow-hidden h-full">
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-3xl"></div>
                  
                  {/* Step number badge */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                      {item.step}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
                
                {/* Connecting dot */}
                <div className="hidden md:block absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-primary to-purple-600 border-4 border-background shadow-lg"></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className={`flex justify-center mt-16 transition-all duration-700 delay-800 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
