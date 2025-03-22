
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

interface HowItWorksSectionProps {
  isVisible: boolean;
}

const HowItWorksSection = ({ isVisible }: HowItWorksSectionProps) => {
  const steps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Sign up and build your comprehensive profile highlighting your education, skills, and strengths.',
      delay: 200
    },
    {
      step: '02',
      title: 'AI Matches You',
      description: 'Our algorithm analyzes your profile and matches you with the most suitable job opportunities.',
      delay: 400
    },
    {
      step: '03',
      title: 'Apply & Connect',
      description: 'Apply to jobs with a single click and connect directly with interested employers.',
      delay: 600
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            How <span className="text-primary">FresherPools</span> Works
          </h2>
          <p className={`text-lg text-muted-foreground transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}>
            Our AI-powered platform makes it easy to connect freshers with the perfect job opportunities in just a few simple steps.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${item.delay}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold mb-6">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
        
        <div className={`flex justify-center mt-12 transition-all duration-700 delay-800 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button asChild>
            <Link to="/register">
              Get Started Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
