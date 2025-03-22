
import { Users, Briefcase, BadgeCheck, Star } from 'lucide-react';

interface StatsSectionProps {
  isVisible: boolean;
}

const StatsSection = ({ isVisible }: StatsSectionProps) => {
  return (
    <section id="stats" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl font-bold mb-2">25K+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl font-bold mb-2">10K+</div>
            <div className="text-muted-foreground">Job Listings</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BadgeCheck className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl font-bold mb-2">15K+</div>
            <div className="text-muted-foreground">Matched Jobs</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <div className="text-4xl font-bold mb-2">98%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
