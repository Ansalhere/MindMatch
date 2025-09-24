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
      // Enhanced rule-based generation for better accuracy
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiSuggestion = {
        jobTitle: inferJobTitle(prompt),
        description: generateDescription(prompt),
        requiredSkills: inferSkills(prompt),
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

  const inferJobTitle = (text: string): string => {
    const keywords = text.toLowerCase();
    
    // Check for seniority levels
    const isSenior = keywords.includes('senior') || keywords.includes('sr.') || keywords.includes('lead');
    const isJunior = keywords.includes('junior') || keywords.includes('jr.') || keywords.includes('entry');
    const isPrincipal = keywords.includes('principal') || keywords.includes('architect');
    
    // Check for specific roles
    if (keywords.includes('frontend') || keywords.includes('react') || keywords.includes('vue') || keywords.includes('angular')) {
      if (isPrincipal) return 'Principal Frontend Developer';
      if (isSenior) return 'Senior Frontend Developer';
      if (isJunior) return 'Junior Frontend Developer';
      return 'Frontend Developer';
    }
    if (keywords.includes('backend') || keywords.includes('node') || keywords.includes('python') || keywords.includes('java') || keywords.includes('api')) {
      if (isPrincipal) return 'Principal Backend Developer';
      if (isSenior) return 'Senior Backend Developer';
      if (isJunior) return 'Junior Backend Developer';
      return 'Backend Developer';
    }
    if (keywords.includes('fullstack') || keywords.includes('full stack') || keywords.includes('full-stack')) {
      if (isPrincipal) return 'Principal Full Stack Developer';
      if (isSenior) return 'Senior Full Stack Developer';
      if (isJunior) return 'Junior Full Stack Developer';
      return 'Full Stack Developer';
    }
    if (keywords.includes('data scientist') || keywords.includes('data science') || keywords.includes('ml') || keywords.includes('machine learning')) {
      if (isSenior) return 'Senior Data Scientist';
      return 'Data Scientist';
    }
    if (keywords.includes('product manager') || keywords.includes('pm')) {
      if (isSenior) return 'Senior Product Manager';
      return 'Product Manager';
    }
    if (keywords.includes('designer') || keywords.includes('ui/ux') || keywords.includes('design')) {
      if (isSenior) return 'Senior UI/UX Designer';
      return 'UI/UX Designer';
    }
    if (keywords.includes('devops') || keywords.includes('sre') || keywords.includes('infrastructure')) {
      if (isSenior) return 'Senior DevOps Engineer';
      return 'DevOps Engineer';
    }
    if (keywords.includes('qa') || keywords.includes('test') || keywords.includes('quality assurance')) {
      if (isSenior) return 'Senior QA Engineer';
      return 'QA Engineer';
    }
    if (keywords.includes('mobile') || keywords.includes('android') || keywords.includes('ios') || keywords.includes('react native')) {
      if (isSenior) return 'Senior Mobile Developer';
      return 'Mobile Developer';
    }
    
    return isSenior ? 'Senior Software Developer' : 'Software Developer';
  };

  const generateDescription = (text: string): string => {
    const role = inferJobTitle(text);
    const skills = inferSkills(text).slice(0, 5);
    const experience = inferExperience(text);
    const department = inferDepartment(text);
    const workLocation = inferWorkLocation(text);
    
    const experienceText = experience === '0' ? 'Fresh graduates and entry-level candidates' : `${experience}+ years of professional experience`;
    const locationText = workLocation === 'remote' ? 'remote-first environment' : workLocation === 'hybrid' ? 'flexible hybrid setup' : 'collaborative office environment';
    
    return `We are seeking a skilled ${role} to join our dynamic ${department} team in a ${locationText}.

🚀 What You'll Do:
• Design and develop scalable software solutions
• Collaborate with product managers, designers, and engineers
• Write clean, efficient, and well-documented code
• Participate in code reviews and technical architecture discussions
• Contribute to best practices and team knowledge sharing

💼 What We're Looking For:
• ${experienceText} in software development
• Strong expertise in ${skills.slice(0, 3).join(', ')}${skills.length > 3 ? ` and ${skills.slice(3).join(', ')}` : ''}
• Proven track record of delivering high-quality software
• Excellent problem-solving and analytical skills
• Strong communication and teamwork abilities
• Passion for learning new technologies

🎯 What We Offer:
• Competitive compensation package
• Health and wellness benefits
• Professional development opportunities
• ${workLocation === 'remote' ? 'Fully remote work flexibility' : workLocation === 'hybrid' ? 'Flexible hybrid work arrangement' : 'Modern office facilities'}
• Collaborative and inclusive work culture
• Cutting-edge technology and tools`;
  };

  const inferSkills = (text: string): string[] => {
    const keywords = text.toLowerCase();
    const skills: string[] = [];
    
    // Frontend Technologies
    if (keywords.includes('react')) skills.push('React');
    if (keywords.includes('angular')) skills.push('Angular');
    if (keywords.includes('vue')) skills.push('Vue.js');
    if (keywords.includes('svelte')) skills.push('Svelte');
    if (keywords.includes('next') || keywords.includes('nextjs')) skills.push('Next.js');
    if (keywords.includes('nuxt')) skills.push('Nuxt.js');
    if (keywords.includes('html')) skills.push('HTML5');
    if (keywords.includes('css')) skills.push('CSS3');
    if (keywords.includes('sass') || keywords.includes('scss')) skills.push('Sass/SCSS');
    if (keywords.includes('tailwind')) skills.push('Tailwind CSS');
    if (keywords.includes('bootstrap')) skills.push('Bootstrap');
    if (keywords.includes('material') && keywords.includes('ui')) skills.push('Material-UI');
    
    // Programming Languages
    if (keywords.includes('javascript') || keywords.includes('js')) skills.push('JavaScript');
    if (keywords.includes('typescript') || keywords.includes('ts')) skills.push('TypeScript');
    if (keywords.includes('python')) skills.push('Python');
    if (keywords.includes('java') && !keywords.includes('javascript')) skills.push('Java');
    if (keywords.includes('c#') || keywords.includes('csharp')) skills.push('C#');
    if (keywords.includes('php')) skills.push('PHP');
    if (keywords.includes('ruby')) skills.push('Ruby');
    if (keywords.includes('go') || keywords.includes('golang')) skills.push('Go');
    if (keywords.includes('rust')) skills.push('Rust');
    if (keywords.includes('swift')) skills.push('Swift');
    if (keywords.includes('kotlin')) skills.push('Kotlin');
    
    // Backend Technologies
    if (keywords.includes('node') || keywords.includes('nodejs')) skills.push('Node.js');
    if (keywords.includes('express')) skills.push('Express.js');
    if (keywords.includes('fastify')) skills.push('Fastify');
    if (keywords.includes('django')) skills.push('Django');
    if (keywords.includes('flask')) skills.push('Flask');
    if (keywords.includes('fastapi')) skills.push('FastAPI');
    if (keywords.includes('spring')) skills.push('Spring Boot');
    if (keywords.includes('laravel')) skills.push('Laravel');
    if (keywords.includes('rails')) skills.push('Ruby on Rails');
    if (keywords.includes('.net')) skills.push('.NET');
    
    // Databases
    if (keywords.includes('mongodb') || keywords.includes('mongo')) skills.push('MongoDB');
    if (keywords.includes('mysql')) skills.push('MySQL');
    if (keywords.includes('postgresql') || keywords.includes('postgres')) skills.push('PostgreSQL');
    if (keywords.includes('redis')) skills.push('Redis');
    if (keywords.includes('elasticsearch')) skills.push('Elasticsearch');
    if (keywords.includes('sqlite')) skills.push('SQLite');
    if (keywords.includes('oracle')) skills.push('Oracle Database');
    if (keywords.includes('dynamodb')) skills.push('DynamoDB');
    if (keywords.includes('cassandra')) skills.push('Apache Cassandra');
    
    // Cloud Platforms
    if (keywords.includes('aws')) skills.push('AWS');
    if (keywords.includes('azure')) skills.push('Microsoft Azure');
    if (keywords.includes('gcp') || keywords.includes('google cloud')) skills.push('Google Cloud Platform');
    if (keywords.includes('vercel')) skills.push('Vercel');
    if (keywords.includes('netlify')) skills.push('Netlify');
    if (keywords.includes('heroku')) skills.push('Heroku');
    
    // DevOps & Tools
    if (keywords.includes('docker')) skills.push('Docker');
    if (keywords.includes('kubernetes') || keywords.includes('k8s')) skills.push('Kubernetes');
    if (keywords.includes('terraform')) skills.push('Terraform');
    if (keywords.includes('jenkins')) skills.push('Jenkins');
    if (keywords.includes('github actions')) skills.push('GitHub Actions');
    if (keywords.includes('gitlab ci')) skills.push('GitLab CI/CD');
    if (keywords.includes('ansible')) skills.push('Ansible');
    
    // APIs & Architecture
    if (keywords.includes('rest') || keywords.includes('restful')) skills.push('REST APIs');
    if (keywords.includes('graphql')) skills.push('GraphQL');
    if (keywords.includes('grpc')) skills.push('gRPC');
    if (keywords.includes('microservices')) skills.push('Microservices Architecture');
    if (keywords.includes('serverless')) skills.push('Serverless');
    if (keywords.includes('websockets')) skills.push('WebSockets');
    
    // Testing
    if (keywords.includes('jest')) skills.push('Jest');
    if (keywords.includes('cypress')) skills.push('Cypress');
    if (keywords.includes('selenium')) skills.push('Selenium');
    if (keywords.includes('playwright')) skills.push('Playwright');
    if (keywords.includes('unit test')) skills.push('Unit Testing');
    
    // Version Control & Collaboration
    if (keywords.includes('git')) skills.push('Git');
    if (keywords.includes('github')) skills.push('GitHub');
    if (keywords.includes('gitlab')) skills.push('GitLab');
    if (keywords.includes('bitbucket')) skills.push('Bitbucket');
    
    // Mobile Development
    if (keywords.includes('react native')) skills.push('React Native');
    if (keywords.includes('flutter')) skills.push('Flutter');
    if (keywords.includes('android')) skills.push('Android Development');
    if (keywords.includes('ios')) skills.push('iOS Development');
    
    // Data Science & AI
    if (keywords.includes('machine learning') || keywords.includes('ml')) skills.push('Machine Learning');
    if (keywords.includes('artificial intelligence') || keywords.includes('ai')) skills.push('Artificial Intelligence');
    if (keywords.includes('tensorflow')) skills.push('TensorFlow');
    if (keywords.includes('pytorch')) skills.push('PyTorch');
    if (keywords.includes('pandas')) skills.push('Pandas');
    if (keywords.includes('numpy')) skills.push('NumPy');
    if (keywords.includes('scikit')) skills.push('Scikit-learn');
    
    // Methodologies
    if (keywords.includes('agile')) skills.push('Agile');
    if (keywords.includes('scrum')) skills.push('Scrum');
    if (keywords.includes('kanban')) skills.push('Kanban');
    if (keywords.includes('tdd')) skills.push('Test-Driven Development');
    if (keywords.includes('ci/cd')) skills.push('CI/CD');
    
    // If no specific skills found, add defaults based on role type
    if (skills.length === 0) {
      if (keywords.includes('frontend')) {
        skills.push('JavaScript', 'React', 'HTML5', 'CSS3', 'TypeScript');
      } else if (keywords.includes('backend')) {
        skills.push('Node.js', 'Python', 'PostgreSQL', 'REST APIs', 'Docker');
      } else if (keywords.includes('fullstack') || keywords.includes('full stack')) {
        skills.push('JavaScript', 'React', 'Node.js', 'PostgreSQL', 'TypeScript');
      } else if (keywords.includes('data')) {
        skills.push('Python', 'SQL', 'Machine Learning', 'Pandas', 'NumPy');
      } else if (keywords.includes('devops')) {
        skills.push('Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD');
      } else if (keywords.includes('mobile')) {
        skills.push('React Native', 'JavaScript', 'Mobile Development', 'API Integration');
      } else {
        skills.push('JavaScript', 'HTML5', 'CSS3', 'Git');
      }
    }
    
    return [...new Set(skills)].slice(0, 8); // Remove duplicates and limit to 8 skills
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
    return 'none'; // No max limit
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
                {suggestions.maxExperience && suggestions.maxExperience !== 'none' && ` (max ${suggestions.maxExperience} years)`}
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