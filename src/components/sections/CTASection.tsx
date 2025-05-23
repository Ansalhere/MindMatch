
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Trophy, Star, Users, Award } from 'lucide-react';

interface CTASectionProps {
  isVisible: boolean;
}

const CTASection = ({ isVisible }: CTASectionProps) => {
  return (
    <section id="cta" className="py-24 bg-primary text-white">
      <div className="container mx-auto px-6">
        <div className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Boost Your Career With RankMe?
          </h2>
          <p className="text-lg text-white/80 mb-6">
            Join thousands of professionals already using RankMe to connect talent with opportunity based on our advanced skill-based ranking system.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 px-4 py-3 rounded-lg flex flex-col items-center">
              <Trophy className="h-6 w-6 text-yellow-300 mb-2" />
              <span className="text-white font-medium">Stand Out with Rankings</span>
              <span className="text-xs text-white/70">Showcase your skills with our verified ranking system</span>
            </div>
            
            <div className="bg-white/10 px-4 py-3 rounded-lg flex flex-col items-center">
              <Award className="h-6 w-6 text-yellow-300 mb-2" />
              <span className="text-white font-medium">Improve Your Score</span>
              <span className="text-xs text-white/70">Add certifications, take assessments, update your experience</span>
            </div>
            
            <div className="bg-white/10 px-4 py-3 rounded-lg flex flex-col items-center">
              <Star className="h-6 w-6 text-yellow-300 mb-2" />
              <span className="text-white font-medium">Get Discovered</span>
              <span className="text-xs text-white/70">Top-ranked profiles get more visibility with employers</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary px-8" asChild>
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 px-8" asChild>
              <Link to="/profiles">Browse Ranked Profiles</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 px-8" asChild>
              <Link to="/ranking-explanation">Learn About Ranking</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
