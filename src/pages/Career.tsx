
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Book, Video, Download, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Career = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Career Resources</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Valuable resources to help you navigate your career journey and land your dream job
          </p>
        </div>
        
        <Tabs defaultValue="guides" className="mb-10">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="guides">Career Guides</TabsTrigger>
            <TabsTrigger value="templates">Resume Templates</TabsTrigger>
            <TabsTrigger value="interviews">Interview Prep</TabsTrigger>
            <TabsTrigger value="courses">Free Courses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "The Complete Guide to Job Hunting",
                  description: "Step-by-step instructions for finding and landing your ideal job",
                  icon: <FileText className="h-8 w-8 text-blue-500" />
                },
                {
                  title: "Networking for Introverts",
                  description: "Build professional connections even if you're not naturally outgoing",
                  icon: <FileText className="h-8 w-8 text-purple-500" />
                },
                {
                  title: "Salary Negotiation Strategies",
                  description: "Get the compensation you deserve with these proven tactics",
                  icon: <FileText className="h-8 w-8 text-green-500" />
                },
                {
                  title: "First 90 Days in a New Job",
                  description: "How to make a great impression and set yourself up for success",
                  icon: <FileText className="h-8 w-8 text-yellow-500" />
                },
                {
                  title: "Career Change Playbook",
                  description: "Successfully transition to a new field or industry",
                  icon: <FileText className="h-8 w-8 text-red-500" />
                },
                {
                  title: "Remote Work Success",
                  description: "Strategies for productivity and advancement in remote positions",
                  icon: <FileText className="h-8 w-8 text-teal-500" />
                }
              ].map((guide, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="mb-2">{guide.icon}</div>
                    <CardTitle>{guide.title}</CardTitle>
                    <CardDescription>{guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Modern Professional",
                  description: "Clean, professional design for corporate settings",
                  preview: "/placeholder.svg"
                },
                {
                  title: "Creative Portfolio",
                  description: "Eye-catching layout for design and creative roles",
                  preview: "/placeholder.svg"
                },
                {
                  title: "Technical Specialist",
                  description: "Optimized for technical roles with skills emphasis",
                  preview: "/placeholder.svg"
                },
                {
                  title: "Executive Brief",
                  description: "Concise format for senior leadership positions",
                  preview: "/placeholder.svg"
                },
                {
                  title: "Entry Level Graduate",
                  description: "Perfect for new graduates with limited experience",
                  preview: "/placeholder.svg"
                },
                {
                  title: "Career Changer",
                  description: "Highlighting transferable skills for industry switches",
                  preview: "/placeholder.svg"
                }
              ].map((template, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="aspect-[4/5] rounded-md bg-muted mb-3">
                      <img 
                        src={template.preview} 
                        alt={template.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle>{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="interviews" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Common Interview Questions & Answers",
                  description: "Prepare for standard questions across industries",
                  type: "Guide",
                  icon: <Book className="h-6 w-6 text-blue-500" />
                },
                {
                  title: "Technical Interview Walkthrough",
                  description: "What to expect in coding and technical assessments",
                  type: "Video",
                  icon: <Video className="h-6 w-6 text-red-500" />
                },
                {
                  title: "Behavioral Interview Success",
                  description: "Using the STAR method effectively",
                  type: "Guide",
                  icon: <Book className="h-6 w-6 text-green-500" />
                },
                {
                  title: "Live Mock Interview Examples",
                  description: "Watch real candidates in practice interviews",
                  type: "Video",
                  icon: <Video className="h-6 w-6 text-red-500" />
                }
              ].map((resource, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{resource.title}</CardTitle>
                      <div className="flex items-center bg-muted px-2 py-1 rounded-full text-xs">
                        {resource.icon}
                        <span className="ml-1">{resource.type}</span>
                      </div>
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      {resource.type === "Guide" ? (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Download Guide
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Watch Video
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="courses" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Web Development Fundamentals",
                  description: "Learn HTML, CSS, and JavaScript basics",
                  duration: "4 weeks",
                  level: "Beginner"
                },
                {
                  title: "Data Science Essentials",
                  description: "Introduction to data analysis and visualization",
                  duration: "6 weeks",
                  level: "Intermediate"
                },
                {
                  title: "UX Design Principles",
                  description: "Create user-friendly digital experiences",
                  duration: "3 weeks",
                  level: "Beginner"
                },
                {
                  title: "Project Management Fundamentals",
                  description: "Learn to lead projects effectively",
                  duration: "5 weeks",
                  level: "Beginner"
                }
              ].map((course, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm mb-4">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Duration:</span>
                        <span className="text-muted-foreground">{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">Level:</span>
                        <span className="text-muted-foreground">{course.level}</span>
                      </div>
                    </div>
                    <Button className="w-full">Enroll Now (Free)</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Career;
