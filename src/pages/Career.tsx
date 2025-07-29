import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Users, 
  Trophy, 
  Target,
  TrendingUp,
  MessageCircle,
  Calendar,
  Download
} from 'lucide-react';

const Career = () => {
  const resourceCategories = [
    {
      title: "Resume & Portfolio",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-blue-500",
      resources: [
        "ATS-Optimized Resume Templates",
        "Portfolio Building Guide",
        "Cover Letter Templates",
        "LinkedIn Profile Optimization"
      ]
    },
    {
      title: "Interview Preparation",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "bg-green-500", 
      resources: [
        "Technical Interview Questions",
        "Behavioral Interview Guide",
        "Mock Interview Sessions",
        "Salary Negotiation Tips"
      ]
    },
    {
      title: "Skill Development",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-purple-500",
      resources: [
        "Learning Roadmaps",
        "Certification Guides",
        "Practice Projects",
        "Mentorship Programs"
      ]
    },
    {
      title: "Career Planning",
      icon: <Target className="h-6 w-6" />,
      color: "bg-orange-500",
      resources: [
        "Career Path Explorer",
        "Goal Setting Framework",
        "Industry Insights",
        "Networking Strategies"
      ]
    }
  ];

  const featuredResources = [
    {
      type: "Guide",
      title: "The Complete Tech Career Roadmap 2024",
      description: "A comprehensive 50-page guide covering every aspect of building a successful tech career",
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      downloadCount: "15.2k",
      rating: 4.9,
      tags: ["Career Planning", "Tech Industry", "Roadmap"]
    },
    {
      type: "Template",
      title: "Software Engineer Resume Templates",
      description: "Professional resume templates optimized for ATS and designed by hiring managers",
      icon: <FileText className="h-8 w-8 text-green-500" />,
      downloadCount: "8.7k", 
      rating: 4.8,
      tags: ["Resume", "Templates", "ATS-Optimized"]
    },
    {
      type: "Course",
      title: "Master Technical Interviews",
      description: "Complete video course covering coding interviews, system design, and behavioral questions",
      icon: <Video className="h-8 w-8 text-purple-500" />,
      downloadCount: "12.1k",
      rating: 4.9,
      tags: ["Interview Prep", "Video Course", "Coding"]
    }
  ];

  const upcomingEvents = [
    {
      title: "Career Fair: Top Tech Companies",
      date: "March 15, 2024",
      time: "10:00 AM - 4:00 PM",
      type: "Virtual Event",
      attendees: "500+ attendees"
    },
    {
      title: "Resume Review Workshop",
      date: "March 20, 2024", 
      time: "2:00 PM - 3:30 PM",
      type: "Workshop",
      attendees: "50 spots available"
    },
    {
      title: "Mock Interview Sessions",
      date: "March 25, 2024",
      time: "1:00 PM - 5:00 PM", 
      type: "1-on-1 Sessions",
      attendees: "Limited slots"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Career Resources</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Everything you need to advance your tech career. From resume templates to interview prep, 
            we've got comprehensive resources to help you succeed at every stage of your career journey.
          </p>
          <Button size="lg" className="mr-4">
            Browse All Resources
          </Button>
          <Button variant="outline" size="lg">
            Join Community
          </Button>
        </div>

        {/* Resource Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {resourceCategories.map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className={`w-12 h-12 ${category.color} text-white rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  {category.icon}
                </div>
                <CardTitle className="text-lg">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.resources.map((resource, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                      {resource}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full mt-4">
                  Explore Resources
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Resources */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Resources</h2>
          <div className="grid lg:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {resource.icon}
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-2">{resource.type}</Badge>
                      <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span className="text-sm">{resource.downloadCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{resource.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Access Resource
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div>{event.date}</div>
                    <div>{event.time}</div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {event.attendees}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-primary/5">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated with Career Tips</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get weekly career insights, new resource releases, and exclusive tips delivered to your inbox.
              Join 25,000+ professionals who trust our career guidance.
            </p>
            <div className="flex max-w-md mx-auto gap-3">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Career;