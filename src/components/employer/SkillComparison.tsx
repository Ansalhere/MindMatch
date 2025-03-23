
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Laptop, Book, Trophy } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  skills: {
    name: string;
    score: number;
  }[];
  ranking: {
    overall: number;
    position: number;
    total: number;
  };
}

interface SkillComparisonProps {
  candidates: Candidate[];
}

const SkillComparison = ({ candidates }: SkillComparisonProps) => {
  const skills = ["React.js", "TypeScript", "UI/UX", "Node.js", "Python"];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Candidate Skill Comparison</CardTitle>
        <CardDescription>Compare skills across top candidates</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="skills">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="skills">By Skill</TabsTrigger>
            <TabsTrigger value="candidates">By Candidate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="skills" className="pt-4">
            {skills.map((skill) => (
              <div key={skill} className="mb-6 last:mb-0">
                <div className="flex items-center mb-2">
                  {skill === "React.js" && <Code className="h-4 w-4 mr-2 text-primary" />}
                  {skill === "TypeScript" && <Laptop className="h-4 w-4 mr-2 text-primary" />}
                  {skill === "UI/UX" && <Book className="h-4 w-4 mr-2 text-primary" />}
                  <h3 className="font-medium">{skill}</h3>
                </div>
                
                <div className="space-y-3">
                  {candidates.map((candidate) => {
                    const candidateSkill = candidate.skills.find(s => s.name === skill);
                    const score = candidateSkill ? candidateSkill.score : 0;
                    
                    return (
                      <div key={`${skill}-${candidate.id}`} className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{candidate.name}</span>
                          <div className="flex items-center">
                            <Badge variant="outline" className="mr-2 text-xs">
                              <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                              #{candidate.ranking.position}
                            </Badge>
                            <span className="text-sm font-medium">{score}%</span>
                          </div>
                        </div>
                        <Progress 
                          value={score} 
                          className="h-1.5" 
                          indicatorClassName={
                            score > 90 ? "bg-green-500" : 
                            score > 75 ? "bg-blue-500" : 
                            score > 60 ? "bg-yellow-500" : 
                            "bg-orange-500"
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="candidates" className="pt-4">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="mb-6 last:mb-0">
                <div className="flex items-center mb-2 justify-between">
                  <h3 className="font-medium">{candidate.name}</h3>
                  <Badge className="flex items-center">
                    <Trophy className="h-3 w-3 mr-1" />
                    Rank #{candidate.ranking.position}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {candidate.skills.map((skill) => (
                    <div key={`${candidate.id}-${skill.name}`} className="space-y-1">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          {skill.name === "React.js" && <Code className="h-4 w-4 mr-2 text-primary" />}
                          {skill.name === "TypeScript" && <Laptop className="h-4 w-4 mr-2 text-primary" />}
                          {skill.name === "UI/UX" && <Book className="h-4 w-4 mr-2 text-primary" />}
                          <span className="text-sm">{skill.name}</span>
                        </div>
                        <span className="text-sm font-medium">{skill.score}%</span>
                      </div>
                      <Progress 
                        value={skill.score} 
                        className="h-1.5" 
                        indicatorClassName={
                          skill.score > 90 ? "bg-green-500" : 
                          skill.score > 75 ? "bg-blue-500" : 
                          skill.score > 60 ? "bg-yellow-500" : 
                          "bg-orange-500"
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SkillComparison;
