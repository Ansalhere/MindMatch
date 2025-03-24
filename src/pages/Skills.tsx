
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Book, Code, Brain, Laptop } from 'lucide-react';
import { toast } from "sonner";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useUser } from '@/hooks/useUser';

const Skills = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  
  const skillCategories = [
    {
      title: "Technical Skills",
      description: "Assess coding and development abilities",
      icon: <Code className="h-5 w-5 text-blue-500" />,
      skills: ["JavaScript", "React", "TypeScript", "Node.js", "Python", "Java"]
    },
    {
      title: "Design Skills",
      description: "Evaluate UI/UX and visual design capabilities",
      icon: <Laptop className="h-5 w-5 text-purple-500" />,
      skills: ["UI Design", "UX Research", "Wireframing", "Design Systems", "Figma", "Adobe XD"]
    },
    {
      title: "Soft Skills",
      description: "Measure communication and teamwork",
      icon: <Brain className="h-5 w-5 text-green-500" />,
      skills: ["Communication", "Teamwork", "Problem Solving", "Time Management", "Leadership"]
    },
    {
      title: "Industry Knowledge",
      description: "Test domain-specific expertise",
      icon: <Book className="h-5 w-5 text-amber-500" />,
      skills: ["Marketing", "Finance", "Healthcare", "E-commerce", "Education", "Artificial Intelligence"]
    }
  ];

  const handleStartAssessment = (skill: string) => {
    if (!user) {
      toast.error("Please log in to take a skill assessment");
      navigate('/login');
      return;
    }
    
    setSelectedSkill(skill);
    toast.success(`${skill} assessment will be available soon!`);
  };

  const handleAddSkill = () => {
    if (!user) {
      toast.error("Please log in to add skills to your profile");
      navigate('/login');
      return;
    }
    
    navigate('/add-skill');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Skill Assessment Center</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Evaluate your skills, get certified, and improve your ranking on FresherPools
          </p>
        </div>
        
        {user && (
          <Card className="mb-8 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Your Skill Progress</h2>
                  <p className="text-muted-foreground mb-4">Complete assessments to improve your profile ranking</p>
                  <div className="flex items-center mb-2">
                    <Progress value={30} className="h-2 w-full max-w-md" />
                    <span className="ml-4 text-sm font-medium">30%</span>
                  </div>
                </div>
                <Button onClick={handleAddSkill}>
                  Add New Skill
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {skillCategories.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {category.icon}
                    <div className="ml-3">
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{category.skills.length} skills</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Button 
                      key={skillIndex} 
                      variant="outline" 
                      className="justify-start h-auto py-3"
                      onClick={() => handleStartAssessment(skill)}
                    >
                      <span className="truncate">{skill}</span>
                      <ArrowRight className="h-4 w-4 ml-auto" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>How Skill Assessments Work</CardTitle>
            <CardDescription>
              Our assessment process helps accurately measure and validate your skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Take Skill Tests</h3>
                  <p className="text-muted-foreground text-sm">
                    Complete assessments that evaluate your knowledge and practical abilities
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Get Verified Badges</h3>
                  <p className="text-muted-foreground text-sm">
                    Earn verification badges that appear on your profile for employers to see
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Improve Your Ranking</h3>
                  <p className="text-muted-foreground text-sm">
                    Each verified skill boosts your ranking in our candidate matching algorithm
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-primary/10 p-2 rounded-full mr-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Get Better Job Matches</h3>
                  <p className="text-muted-foreground text-sm">
                    Receive more accurate job recommendations based on your validated skills
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/ranking-explanation')}>
              Learn How Ranking Works
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Skills;
