import { motion } from 'framer-motion';
import { Trophy, Target, Users, TrendingUp, Shield, Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface RankingDetailsSectionProps {
  isVisible: boolean;
}

const RankingDetailsSection = ({ isVisible }: RankingDetailsSectionProps) => {
  const features = [
    {
      icon: Trophy,
      title: "Merit-Based Ranking",
      description: "Your ranking is based purely on skills, experience, and achievements - not connections or background.",
      color: "text-yellow-600"
    },
    {
      icon: Target,
      title: "Comprehensive Scoring",
      description: "Our AI evaluates technical skills, certifications, education quality, and work experience for accurate rankings.",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Employer Confidence",
      description: "Recruiters trust our rankings to identify top talent, making the hiring process faster and more efficient.",
      color: "text-green-600"
    },
    {
      icon: TrendingUp,
      title: "Career Growth Tracking",
      description: "Watch your ranking improve as you gain new skills and experience, opening doors to better opportunities.",
      color: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Verified Skills",
      description: "All skills and certifications are verified for authenticity, ensuring employers get qualified candidates.",
      color: "text-red-600"
    },
    {
      icon: Star,
      title: "Industry Recognition",
      description: "Top-ranked candidates get priority visibility and exclusive access to premium job opportunities.",
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background via-secondary/5 to-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Our <span className="gradient-text">Ranking System</span> Changes Everything
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Traditional hiring is broken. We fix it with transparent, merit-based rankings that actually work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full hover-lift card-hover border-muted/50 group-hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-primary/5 via-blue-500/5 to-primary/5 rounded-2xl p-8 text-center border border-primary/10"
        >
          <h3 className="text-xl font-bold mb-3">Ready to Get Ranked?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-sm">
            Join thousands who've already discovered their true market value through our AI-powered ranking system.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 button-glow"
            >
              Start My Ranking
            </a>
            <a
              href="/ranking-explanation"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary/20 text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all duration-200"
            >
              How It Works
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RankingDetailsSection;