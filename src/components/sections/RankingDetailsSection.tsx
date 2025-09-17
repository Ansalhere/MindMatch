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
    <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How Our <span className="text-primary">Ranking System</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            FresherPools revolutionizes hiring with the world's first comprehensive skill-based ranking system. 
            No more bias, no more luck - just pure talent recognition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="h-full border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-lg bg-primary/10 mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Discover Your Rank?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their careers with our ranking system. 
            Start building your profile today and see where you stand in your field.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get My Ranking Now
            </a>
            <a
              href="/ranking-explanation"
              className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RankingDetailsSection;