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

          {/* Animated Content - Fixed Height Container */}
          <div className="h-64 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
              {currentStep === 0 && (
                <div className="w-full max-w-md mx-auto space-y-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg"
                  >
                    <Target className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="grid grid-cols-2 gap-3">
                    {["React", "Python", "Design", "ML"].map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ scale: 0, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.15,
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                        whileHover={{ scale: 1.05, rotateZ: 2 }}
                        className="bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 text-blue-600 px-4 py-3 rounded-xl text-center text-sm font-semibold border border-blue-500/30 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="w-full max-w-md mx-auto space-y-4">
                  <motion.div
                    initial={{ scale: 0, rotate: 360 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="w-20 h-20 mx-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg"
                  >
                    <TrendingUp className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="space-y-4">
                    {["Projects Completed", "Code Quality", "Learning Progress"].map((metric, index) => (
                      <motion.div 
                        key={metric} 
                        className="space-y-2"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.2, type: "spring" }}
                      >
                        <div className="flex justify-between text-sm font-medium">
                          <span>{metric}</span>
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.3 + 0.5 }}
                            className="text-primary font-bold"
                          >
                            {85 + index * 5}%
                          </motion.span>
                        </div>
                        <div className="bg-muted rounded-full h-3 overflow-hidden shadow-inner">
                          <motion.div
                            initial={{ width: 0, x: -10 }}
                            animate={{ width: `${85 + index * 5}%`, x: 0 }}
                            transition={{ 
                              delay: index * 0.3, 
                              duration: 1.2,
                              type: "spring",
                              stiffness: 100
                            }}
                            className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-full rounded-full shadow-lg"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="text-center space-y-6 w-full max-w-md mx-auto">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 360]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-2xl"
                    >
                      92
                    </motion.div>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-red-500/30 rounded-full -z-10"
                    />
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div 
                      className="text-xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Ranking Score Generated
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Based on comprehensive AI analysis</div>
                  </motion.div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="w-full max-w-md mx-auto space-y-4">
                  <motion.div
                    initial={{ scale: 0, y: -50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-lg"
                  >
                    <Trophy className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="space-y-3">
                    {candidates
                      .sort((a, b) => b.score - a.score)
                      .map((candidate, index) => (
                      <motion.div
                        key={candidate.name}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ 
                          delay: index * 0.15,
                          type: "spring",
                          stiffness: 200,
                          damping: 20
                        }}
                        whileHover={{ scale: 1.02, y: -2 }}
                         className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                           index === 0 ? 'bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-red-500/30 border-2 border-amber-500/50 shadow-lg' : 'bg-muted/30 border border-muted-foreground/20'
                         }`}
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div 
                             className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                               index === 0 ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white' : 'bg-muted text-muted-foreground'
                             }`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            {candidate.avatar}
                          </motion.div>
                          <div>
                            <div className="font-semibold text-sm">{candidate.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {candidate.skills.slice(0, 2).join(", ")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <motion.div 
                            className={`text-xl font-bold ${index === 0 ? 'text-amber-600' : 'text-muted-foreground'}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.15 + 0.3, type: "spring" }}
                          >
                            {candidate.score}
                          </motion.div>
                          {index === 0 && (
                            <motion.span
                              animate={{ 
                                rotate: [0, 360],
                                scale: [1, 1.3, 1]
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity,
                                ease: "linear"
                              }}
                              className="inline-block"
                            >
                              <Star className="w-5 h-5 fill-current text-amber-500" />
                            </motion.span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              </motion.div>
            </AnimatePresence>
          </div>

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