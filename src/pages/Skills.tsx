import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Award, Target, TrendingUp, Code, Database, Palette, Settings } from 'lucide-react';

const Skills = () => {
  const skillCategories = [
    {
      name: "Frontend Development",
      icon: <Code className="h-5 w-5" />,
      skills: ["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "HTML/CSS"],
      color: "bg-blue-500"
    },
    {
      name: "Backend Development", 
      icon: <Database className="h-5 w-5" />,
      skills: ["Node.js", "Python", "Java", "C#", "PHP", "Ruby"],
      color: "bg-green-500"
    },
    {
      name: "Design & UI/UX",
      icon: <Palette className="h-5 w-5" />,
      skills: ["Figma", "Sketch", "Adobe XD", "Photoshop", "Illustrator", "Prototyping"],
      color: "bg-purple-500"
    },
    {
      name: "DevOps & Tools",
      icon: <Settings className="h-5 w-5" />,
      skills: ["Docker", "Kubernetes", "AWS", "Git", "CI/CD", "Linux"],
      color: "bg-orange-500"
    }
  ];

  const assessmentFeatures = [
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Skill Assessment",
      description: "Take comprehensive assessments to validate your technical skills and knowledge"
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Certification Tracking",
      description: "Track and showcase your professional certifications and achievements"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: "Progress Analytics",
      description: "Monitor your skill development progress with detailed analytics and insights"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Learning Resources",
      description: "Access curated learning materials and practice exercises for skill improvement"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Skills Assessment Platform</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Validate your technical skills, track your progress, and showcase your expertise to potential employers. 
            Our comprehensive assessment platform helps you stand out in the competitive job market.
          </p>
          <Button size="lg" className="mr-4">
            Start Assessment
          </Button>
          <Button variant="outline" size="lg">
            Browse Skills
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {assessmentFeatures.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Skills Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Popular Skill Categories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {skillCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color} text-white`}>
                      {category.icon}
                    </div>
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    Take Assessment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Assessment Process */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">How Our Assessment Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Choose Your Skills</h3>
                <p className="text-sm text-muted-foreground">
                  Select the technical skills you want to assess from our comprehensive list
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Take the Test</h3>
                <p className="text-sm text-muted-foreground">
                  Complete practical coding challenges and theoretical questions
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Get Certified</h3>
                <p className="text-sm text-muted-foreground">
                  Receive your skill certification and add it to your professional profile
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Assessment Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Assessment Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">React.js Proficiency</h4>
                <Progress value={85} className="mb-2" />
                <p className="text-sm text-muted-foreground">85% Complete - Expert Level</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">JavaScript Fundamentals</h4>
                <Progress value={92} className="mb-2" />
                <p className="text-sm text-muted-foreground">92% Complete - Expert Level</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Node.js Development</h4>
                <Progress value={73} className="mb-2" />
                <p className="text-sm text-muted-foreground">73% Complete - Advanced Level</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t">
              <Button className="w-full">
                Start Your Assessment Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Skills;