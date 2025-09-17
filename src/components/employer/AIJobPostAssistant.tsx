import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import { Sparkles, Wand2, RefreshCw } from 'lucide-react';
import { toast } from "sonner";

interface AIJobPostAssistantProps {
  onSuggestion: (suggestion: any) => void;
}

const AIJobPostAssistant = ({ onSuggestion }: AIJobPostAssistantProps) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any>(null);

  const generateJobPost = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe the role you want to post");
      return;
    }

    setLoading(true);
    try {
      // Simulate AI generation for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aiSuggestion = {
        jobTitle: extractTitle(prompt),
        description: generateDescription(prompt),
        requiredSkills: generateSkills(prompt),
        jobType: inferJobType(prompt),
        location: inferLocation(prompt),
        salary: generateSalaryRange(prompt),
        minExperience: inferExperience(prompt)
      };

      setSuggestions(aiSuggestion);
      toast.success("AI suggestions generated!");
    } catch (error) {
      toast.error("Failed to generate suggestions");
    } finally {
      setLoading(false);
    }
  };

  const extractTitle = (text: string): string => {
    const keywords = text.toLowerCase();
    if (keywords.includes('react') || keywords.includes('frontend')) return 'Senior React Developer';
    if (keywords.includes('backend') || keywords.includes('node')) return 'Backend Developer';
    if (keywords.includes('fullstack') || keywords.includes('full-stack')) return 'Full Stack Developer';
    if (keywords.includes('data scientist') || keywords.includes('ml')) return 'Data Scientist';
    if (keywords.includes('devops') || keywords.includes('cloud')) return 'DevOps Engineer';
    if (keywords.includes('designer') || keywords.includes('ui/ux')) return 'UI/UX Designer';
    if (keywords.includes('product manager')) return 'Product Manager';
    if (keywords.includes('sales')) return 'Sales Executive';
    if (keywords.includes('marketing')) return 'Marketing Specialist';
    return 'Software Developer';
  };

  const generateDescription = (text: string): string => {
    const title = extractTitle(text);
    return `We are seeking a talented ${title} to join our dynamic team. The ideal candidate will be responsible for developing high-quality applications, collaborating with cross-functional teams, and contributing to our innovative projects.

Key Responsibilities:
• Design and develop scalable applications
• Collaborate with product managers and designers
• Write clean, maintainable code
• Participate in code reviews and team meetings
• Stay updated with latest technologies and best practices

Requirements:
• Strong problem-solving skills
• Excellent communication abilities
• Experience with relevant technologies
• Ability to work in a fast-paced environment
• Passion for learning and growth

We offer competitive compensation, flexible working arrangements, and excellent growth opportunities in a collaborative environment.`;
  };

  const generateSkills = (text: string): string[] => {
    const keywords = text.toLowerCase();
    const skills: string[] = [];
    
    if (keywords.includes('react')) skills.push('React', 'JavaScript', 'HTML', 'CSS');
    if (keywords.includes('node')) skills.push('Node.js', 'Express', 'MongoDB');
    if (keywords.includes('python')) skills.push('Python', 'Django', 'Flask');
    if (keywords.includes('java')) skills.push('Java', 'Spring Boot', 'MySQL');
    if (keywords.includes('aws') || keywords.includes('cloud')) skills.push('AWS', 'Docker', 'Kubernetes');
    if (keywords.includes('data')) skills.push('Python', 'SQL', 'Machine Learning', 'Pandas');
    if (keywords.includes('design')) skills.push('Figma', 'Adobe Creative Suite', 'Prototyping');
    
    if (skills.length === 0) {
      skills.push('JavaScript', 'Git', 'Problem Solving', 'Communication');
    }
    
    return skills;
  };

  const inferJobType = (text: string): string => {
    const keywords = text.toLowerCase();
    if (keywords.includes('remote')) return 'remote';
    if (keywords.includes('part-time') || keywords.includes('part time')) return 'part-time';
    if (keywords.includes('contract') || keywords.includes('freelance')) return 'contract';
    if (keywords.includes('intern')) return 'internship';
    return 'full-time';
  };

  const inferLocation = (text: string): string => {
    const keywords = text.toLowerCase();
    if (keywords.includes('bangalore') || keywords.includes('bengaluru')) return 'Bangalore, India';
    if (keywords.includes('mumbai')) return 'Mumbai, India';
    if (keywords.includes('delhi')) return 'Delhi, India';
    if (keywords.includes('hyderabad')) return 'Hyderabad, India';
    if (keywords.includes('pune')) return 'Pune, India';
    if (keywords.includes('remote')) return 'Remote';
    return 'Bangalore, India';
  };

  const generateSalaryRange = (text: string): { min: string; max: string } => {
    const keywords = text.toLowerCase();
    if (keywords.includes('senior') || keywords.includes('lead')) {
      return { min: '1200000', max: '2000000' };
    }
    if (keywords.includes('junior') || keywords.includes('entry')) {
      return { min: '400000', max: '800000' };
    }
    return { min: '800000', max: '1500000' };
  };

  const inferExperience = (text: string): number => {
    const keywords = text.toLowerCase();
    if (keywords.includes('senior') || keywords.includes('lead')) return 5;
    if (keywords.includes('mid') || keywords.includes('intermediate')) return 3;
    if (keywords.includes('junior') || keywords.includes('entry') || keywords.includes('fresher')) return 0;
    return 2;
  };

  const applyAllSuggestions = () => {
    if (suggestions) {
      onSuggestion(suggestions);
      toast.success("AI suggestions applied to form!");
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Job Post Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="ai-prompt">Describe the role you want to post</Label>
          <Textarea
            id="ai-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., We need a senior React developer for our fintech startup, 5+ years experience, remote work available..."
            rows={3}
            className="mt-1"
          />
        </div>

        <Button 
          onClick={generateJobPost}
          disabled={loading || !prompt.trim()}
          className="w-full"
        >
          {loading ? (
            <Loader className="h-4 w-4 mr-2" />
          ) : (
            <Wand2 className="h-4 w-4 mr-2" />
          )}
          {loading ? 'Generating...' : 'Generate Job Post with AI'}
        </Button>

        {suggestions && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">AI Suggestions</h4>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={generateJobPost}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
                <Button size="sm" onClick={applyAllSuggestions}>
                  Apply All
                </Button>
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Title:</span> {suggestions.jobTitle}
              </div>
              
              <div>
                <span className="font-medium">Type:</span> 
                <Badge variant="outline" className="ml-2">{suggestions.jobType}</Badge>
              </div>
              
              <div>
                <span className="font-medium">Location:</span> {suggestions.location}
              </div>
              
              <div>
                <span className="font-medium">Experience:</span> {suggestions.minExperience}+ years
              </div>
              
              <div>
                <span className="font-medium">Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {suggestions.requiredSkills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="font-medium">Salary:</span> ₹{parseInt(suggestions.salary.min).toLocaleString()} - ₹{parseInt(suggestions.salary.max).toLocaleString()}
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSuggestions(null)}
              className="mt-3"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Clear Suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIJobPostAssistant;