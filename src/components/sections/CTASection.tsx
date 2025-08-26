
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Trophy, Star, Users, Award, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CTASectionProps {
  isVisible: boolean;
}

const CTASection = ({ isVisible }: CTASectionProps) => {
  return (
    <section id="cta" className="py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">AI-Powered Career Advancement</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Accelerate Your Career With{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              RankMe.AI
            </span>
            ?
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals already using RankMe.AI to connect talent with opportunity 
            through our revolutionary AI-powered ranking system.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white/15 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <Trophy className="h-8 w-8 text-yellow-300 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Stand Out with AI Rankings</h3>
              <p className="text-sm text-white/80">Showcase your skills with our verified AI-driven ranking system</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white/15 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <Award className="h-8 w-8 text-yellow-300 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Improve Your Score</h3>
              <p className="text-sm text-white/80">Add certifications, take assessments, update your experience</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white/15 backdrop-blur-sm px-6 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <Star className="h-8 w-8 text-yellow-300 mb-3 mx-auto" />
              <h3 className="text-white font-semibold mb-2">Get Discovered</h3>
              <p className="text-sm text-white/80">Top-ranked profiles get more visibility with premium employers</p>
            </motion.div>
          </div>
          
            <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-primary bg-white hover:bg-white/90 px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300" 
              asChild
            >
              <Link to="/register" className="flex items-center">
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white bg-white/10 hover:bg-white/20 hover:border-white border-2 px-8 py-3 text-lg backdrop-blur-sm transition-all duration-300 font-semibold" 
              asChild
            >
              <Link to="/profiles">Browse Ranked Profiles</Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="ghost" 
              className="text-white hover:bg-white/10 px-8 py-3 text-lg transition-all duration-300" 
              asChild
            >
              <Link to="/ranking-explanation">Learn About AI Ranking</Link>
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-white/70 text-sm mb-4">Trusted by professionals at</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="text-white/60 font-semibold">TCS</div>
              <div className="text-white/60 font-semibold">Infosys</div>
              <div className="text-white/60 font-semibold">Wipro</div>
              <div className="text-white/60 font-semibold">HCL Tech</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
