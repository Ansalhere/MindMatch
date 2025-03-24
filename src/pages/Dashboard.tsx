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
  Plus,
  Filter,
  ArrowUpDown,
  Star,
  Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { sampleCandidates, sampleEmployers } from '../data/sampleProfiles';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEmployerJobs } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [userType, setUserType] = useState("candidate");
  const [userData, setUserData] = useState<any>(null);
  const [employerJobs, setEmployerJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserType) {
      setUserType(storedUserType);
      
      if (storedUserType === 'candidate' && storedUserId) {
        const candidate = sampleCandidates.find(c => c.id === storedUserId);
        if (candidate) {
          setUserData(candidate);
        }
      } else if (storedUserType === 'employer' && storedUserId) {
        const employer = sampleEmployers.find(e => e.id === storedUserId);
        if (employer) {
          setUserData(employer);
          if (user && user.id) {
            fetchEmployerJobs(user.id);
          }
        }
      }
    }
  }, [user]);

  const fetchEmployerJobs = async (employerId: string) => {
    try {
      setLoadingJobs(true);
      const { jobs, error } = await getEmployerJobs(employerId);
      
      if (error) throw error;
      
      setEmployerJobs(jobs || []);
    } catch (error) {
      console.error("Error fetching employer jobs:", error);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    toast.success("Logged out successfully");
    navigate('/');
  };

  const handleViewAllProfiles = () => {
    navigate('/profiles');
  };

  const handlePostJob = () => {
    navigate('/post-job');
  };

  const handleAddSkill = () => {
    navigate('/add-skill');
  };

  const handleViewJobs = () => {
    navigate('/jobs');
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
          {userType === "candidate" && (
            <Button variant="outline" onClick={handleViewJobs}>
              <Briefcase className="h-4 w-4 mr-2" />
              Browse Jobs
            </Button>
          )}
          <Button variant="outline" onClick={handleViewAllProfiles}>
            <Users className="h-4 w-4 mr-2" />
            Browse Profiles
          </Button>
          <Button onClick={userType === "candidate" ? handleAddSkill : handlePostJob}>
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
        <EmployerDashboard 
          userData={userData} 
          realJobs={employerJobs} 
          loadingJobs={loadingJobs} 
        />
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Skill Strength</CardTitle>
              <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                <Trophy className="h-3 w-3 mr-1" />
                Rank #{userData.ranking.position}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-bold">{userData.ranking.overall}/100</span>
              <div className="text-xs text-orange-600 flex items-center">
                <Award className="h-4 w-4 mr-1" />
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
              <div className="flex justify-between items-center">
                <CardTitle>Your Top Skills</CardTitle>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  <Star className="h-3 w-3 mr-1" />
                  Ranking
                </Badge>
              </div>
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
                      <span className="flex items-center">
                        <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                        Rank: #{skill.ranking}
                      </span>
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

const EmployerDashboard = ({ 
  userData, 
  realJobs = [], 
  loadingJobs = false 
}: { 
  userData: any, 
  realJobs?: any[], 
  loadingJobs?: boolean 
}) => {
  const [rankFilter, setRankFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("highest");
  const navigate = useNavigate();
  
  const jobsToDisplay = realJobs.length > 0 ? realJobs : userData.jobs;
  
  const totalApplications = realJobs.reduce((total: number, job: any) => {
    return total + (job.applications ? job.applications.length : 0);
  }, 0);
  
  const applicants = [
    {
      id: "c1",
      name: "John Smith",
      position: "Frontend Developer",
      skills: ["React", "TypeScript", "UI/UX"],
      matchScore: 95,
      ranking: {
        overall: 92,
        position: 45,
        total: 5000
      },
      appliedDate: "2 days ago"
    },
    {
      id: "c2",
      name: "Sarah Johnson",
      position: "Data Scientist",
      skills: ["Python", "Machine Learning", "SQL"],
      matchScore: 97,
      ranking: {
        overall: 96,
        position: 18,
        total: 3500
      },
      appliedDate: "3 days ago"
    },
    {
      id: "c3",
      name: "Michael Chen",
      position: "Mobile Developer",
      skills: ["Swift", "React Native", "UX Design"],
      matchScore: 88,
      ranking: {
        overall: 88,
        position: 103,
        total: 4200
      },
      appliedDate: "5 days ago"
    },
    {
      id: "c4",
      name: "Emily Rodriguez",
      position: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "CSS"],
      matchScore: 91,
      ranking: {
        overall: 84,
        position: 212,
        total: 3800
      },
      appliedDate: "1 week ago"
    },
    {
      id: "c5",
      name: "Alexander Kim",
      position: "Backend Developer",
      skills: ["Node.js", "MongoDB", "Express"],
      matchScore: 86,
      ranking: {
        overall: 79,
        position: 367,
        total: 4500
      },
      appliedDate: "1 week ago"
    }
  ];

  const filteredApplicants = applicants.filter(applicant => {
    if (rankFilter === "all") return true;
    if (rankFilter === "top50" && applicant.ranking.position <= 50) return true;
    if (rankFilter === "top100" && applicant.ranking.position <= 100) return true;
    if (rankFilter === "top500" && applicant.ranking.position <= 500) return true;
    return false;
  });

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortOrder === "highest") {
      return a.ranking.position - b.ranking.position;
    } else {
      return b.ranking.position - a.ranking.position;
    }
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Job Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-bold">{jobsToDisplay.length}</span>
              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => navigate('/post-job')}>
                Post New Job
              </Button>
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
                {realJobs.length > 0 ? totalApplications : userData.jobs.reduce((total: number, job: any) => total + job.applicants, 0)}
              </span>
              <div className="text-xs text-emerald-600 flex items-center">
                <ChevronUp className="h-4 w-4 mr-1" />
                <span>Recent Activity</span>
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
              <span className="text-2xl font-bold">{userData.rating?.overall || "N/A"}/5</span>
              <div className="text-xs text-orange-600 flex items-center">
                <span>Top Employer</span>
              </div>
            </div>
            <Progress value={(userData.rating?.overall || 0) * 20} className="h-2 bg-orange-100">
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
                  <CardTitle>Candidate Applications</CardTitle>
                  <CardDescription>Ranked by skill and experience</CardDescription>
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
              <div className="flex justify-between items-center mb-4 space-x-2">
                <div className="flex items-center space-x-2">
                  <Select value={rankFilter} onValueChange={setRankFilter}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by Rank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ranks</SelectItem>
                      <SelectItem value="top50">Top 50</SelectItem>
                      <SelectItem value="top100">Top 100</SelectItem>
                      <SelectItem value="top500">Top 500</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[180px]">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort by Rank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highest">Highest Rank First</SelectItem>
                      <SelectItem value="lowest">Lowest Rank First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Badge variant="outline" className="ml-auto">
                  {realJobs.length > 0 ? totalApplications : filteredApplicants.length} candidates
                </Badge>
              </div>
              
              {loadingJobs ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p>Loading applicants...</p>
                </div>
              ) : realJobs.length > 0 && realJobs.some(job => job.applications && job.applications.length > 0) ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Ranking</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {realJobs.flatMap(job => 
                      job.applications ? job.applications.map((app: any) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.candidate?.name || "Unknown"}</TableCell>
                          <TableCell>{job.title}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={`${
                              app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                              app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col items-center">
                              <div className="flex items-center text-amber-500">
                                <Trophy className="h-4 w-4 mr-1" />
                                <span className="font-semibold">{app.candidate?.rank_score || "N/A"}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">
                                <X className="h-4 w-4 mr-1" /> Reject
                              </Button>
                              <Button size="sm">
                                <CheckCircle className="h-4 w-4 mr-1" /> Shortlist
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )) : []
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead className="text-center">Match</TableHead>
                      <TableHead className="text-center">Ranking</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedApplicants.map((applicant) => (
                      <TableRow key={applicant.id}>
                        <TableCell className="font-medium">{applicant.name}</TableCell>
                        <TableCell>{applicant.position}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={`${
                            applicant.matchScore >= 95 ? 'bg-green-100 text-green-800' : 
                            applicant.matchScore >= 85 ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {applicant.matchScore}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-amber-500">
                              <Trophy className="h-4 w-4 mr-1" />
                              <span className="font-semibold">#{applicant.ranking.position}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              Top {Math.round((applicant.ranking.position / applicant.ranking.total) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                            <Button size="sm">
                              <CheckCircle className="h-4 w-4 mr-1" /> Shortlist
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
              {loadingJobs ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                  <p className="text-sm">Loading job posts...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobsToDisplay.length > 0 ? (
                    <>
                      {jobsToDisplay.map((job: any, index: number) => (
                        <div key={job.id || index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{job.title}</h3>
                            <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
                              {job.is_active ? "Active" : "Closed"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1 mb-2">
                            <Briefcase className="h-3 w-3 mr-1" />
                            <span>{job.job_type}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>
                              Posted {job.created_at 
                                ? new Date(job.created_at).toLocaleDateString() 
                                : job.posted || 'Recently'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-sm">
                              <span className="font-medium">
                                {job.applications ? job.applications.length : job.applicants || 0}
                              </span>
                              <span className="text-muted-foreground"> applications</span>
                            </div>
                            {job.applications && job.applications.some((app: any) => 
                              app.candidate?.rank_score && app.candidate.rank_score > 80
                            ) && (
                              <div className="text-sm text-amber-600 flex items-center">
                                <Trophy className="h-3 w-3 mr-1" />
                                <span>Top ranked</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      <Button asChild variant="outline" className="w-full mt-2">
                        <Link to={`/profile/${userData.id}/employer`}>
                          View Company Profile
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">No job posts yet</p>
                      <Button onClick={() => navigate('/post-job')}>Post Your First Job</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

