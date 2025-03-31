
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Award, Star, Zap, BookOpen, Briefcase, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

export interface RankingShowcaseProps {
  isVisible: boolean;
}

const RankingShowcase = ({ isVisible }: RankingShowcaseProps) => {
  const [activeTab, setActiveTab] = useState('how-it-works');

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6, 
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-4"
          >
            <motion.div variants={itemVariants} className="flex justify-center">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-amber-100 text-amber-800">
                <Trophy className="w-4 h-4 mr-2" />
                Advanced Ranking System
              </span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-bold tracking-tight">
              Get Recognized for Your <span className="text-primary">True Potential</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-muted-foreground">
              Our proprietary ranking algorithm analyzes your skills, education, and experience to position you among the best candidates.
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="mt-12"
        >
          <Tabs 
            defaultValue="how-it-works" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                <TabsTrigger value="factors">Ranking Factors</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="how-it-works">
              <motion.div 
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
              >
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardContent className="p-0">
                    <div className="bg-primary/10 p-6">
                      <div className="rounded-lg bg-white p-4 shadow-inner">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Zap className="h-5 w-5 text-amber-500" />
                              <span className="font-semibold">Skills</span>
                            </div>
                            <span className="text-sm font-medium text-primary">35%</span>
                          </div>
                          <Progress value={35} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-5 w-5 text-blue-500" />
                              <span className="font-semibold">Education</span>
                            </div>
                            <span className="text-sm font-medium text-primary">25%</span>
                          </div>
                          <Progress value={25} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Award className="h-5 w-5 text-purple-500" />
                              <span className="font-semibold">Certifications</span>
                            </div>
                            <span className="text-sm font-medium text-primary">15%</span>
                          </div>
                          <Progress value={15} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                              <Briefcase className="h-5 w-5 text-green-500" />
                              <span className="font-semibold">Experience</span>
                            </div>
                            <span className="text-sm font-medium text-primary">25%</span>
                          </div>
                          <Progress value={25} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex justify-between items-center">
                      <div>
                        <div className="text-amber-500 font-bold text-xl flex items-center">
                          <Trophy className="h-5 w-5 mr-1" />
                          <span>Rank: #127</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Top 3% of 5,000 candidates</p>
                      </div>
                      <div className="text-3xl font-bold text-primary">86.5</div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Algorithmic Excellence</h3>
                  <p className="text-muted-foreground">
                    Our advanced ranking algorithm evaluates your profile across multiple dimensions to provide an accurate ranking that employers can trust.
                  </p>
                  
                  <ul className="space-y-3">
                    {[
                      "Comprehensive evaluation of your profile",
                      "Real-time ranking updates as you enhance your profile",
                      "Personalized recommendations to improve your rank",
                      "Transparent scoring system so you know where you stand"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-2 mt-1">
                          <div className="rounded-full bg-green-100 p-1">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild>
                    <Link to="/ranking-explanation">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="factors">
              <motion.div 
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Key Ranking Factors</h3>
                  <p className="text-muted-foreground">
                    Our algorithm considers numerous factors to create a comprehensive ranking that truly represents your capabilities.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-amber-100">
                          <Zap className="h-5 w-5 text-amber-600" />
                        </div>
                        <h4 className="font-semibold text-lg">Skills Assessment</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your skills are evaluated based on proficiency level, years of experience, and verification status.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-blue-100">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-lg">Education Analysis</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        We consider degree level, academic performance (GPA), institution reputation, and field relevance.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-full bg-purple-100">
                          <Award className="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-lg">Certification Value</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Certifications are evaluated based on industry recognition, recency, and verification status.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-full bg-green-100">
                        <Briefcase className="h-5 w-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-lg">Experience Evaluation</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We analyze total years of experience, role relevance, company reputation, and the recency of your experience.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">How We Calculate Your Score</h4>
                    <ol className="space-y-3 list-decimal pl-5">
                      <li className="text-sm text-muted-foreground">
                        <span className="text-foreground font-medium">Component Scoring:</span> Each component (skills, education, etc.) receives an individual score.
                      </li>
                      <li className="text-sm text-muted-foreground">
                        <span className="text-foreground font-medium">Weighted Calculation:</span> Component scores are weighted according to their importance.
                      </li>
                      <li className="text-sm text-muted-foreground">
                        <span className="text-foreground font-medium">Normalization:</span> Final score is normalized to a 0-100 scale for easy comparison.
                      </li>
                      <li className="text-sm text-muted-foreground">
                        <span className="text-foreground font-medium">Ranking Placement:</span> Your score determines your position among all candidates.
                      </li>
                    </ol>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <h4 className="font-medium text-primary mb-2">Did you know?</h4>
                    <p className="text-sm">
                      Employers can set minimum ranking requirements for job postings, ensuring they connect with the most qualified candidates for their positions.
                    </p>
                  </div>
                  
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/ranking-explanation">
                      View Detailed Explanation <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="benefits">
              <motion.div 
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <Card className={cn(
                  "border-none shadow-lg overflow-hidden",
                  "transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                )}>
                  <CardContent className="p-0">
                    <div className="bg-amber-50 p-6 flex justify-center">
                      <div className="rounded-full bg-amber-100 p-4">
                        <Trophy className="h-8 w-8 text-amber-600" />
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="font-bold text-xl">For Candidates</h3>
                      <ul className="space-y-2">
                        {[
                          "Stand out to top employers based on merit",
                          "Get matched with jobs that fit your qualification level",
                          "Receive personalized improvement recommendations",
                          "Access higher-tier job opportunities as you improve",
                          "Track your progress over time with data-driven insights"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" className="w-full mt-4" asChild>
                        <Link to="/register">Create Profile</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={cn(
                  "border-none shadow-lg overflow-hidden",
                  "transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                )}>
                  <CardContent className="p-0">
                    <div className="bg-blue-50 p-6 flex justify-center">
                      <div className="rounded-full bg-blue-100 p-4">
                        <Briefcase className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="font-bold text-xl">For Employers</h3>
                      <ul className="space-y-2">
                        {[
                          "Filter candidates by objective ranking criteria",
                          "Set minimum rank requirements for your job postings",
                          "Reduce recruitment time by focusing on top candidates",
                          "Make data-driven hiring decisions",
                          "Access verified skills and qualifications at a glance"
                        ].map((item, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 text-green-600 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <Button variant="outline" className="w-full mt-4" asChild>
                        <Link to="/post-job">Post a Job</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={cn(
                  "border-none shadow-lg overflow-hidden",
                  "transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                )}>
                  <CardContent className="p-0">
                    <div className="bg-green-50 p-6 flex justify-center">
                      <div className="rounded-full bg-green-100 p-4">
                        <Star className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <h3 className="font-bold text-xl">Success Stories</h3>
                      <div className="space-y-4">
                        <div className="border-b pb-3">
                          <p className="text-sm italic">"The ranking system helped me demonstrate my skills beyond just my resume. I improved from #487 to #62 in three months and landed my dream job."</p>
                          <p className="text-sm font-medium mt-2">Sarah K. - Software Engineer</p>
                        </div>
                        
                        <div className="border-b pb-3">
                          <p className="text-sm italic">"As an employer, the ranking system saved us countless hours in screening candidates. We now find the right talent faster than ever."</p>
                          <p className="text-sm font-medium mt-2">Mark T. - Hiring Manager</p>
                        </div>
                        
                        <div>
                          <p className="text-sm italic">"The personalized improvement suggestions helped me identify skill gaps and focus my learning. My ranking increased by 30% after completing recommended certifications."</p>
                          <p className="text-sm font-medium mt-2">Alex M. - Data Analyst</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4" asChild>
                        <Link to="/testimonials">Read More Stories</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
};

export default RankingShowcase;
