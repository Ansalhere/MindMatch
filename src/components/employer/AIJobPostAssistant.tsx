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
        workLocation: inferWorkLocation(prompt),
        location: inferLocation(prompt),
        salary: generateSalaryRange(prompt),
        minExperience: inferExperience(prompt),
        maxExperience: inferMaxExperience(prompt),
        department: inferDepartment(prompt)
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
    const hasLevel = keywords.includes('senior') ? 'Senior ' : 
                    keywords.includes('lead') ? 'Lead ' : 
                    keywords.includes('junior') ? 'Junior ' :
                    keywords.includes('principal') ? 'Principal ' : '';
    
    if (keywords.includes('react') || keywords.includes('frontend')) return `${hasLevel}Frontend Developer`;
    if (keywords.includes('backend') || keywords.includes('node')) return `${hasLevel}Backend Developer`;
    if (keywords.includes('fullstack') || keywords.includes('full-stack')) return `${hasLevel}Full Stack Developer`;
    if (keywords.includes('data scientist') || keywords.includes('ml') || keywords.includes('machine learning')) return `${hasLevel}Data Scientist`;
    if (keywords.includes('devops') || keywords.includes('cloud') || keywords.includes('aws')) return `${hasLevel}DevOps Engineer`;
    if (keywords.includes('designer') || keywords.includes('ui/ux') || keywords.includes('design')) return `${hasLevel}UI/UX Designer`;
    if (keywords.includes('product manager') || keywords.includes('pm')) return `${hasLevel}Product Manager`;
    if (keywords.includes('sales')) return `${hasLevel}Sales Executive`;
    if (keywords.includes('marketing')) return `${hasLevel}Marketing Specialist`;
    if (keywords.includes('qa') || keywords.includes('test')) return `${hasLevel}QA Engineer`;
    if (keywords.includes('mobile') || keywords.includes('ios') || keywords.includes('android')) return `${hasLevel}Mobile Developer`;
    return `${hasLevel}Software Developer`.trim();
  };

  const generateDescription = (text: string): string => {
    const title = extractTitle(text);
    const keywords = text.toLowerCase();
    
    let responsibilities = "• Design and develop scalable applications\n• Collaborate with product managers and designers\n• Write clean, maintainable code\n• Participate in code reviews and team meetings";
    let requirements = "• Strong problem-solving skills\n• Excellent communication abilities\n• Experience with relevant technologies\n• Ability to work in a fast-paced environment";
    
    if (keywords.includes('frontend') || keywords.includes('react')) {
      responsibilities += "\n• Build responsive user interfaces\n• Optimize application performance\n• Implement modern frontend architectures";
      requirements += "\n• Proficiency in React, JavaScript, HTML, CSS\n• Experience with state management libraries\n• Knowledge of responsive design principles";
    }
    
    if (keywords.includes('backend') || keywords.includes('api')) {
      responsibilities += "\n• Design and implement RESTful APIs\n• Manage database operations and optimization\n• Ensure application security and scalability";
      requirements += "\n• Experience with server-side technologies\n• Database design and management skills\n• Understanding of security best practices";
    }
    
    if (keywords.includes('remote')) {
      requirements += "\n• Excellent remote communication skills\n• Self-motivated and independent worker";
    }
    
    return `We are seeking a talented ${title} to join our dynamic team. The ideal candidate will be responsible for developing high-quality applications, collaborating with cross-functional teams, and contributing to our innovative projects.

Key Responsibilities:
${responsibilities}
• Stay updated with latest technologies and best practices

Requirements:
${requirements}
• Passion for learning and growth

We offer competitive compensation, flexible working arrangements, and excellent growth opportunities in a collaborative environment.`;
  };

  const generateSkills = (text: string): string[] => {
    const keywords = text.toLowerCase();
    const skills: string[] = [];
    
    // Core tech skills
    if (keywords.includes('react')) skills.push('React', 'JavaScript', 'HTML', 'CSS', 'TypeScript');
    if (keywords.includes('angular')) skills.push('Angular', 'TypeScript', 'RxJS');
    if (keywords.includes('vue')) skills.push('Vue.js', 'JavaScript', 'HTML', 'CSS');
    if (keywords.includes('node')) skills.push('Node.js', 'Express', 'MongoDB', 'REST APIs');
    if (keywords.includes('python')) skills.push('Python', 'Django', 'Flask', 'PostgreSQL');
    if (keywords.includes('java')) skills.push('Java', 'Spring Boot', 'MySQL', 'Hibernate');
    if (keywords.includes('dotnet') || keywords.includes('.net')) skills.push('.NET', 'C#', 'SQL Server');
    if (keywords.includes('php')) skills.push('PHP', 'Laravel', 'MySQL');
    
    // Cloud & DevOps
    if (keywords.includes('aws') || keywords.includes('cloud')) skills.push('AWS', 'Docker', 'Kubernetes');
    if (keywords.includes('azure')) skills.push('Azure', 'Docker', 'CI/CD');
    if (keywords.includes('gcp') || keywords.includes('google cloud')) skills.push('Google Cloud', 'Docker');
    if (keywords.includes('devops')) skills.push('Docker', 'Kubernetes', 'Jenkins', 'Git');
    
    // Data & ML
    if (keywords.includes('data') || keywords.includes('analytics')) skills.push('Python', 'SQL', 'Pandas', 'NumPy');
    if (keywords.includes('machine learning') || keywords.includes('ml')) skills.push('Python', 'TensorFlow', 'PyTorch', 'Scikit-learn');
    
    // Mobile
    if (keywords.includes('mobile') || keywords.includes('ios')) skills.push('Swift', 'iOS Development', 'Xcode');
    if (keywords.includes('android')) skills.push('Kotlin', 'Android Development', 'Android Studio');
    if (keywords.includes('react native')) skills.push('React Native', 'JavaScript', 'Mobile Development');
    if (keywords.includes('flutter')) skills.push('Flutter', 'Dart', 'Mobile Development');
    
    // Design
    if (keywords.includes('design') || keywords.includes('ui/ux')) skills.push('Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research');
    
    // QA
    if (keywords.includes('qa') || keywords.includes('test')) skills.push('Test Automation', 'Selenium', 'Jest', 'Cypress');
    
    // Always add core skills
    if (!skills.includes('Git')) skills.push('Git');
    if (skills.length === 0) {
      skills.push('JavaScript', 'Git', 'Problem Solving', 'Communication');
    }
    
    return [...new Set(skills)]; // Remove duplicates
  };

  const inferJobType = (text: string): string => {
    const keywords = text.toLowerCase();
    if (keywords.includes('part-time') || keywords.includes('part time')) return 'part-time';
    if (keywords.includes('contract') || keywords.includes('freelance')) return 'contract';
    if (keywords.includes('intern')) return 'internship';
    return 'full-time';
  };
  
  const inferWorkLocation = (text: string): string => {
    const keywords = text.toLowerCase();
    if (keywords.includes('remote')) return 'remote';
    if (keywords.includes('hybrid')) return 'hybrid';
    return 'on-site';
  };
  
  const inferDepartment = (text: string): string => {
    const keywords = text.toLowerCase();
    if (keywords.includes('frontend') || keywords.includes('backend') || keywords.includes('fullstack') || keywords.includes('devops')) return 'Engineering';
    if (keywords.includes('design') || keywords.includes('ui/ux')) return 'Design';
    if (keywords.includes('product manager')) return 'Product';
    if (keywords.includes('sales')) return 'Sales';
    if (keywords.includes('marketing')) return 'Marketing';
    if (keywords.includes('data') || keywords.includes('analytics')) return 'Data Science';
    if (keywords.includes('qa') || keywords.includes('test')) return 'Quality Assurance';
    return 'Technology';
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

  const generateSalaryRange = (text: string): { min: string; max: string } | null => {
    const keywords = text.toLowerCase();
    if (keywords.includes('not specified') || keywords.includes('competitive') || keywords.includes('negotiable')) {
      return null; // No salary specified
    }
    if (keywords.includes('senior') || keywords.includes('lead') || keywords.includes('principal')) {
      return { min: '1200000', max: '2500000' };
    }
    if (keywords.includes('junior') || keywords.includes('entry') || keywords.includes('fresher')) {
      return { min: '300000', max: '600000' };
    }
    if (keywords.includes('mid') || keywords.includes('intermediate')) {
      return { min: '600000', max: '1200000' };
    }
    return { min: '500000', max: '1000000' };
  };

  const inferExperience = (text: string): string => {
    const keywords = text.toLowerCase();
    if (keywords.includes('senior') || keywords.includes('lead')) return '5';
    if (keywords.includes('principal') || keywords.includes('architect')) return '8';
    if (keywords.includes('mid') || keywords.includes('intermediate')) return '3';
    if (keywords.includes('junior') || keywords.includes('entry') || keywords.includes('fresher')) return '0';
    // Look for specific years mentioned
    const yearMatch = keywords.match(/(\d+)\+?\s*years?/);
    if (yearMatch) return yearMatch[1];
    return '2';
  };
  
  const inferMaxExperience = (text: string): string => {
    const keywords = text.toLowerCase();
    if (keywords.includes('junior') || keywords.includes('entry')) return '3';
    if (keywords.includes('mid') || keywords.includes('intermediate')) return '7';
    // Look for experience ranges like "3-5 years"
    const rangeMatch = keywords.match(/(\d+)[-to]+(\d+)\s*years?/);
    if (rangeMatch) return rangeMatch[2];
    return ''; // No max limit
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
                <span className="font-medium">Department:</span> {suggestions.department}
              </div>
              
              <div className="flex gap-4">
                <div>
                  <span className="font-medium">Type:</span> 
                  <Badge variant="outline" className="ml-2">{suggestions.jobType}</Badge>
                </div>
                <div>
                  <span className="font-medium">Work:</span> 
                  <Badge variant="outline" className="ml-2">{suggestions.workLocation}</Badge>
                </div>
              </div>
              
              <div>
                <span className="font-medium">Location:</span> {suggestions.location}
              </div>
              
              <div>
                <span className="font-medium">Experience:</span> 
                {suggestions.minExperience === '0' ? 'Fresher' : `${suggestions.minExperience}+ years`}
                {suggestions.maxExperience && ` (max ${suggestions.maxExperience} years)`}
              </div>
              
              <div>
                <span className="font-medium">Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {suggestions.requiredSkills.slice(0, 8).map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {suggestions.requiredSkills.length > 8 && (
                    <Badge variant="outline" className="text-xs">
                      +{suggestions.requiredSkills.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <span className="font-medium">Salary:</span> 
                {suggestions.salary ? (
                  `₹${parseInt(suggestions.salary.min).toLocaleString()} - ₹${parseInt(suggestions.salary.max).toLocaleString()}`
                ) : (
                  <Badge variant="outline" className="ml-2">Not Specified</Badge>
                )}
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