
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Award, Book, Trophy, Briefcase, FileCheck, ExternalLink, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const RankingExplanation = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            How Rankings Work
          </CardTitle>
          <CardDescription>
            Our AI-powered ranking system evaluates candidates based on multiple factors
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <p className="text-muted-foreground">
            Your ranking score (0-100) determines your visibility to employers and affects your chance of being matched with premium job opportunities. 
            Higher-ranked candidates appear first in employer searches and get priority for exclusive positions.
          </p>
          
          <div className="bg-secondary/30 p-4 rounded-lg mb-2">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Ranking Impact</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Top 10%</strong> of ranked candidates are <strong>5x more likely</strong> to be shortlisted for interviews.
              Our data shows ranked candidates receive <strong>68% more profile views</strong> from employers.
            </p>
          </div>
          
          <Separator className="my-6" />
          
          <h3 className="text-lg font-semibold mb-4">Ranking Factors</h3>
          
          <div className="space-y-6 mt-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Education (25%)</h3>
                <p className="text-sm text-muted-foreground mb-2">Higher tier colleges, relevant degrees, and better grades significantly improve your ranking.</p>
                <Progress value={75} className="h-1.5 mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Tier 1 College: +45 points</span>
                  <span>High GPA: +30 points</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Certifications (20%)</h3>
                <p className="text-sm text-muted-foreground mb-2">Industry-recognized certifications verify your skills and boost credibility.</p>
                <Progress value={60} className="h-1.5 mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Per certification: +15 points</span>
                  <span>Verified certs: +10 bonus</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <FileCheck className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Skills & Assessments (25%)</h3>
                <p className="text-sm text-muted-foreground mb-2">Take our skill assessment exams to verify expertise and boost your score significantly.</p>
                <Progress value={85} className="h-1.5 mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Skill level × 5 points</span>
                  <span>Verified skill: 2× multiplier</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Work Experience (20%)</h3>
                <p className="text-sm text-muted-foreground mb-2">Quality and duration of relevant experience provide a major boost.</p>
                <Progress value={90} className="h-1.5 mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Per year: +20 points</span>
                  <span>Relevant experience: +15 bonus</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Book className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Projects & Portfolio (10%)</h3>
                <p className="text-sm text-muted-foreground mb-2">Showcasing real-world applications of your skills adds credibility.</p>
                <Progress value={70} className="h-1.5 mt-2" />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Per project: +10 points</span>
                  <span>GitHub integration: +25 bonus</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-secondary/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-medium">Want to improve your ranking?</h3>
                <p className="text-sm text-muted-foreground">Add skills, certifications and complete your profile</p>
              </div>
            </div>
            <Button asChild>
              <Link to="/add-skill">
                Add Skills Now <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ranking Algorithm</CardTitle>
          <CardDescription>
            How we calculate your ranking score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Our proprietary algorithm evaluates your profile holistically using:
          </p>
          
          <div className="bg-muted p-4 rounded-md font-mono text-xs overflow-auto">
            <pre>
{`// Pseudo code for our ranking algorithm
function calculateRank(candidate) {
  let score = 0;
  
  // Education score calculation
  score += calculateEducationScore(candidate.education);
  
  // Skills evaluation
  score += candidate.skills.reduce((total, skill) => {
    return total + (skill.level * 5 + skill.experience_years * 3);
  }, 0);
  
  // Experience impact
  score += candidate.experience.reduce((total, exp) => {
    const years = calculateYears(exp.startDate, exp.endDate);
    return total + (years * 20);
  }, 0);
  
  // Certifications boost
  score += candidate.certifications.length * 15;
  
  // Normalize to 0-100 scale
  return Math.min(100, score / 5);
}`}
            </pre>
          </div>
          
          <div className="mt-6 flex items-center text-muted-foreground text-sm">
            <Trophy className="h-4 w-4 mr-2 text-primary" />
            <span>Ranking updates daily and after every profile modification</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingExplanation;
