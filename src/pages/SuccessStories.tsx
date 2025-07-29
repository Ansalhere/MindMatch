import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote, MapPin, Building, TrendingUp, Users, Target } from 'lucide-react';

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=5",
      title: "Software Engineer at Google",
      previousRole: "Junior Developer",
      location: "San Francisco, CA",
      company: "Google",
      rankImprovement: "45 → 98",
      timeframe: "6 months",
      story: "RankMe.AI helped me identify my skill gaps and provided a clear roadmap for improvement. The personalized recommendations and skill assessments were game-changers in landing my dream job at Google.",
      skills: ["React", "Python", "System Design", "Algorithms"],
      quote: "The platform's ranking system gave me the confidence to apply for senior positions I never thought I was ready for."
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=3",
      title: "Senior Data Scientist at Netflix",
      previousRole: "Data Analyst",
      location: "Los Angeles, CA", 
      company: "Netflix",
      rankImprovement: "62 → 94",
      timeframe: "8 months",
      story: "Starting as a data analyst, I used RankMe.AI to systematically build my machine learning and data science skills. The skill verification feature helped me prove my expertise to recruiters.",
      skills: ["Machine Learning", "Python", "TensorFlow", "Statistics"],
      quote: "RankMe.AI didn't just help me get a job - it helped me find my career path and excel in it."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=9",
      title: "UX Design Lead at Airbnb",
      previousRole: "Freelance Designer",
      location: "Austin, TX",
      company: "Airbnb",
      rankImprovement: "38 → 89",
      timeframe: "4 months",
      story: "As a freelancer, I struggled to showcase my skills effectively. RankMe.AI's portfolio integration and skill verification helped me transition to a full-time leadership role at Airbnb.",
      skills: ["UI/UX Design", "Figma", "User Research", "Prototyping"],
      quote: "The platform transformed how I present my skills and opened doors I never knew existed."
    },
    {
      id: 4,
      name: "David Park",
      avatar: "https://i.pravatar.cc/150?img=7",
      title: "DevOps Engineer at Amazon",
      previousRole: "System Administrator",
      location: "Seattle, WA",
      company: "Amazon",
      rankImprovement: "51 → 92",
      timeframe: "5 months",
      story: "I wanted to transition from traditional IT to cloud technologies. RankMe.AI's learning paths and skill assessments helped me master AWS and Kubernetes, leading to my role at Amazon.",
      skills: ["AWS", "Kubernetes", "Docker", "Terraform"],
      quote: "The structured approach to skill development made my career transition smooth and successful."
    }
  ];

  const stats = [
    { icon: <Users className="h-6 w-6" />, value: "50,000+", label: "Success Stories" },
    { icon: <TrendingUp className="h-6 w-6" />, value: "85%", label: "Salary Increase" },
    { icon: <Target className="h-6 w-6" />, value: "92%", label: "Job Match Rate" },
    { icon: <Building className="h-6 w-6" />, value: "500+", label: "Partner Companies" }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover how professionals like you have transformed their careers using RankMe.AI. 
            From skill development to landing dream jobs, these are real stories of success.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3 text-primary">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Success Stories */}
        <div className="space-y-8">
          {stories.map((story) => (
            <Card key={story.id} className="overflow-hidden">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Profile Section */}
                  <div className="text-center md:text-left">
                    <Avatar className="w-24 h-24 mx-auto md:mx-0 mb-4">
                      <AvatarImage src={story.avatar} />
                      <AvatarFallback>{story.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold mb-1">{story.name}</h3>
                    <p className="text-primary font-semibold mb-2">{story.title}</p>
                    <div className="flex items-center justify-center md:justify-start text-sm text-muted-foreground mb-2">
                      <Building className="h-4 w-4 mr-1" />
                      {story.company}
                    </div>
                    <div className="flex items-center justify-center md:justify-start text-sm text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      {story.location}
                    </div>
                    
                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 justify-center md:justify-start mb-4">
                      {story.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Rank Improvement */}
                    <div className="bg-primary/10 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-1">Rank Improvement</div>
                      <div className="text-lg font-bold text-primary">{story.rankImprovement}</div>
                      <div className="text-xs text-muted-foreground">in {story.timeframe}</div>
                    </div>
                  </div>
                  
                  {/* Story Content */}
                  <div className="md:col-span-2">
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-2">Journey: {story.previousRole} → {story.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {story.story}
                      </p>
                    </div>
                    
                    {/* Quote */}
                    <div className="bg-muted rounded-lg p-6 relative">
                      <Quote className="h-8 w-8 text-primary/20 absolute top-4 left-4" />
                      <blockquote className="text-lg italic text-foreground ml-6">
                        "{story.quote}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 bg-primary/5 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their careers with RankMe.AI. 
            Start your journey today and become our next success story.
          </p>
          <div className="space-x-4">
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg font-semibold transition-colors">
              Get Started Free
            </button>
            <button className="border border-border hover:bg-muted px-6 py-3 rounded-lg font-semibold transition-colors">
              View More Stories
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessStories;