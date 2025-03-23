
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase,
  Building,
  GraduationCap,
  Star,
  Code,
  Laptop,
  Book,
  CheckCircle,
  DollarSign,
  Briefcase as BriefcaseIcon
} from 'lucide-react';
import { sampleCandidates } from '../data/sampleProfiles';
import RankingExplanation from '@/components/ranking/RankingExplanation';
import AddSkillForm from '@/components/profile/AddSkillForm';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  useEffect(() => {
    // In a real app, you would fetch profile data from an API
    const candidate = sampleCandidates.find(c => c.id === id);
    if (candidate) {
      setProfile(candidate);
    }
  }, [id]);

  if (!profile) {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
        <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <Button 
        variant="outline" 
        className="mb-6" 
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Profile Info */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center border-b pb-6">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{profile.name}</CardTitle>
            <CardDescription>{profile.title}</CardDescription>
            <div className="flex justify-center mt-3 gap-2">
              {profile.skills.slice(0, 3).map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{profile.education}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Available {profile.availability}</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>Current CTC: $85,000</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>Expected CTC: $105,000</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-primary" /> Ranking
                </h3>
                <div className="flex justify-between mb-2">
                  <span>Overall Ranking</span>
                  <span className="font-bold">{profile.ranking.overall}/100</span>
                </div>
                <Progress value={profile.ranking.overall} className="h-2 mb-4" />
                <div className="bg-primary/5 p-3 rounded-md">
                  <div className="font-medium mb-2">Ranking Position</div>
                  <div className="flex items-center text-xl font-bold text-primary">
                    #{profile.ranking.position} <span className="text-sm font-normal text-muted-foreground ml-2">of {profile.ranking.total} candidates</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Top {Math.round((profile.ranking.position / profile.ranking.total) * 100)}% in {profile.skills[0]}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right column - Skills, Experience, etc. */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="ranking">Ranking Details</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="add-skills">Add Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                  <CardDescription>Skill assessment and ranking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.skillRankings.map((skill: any, index: number) => (
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
                          <span>Ranking: #{skill.ranking} of {skill.total}</span>
                          <span>Top {Math.round((skill.ranking / skill.total) * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Project Experience</CardTitle>
                  <CardDescription>Academic and personal projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {profile.projects.map((project: any, index: number) => (
                      <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                        <h3 className="font-semibold">{project.name}</h3>
                        <div className="flex gap-2 mb-2 mt-1">
                          {project.technologies.map((tech: string, i: number) => (
                            <Badge key={i} variant="outline">{tech}</Badge>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                  <CardDescription>Recent job applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Applied</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profile.applications.map((app: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{app.company}</TableCell>
                          <TableCell>{app.position}</TableCell>
                          <TableCell>{app.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                app.status === 'Accepted' ? 'default' :
                                app.status === 'Pending' ? 'secondary' :
                                'outline'
                              }
                            >
                              {app.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ranking" className="space-y-6">
              <RankingExplanation />
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Ranking History</CardTitle>
                  <CardDescription>See how your ranking has changed over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full bg-muted/30 rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Ranking history chart will be available soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="experience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Work Experience</CardTitle>
                  <CardDescription>Professional history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-b pb-5">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">Senior Frontend Developer</h3>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <BriefcaseIcon className="h-4 w-4 mr-1" />
                            <span>TechCorp Inc.</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Jan 2021 - Present
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Led the development of the company's flagship SaaS product, improving performance by 40%.
                        Mentored junior developers and implemented modern frontend architecture.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline">React</Badge>
                        <Badge variant="outline">TypeScript</Badge>
                        <Badge variant="outline">GraphQL</Badge>
                        <Badge variant="outline">Team Leadership</Badge>
                      </div>
                    </div>
                    
                    <div className="border-b pb-5">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">Frontend Developer</h3>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <BriefcaseIcon className="h-4 w-4 mr-1" />
                            <span>WebSolutions Inc.</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Mar 2018 - Dec 2020
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Developed responsive web applications for various clients in e-commerce and fintech sectors.
                        Collaborated with designers to implement pixel-perfect UIs.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline">React</Badge>
                        <Badge variant="outline">JavaScript</Badge>
                        <Badge variant="outline">CSS</Badge>
                        <Badge variant="outline">Redux</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">Junior Web Developer</h3>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <BriefcaseIcon className="h-4 w-4 mr-1" />
                            <span>Digital Agency</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Jun 2016 - Feb 2018
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Created and maintained websites for small to medium-sized businesses.
                        Focused on responsive design and cross-browser compatibility.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline">HTML</Badge>
                        <Badge variant="outline">CSS</Badge>
                        <Badge variant="outline">JavaScript</Badge>
                        <Badge variant="outline">jQuery</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>Academic background</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border-b pb-5">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">Bachelor of Science in Computer Science</h3>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            <span>University of Technology</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          2012 - 2016
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Graduated with honors. Focus on software engineering and web technologies.
                        Completed thesis on real-time web applications.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">High School Diploma</h3>
                          <div className="flex items-center text-muted-foreground mt-1">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            <span>Jefferson High School</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          2008 - 2012
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Advanced placement in Mathematics and Computer Science.
                        President of the Computer Club.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="add-skills">
              <AddSkillForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetails;
