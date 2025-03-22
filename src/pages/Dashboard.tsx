
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  ChevronUp, 
  Book, 
  Code, 
  Laptop, 
  Award, 
  CheckCircle, 
  Clock, 
  X,
  User,
  Trophy,
  Building,
  Users,
  Plus
} from 'lucide-react';
import { toast } from "sonner";
import { sampleCandidates, sampleEmployers } from '../data/sampleProfiles';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("candidate");
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, this would be handled by an auth system
    // For now, we'll check localStorage or use a default
    const storedUserType = localStorage.getItem('userType');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserType) {
      setUserType(storedUserType);
      
      // Fetch user data
      if (storedUserType === 'candidate' && storedUserId) {
        const candidate = sampleCandidates.find(c => c.id === storedUserId);
        if (candidate) {
          setUserData(candidate);
        }
      } else if (storedUserType === 'employer' && storedUserId) {
        const employer = sampleEmployers.find(e => e.id === storedUserId);
        if (employer) {
          setUserData(employer);
        }
      }
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    toast.success("Logged out successfully");
    navigate('/');
  };

  const handleViewAllProfiles = () => {
    navigate('/profiles');
  };
  
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {userData && (
            <p className="text-muted-foreground">
              Welcome back, {userType === 'candidate' ? userData.name : userData.company}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleViewAllProfiles}>
            <Users className="h-4 w-4 mr-2" />
            Browse Profiles
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {userType === "candidate" ? "Add Skill" : "Post Job"}
          </Button>
        </div>
      </div>
      
      {!userData ? (
        <div className="text-center py-12">
          <Card>
            <CardContent className="pt-6 pb-6">
              <p className="mb-4">Please log in to view your dashboard</p>
              <Button onClick={() => navigate('/')}>Go to Login</Button>
            </CardContent>
          </Card>
        </div>
      ) : userType === "candidate" ? (
        <CandidateDashboard userData={userData} />
      ) : (
        <EmployerDashboard userData={userData} />
      )}
      
      <div className="mt-8 text-center">
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
};

const CandidateDashboard = ({ userData }: { userData: any }) => {
  return (
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
              <span className="text-2xl font-bold">{userData.applications.length}</span>
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
              <span className="text-2xl font-bold">{userData.ranking.overall}/100</span>
              <div className="text-xs text-orange-600 flex items-center">
                <span>Top {Math.round((userData.ranking.position / userData.ranking.total) * 100)}%</span>
              </div>
            </div>
            <Progress value={userData.ranking.overall} className="h-2 bg-orange-100">
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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recommended Jobs</CardTitle>
                  <CardDescription>Based on your skills and preferences</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    <span>Rank: #{userData.ranking.position}</span>
                  </Badge>
                </div>
              </div>
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
                {userData.skillRankings.map((skill: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        {skill.name === 'React.js' && <Code className="h-4 w-4 mr-2 text-primary" />}
                        {skill.name === 'TypeScript' && <Laptop className="h-4 w-4 mr-2 text-primary" />}
                        {skill.name === 'UI/UX' && <Book className="h-4 w-4 mr-2 text-primary" />}
                        <span className="text-sm font-medium">{skill.name}</span>
                      </div>
                      <span className="text-sm font-medium">{skill.score}%</span>
                    </div>
                    <Progress value={skill.score} className="h-1.5" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Ranking: #{skill.ranking}</span>
                      <span>Top {Math.round((skill.ranking / skill.total) * 100)}%</span>
                    </div>
                  </div>
                ))}
                
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link to={`/profile/${userData.id}/candidate`}>
                    View Full Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

const EmployerDashboard = ({ userData }: { userData: any }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Job Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-bold">{userData.jobs.length}</span>
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
              <span className="text-2xl font-bold">
                {userData.jobs.reduce((total: number, job: any) => total + job.applicants, 0)}
              </span>
              <div className="text-xs text-emerald-600 flex items-center">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>12 today</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Company Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-bold">{userData.rating.overall}/5</span>
              <div className="text-xs text-orange-600 flex items-center">
                <span>Top Employer</span>
              </div>
            </div>
            <Progress value={userData.rating.overall * 20} className="h-2 bg-orange-100">
              <div className="bg-orange-500 h-full rounded-full" />
            </Progress>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Candidates who applied to your job posts</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>{userData.size}</span>
                  </Badge>
                </div>
              </div>
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
                {userData.jobs.map((job: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{job.title}</h3>
                      <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1 mb-2">
                      <Briefcase className="h-3 w-3 mr-1" />
                      <span>{job.type}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Posted {job.posted}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">{job.applicants}</span>
                      <span className="text-muted-foreground"> applications</span>
                    </div>
                  </div>
                ))}
                
                <Button asChild variant="outline" className="w-full mt-2">
                  <Link to={`/profile/${userData.id}/employer`}>
                    View Company Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
