
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Briefcase, ChevronUp, Book, Code, Laptop, Award, CheckCircle, Clock, X } from 'lucide-react';

const Dashboard = () => {
  const [userType, setUserType] = useState("candidate");
  
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>+ {userType === "candidate" ? "Add Skill" : "Post Job"}</Button>
      </div>
      
      {/* Example Dashboard for Candidates */}
      {userType === "candidate" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold">75%</span>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">Complete Profile</Button>
                </div>
                <Progress value={75} className="h-2" />
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Applications Sent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold">12</span>
                  <div className="text-xs text-emerald-600 flex items-center">
                    <ChevronUp className="h-4 w-4 mr-1" />
                    <span>3 this week</span>
                  </div>
                </div>
                <Progress value={60} className="h-2 bg-emerald-100">
                  <div className="bg-emerald-500 h-full rounded-full" />
                </Progress>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Skill Strength</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold">83/100</span>
                  <div className="text-xs text-orange-600 flex items-center">
                    <span>Top 15%</span>
                  </div>
                </div>
                <Progress value={83} className="h-2 bg-orange-100">
                  <div className="bg-orange-500 h-full rounded-full" />
                </Progress>
              </CardContent>
            </Card>
          </div>
          
          {/* Recommended Jobs and Skills Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Jobs</CardTitle>
                  <CardDescription>Based on your skills and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((job) => (
                      <div key={job} className="border rounded-lg p-4 bg-card">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">Frontend Developer</h3>
                            <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
                          </div>
                          <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full h-fit">
                            98% Match
                          </div>
                        </div>
                        <div className="flex mt-3 gap-2">
                          <div className="text-xs bg-secondary px-2 py-1 rounded-full">React</div>
                          <div className="text-xs bg-secondary px-2 py-1 rounded-full">TypeScript</div>
                          <div className="text-xs bg-secondary px-2 py-1 rounded-full">Tailwind</div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-muted-foreground">Posted 2 days ago</div>
                          <Button size="sm">Apply Now</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Top Skills</CardTitle>
                  <CardDescription>How you rank compared to others</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Code className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm font-medium">React.js</span>
                        </div>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-1.5" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Laptop className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm font-medium">TypeScript</span>
                        </div>
                        <span className="text-sm font-medium">87%</span>
                      </div>
                      <Progress value={87} className="h-1.5" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Book className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm font-medium">CSS/Tailwind</span>
                        </div>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <Progress value={78} className="h-1.5" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2 text-primary" />
                          <span className="text-sm font-medium">UI/UX</span>
                        </div>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-1.5" />
                    </div>
                    
                    <Button variant="outline" className="w-full mt-2">View All Skills</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
      
      {/* Example Dashboard for Employers */}
      {userType === "employer" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Job Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold">5</span>
                  <Button variant="ghost" size="sm" className="h-8 text-xs">Post New Job</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-emerald-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold">127</span>
                  <div className="text-xs text-emerald-600 flex items-center">
                    <ChevronUp className="h-4 w-4 mr-1" />
                    <span>12 today</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Shortlisted Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold">14</span>
                  <div className="text-xs text-orange-600 flex items-center">
                    <span>3 pending review</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Candidates who applied to your job posts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((application) => (
                      <div key={application} className="border rounded-lg p-4 bg-card">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">John Doe</h3>
                            <p className="text-sm text-muted-foreground">Applied for Frontend Developer</p>
                          </div>
                          <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full h-fit">
                            95% Match
                          </div>
                        </div>
                        <div className="flex mt-3 gap-2">
                          <div className="text-xs bg-secondary px-2 py-1 rounded-full">3 Years Experience</div>
                          <div className="text-xs bg-secondary px-2 py-1 rounded-full">B.Tech</div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-muted-foreground">Applied 2 days ago</div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" /> Shortlist
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Job Posts</CardTitle>
                  <CardDescription>Latest job openings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Frontend Developer</h3>
                        <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 mb-2">
                        <Briefcase className="h-3 w-3 mr-1" />
                        <span>Full-time</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Posted 5 days ago</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">42</span>
                        <span className="text-muted-foreground"> applications</span>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">UX Designer</h3>
                        <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 mb-2">
                        <Briefcase className="h-3 w-3 mr-1" />
                        <span>Contract</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Posted 1 week ago</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">18</span>
                        <span className="text-muted-foreground"> applications</span>
                      </div>
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">iOS Developer</h3>
                        <span className="text-xs text-white bg-amber-500 px-2 py-0.5 rounded-full">Draft</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 mb-2">
                        <Briefcase className="h-3 w-3 mr-1" />
                        <span>Full-time</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Not published</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-1 text-xs h-7">
                        Publish Now
                      </Button>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-2">View All Jobs</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
