
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

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
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-white/80 mb-10">
            Join thousands of freshers and employers already using FresherPools to connect talent with opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary px-8">
              <Link to="/register">Sign Up Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 px-8">
              <Link to="/profiles">Browse Profiles</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
