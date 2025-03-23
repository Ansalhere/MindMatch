
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Award, Book, Trophy, Briefcase, FileCheck } from "lucide-react";

const RankingExplanation = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How Rankings Work</CardTitle>
        <CardDescription>Understanding your score and how to improve it</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Your ranking is calculated based on multiple factors, with each contributing to your overall score. 
          Improve your ranking by updating your profile with the following:
        </p>
        
        <div className="space-y-5 mt-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Education</h3>
              <p className="text-sm text-muted-foreground">Higher tier colleges and better grades improve your ranking.</p>
              <Progress value={75} className="h-1.5 mt-2" />
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Certifications</h3>
              <p className="text-sm text-muted-foreground">Industry-recognized certifications boost your credibility.</p>
              <Progress value={60} className="h-1.5 mt-2" />
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <FileCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Platform Exams</h3>
              <p className="text-sm text-muted-foreground">Take our skill assessment exams to verify your expertise.</p>
              <Progress value={85} className="h-1.5 mt-2" />
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Work Experience</h3>
              <p className="text-sm text-muted-foreground">Quality and duration of relevant experience matters.</p>
              <Progress value={90} className="h-1.5 mt-2" />
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Book className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Projects & Portfolio</h3>
              <p className="text-sm text-muted-foreground">Showcasing real-world applications of your skills.</p>
              <Progress value={70} className="h-1.5 mt-2" />
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/30 p-4 rounded-lg mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Ranking Impact</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Higher rankings make your profile more visible to employers and increase your chances of being
            shortlisted for positions matching your skills.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RankingExplanation;
