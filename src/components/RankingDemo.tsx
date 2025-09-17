import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Star, Award, Target, Zap, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';

const RankingDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationCycle, setAnimationCycle] = useState(0);

  const candidates = [
    { name: "Sarah K.", skills: ["React", "Node.js", "MongoDB"], score: 92, avatar: "SK" },
    { name: "Raj P.", skills: ["Python", "Django", "AWS"], score: 88, avatar: "RP" },
    { name: "Alex M.", skills: ["Java", "Spring", "MySQL"], score: 85, avatar: "AM" },
    { name: "Priya S.", skills: ["Angular", "TypeScript", "Docker"], score: 90, avatar: "PS" }
  ];

  const steps = [
    { icon: Target, title: "Skills Assessment", desc: "AI evaluates technical expertise" },
    { icon: TrendingUp, title: "Performance Analysis", desc: "Tracks growth and achievements" },
    { icon: Award, title: "Smart Ranking", desc: "Generates merit-based score" },
    { icon: Trophy, title: "Top Talent Rises", desc: "Best candidates get visibility" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const nextStep = (prev + 1) % steps.length;
        if (nextStep === 0) {
          setAnimationCycle(c => c + 1);
        }
        return nextStep;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Main Demo Container */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 to-blue-500/5 border-2 border-primary/20 p-8 w-full">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-foreground">Live Ranking System</h3>
            <p className="text-muted-foreground">Watch how talent gets discovered</p>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-500 ${
                    index === currentStep 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                  animate={{
                    scale: index === currentStep ? 1.05 : 1,
                  }}
                >
                  <step.icon className="w-4 h-4" />
                  <span className="text-xs font-medium hidden sm:inline">{step.title}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Animated Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {["React", "Python", "Design", "ML"].map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-center text-sm font-medium"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-3 w-full">
                  {["Projects Completed", "Code Quality", "Learning Progress"].map((metric, index) => (
                    <div key={metric} className="space-y-1 w-full">
                      <div className="flex justify-between text-sm">
                        <span>{metric}</span>
                        <span>{85 + index * 5}%</span>
                      </div>
                      <div className="bg-muted rounded-full h-2 overflow-hidden w-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${85 + index * 5}%` }}
                          transition={{ delay: index * 0.2, duration: 0.8 }}
                          className="bg-primary h-full rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                    className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                  >
                    92
                  </motion.div>
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">Ranking Score Generated</div>
                    <div className="text-sm text-muted-foreground">Based on comprehensive analysis</div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-3">
                  {candidates
                    .sort((a, b) => b.score - a.score)
                    .map((candidate, index) => (
                    <motion.div
                      key={candidate.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        index === 0 ? 'bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/30' : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'
                        }`}>
                          {candidate.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{candidate.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {candidate.skills.slice(0, 2).join(", ")}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${index === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                        {candidate.score}
                        {index === 0 && (
                          <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="inline-block ml-1"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Current Step Description */}
          <motion.div
            key={`desc-${currentStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground pt-4 border-t border-border"
          >
            {steps[currentStep].desc}
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-4 right-4 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
        >
          <Zap className="w-4 h-4 text-primary" />
        </motion.div>
      </Card>

      {/* Floating Stats */}
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          x: [0, 2, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute -top-4 -left-4 bg-card border shadow-lg rounded-xl p-3"
      >
        <div className="text-xs text-muted-foreground">Live Rankings</div>
        <div className="text-lg font-bold text-primary">2,847</div>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, -8, 0],
          x: [0, -2, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-4 -right-4 bg-card border shadow-lg rounded-xl p-3"
      >
        <div className="text-xs text-muted-foreground">Success Rate</div>
        <div className="text-lg font-bold text-green-600">94%</div>
      </motion.div>
    </div>
  );
};

export default RankingDemo;