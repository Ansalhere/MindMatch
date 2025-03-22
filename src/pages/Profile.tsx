
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { 
  Trophy, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase,
  Building,
  Users,
  GraduationCap,
  Star,
  Code,
  Laptop,
  Book
} from 'lucide-react';
import { sampleCandidates, sampleEmployers } from '../data/sampleProfiles';

const Profile = () => {
  const { id, type = 'candidate' } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, you would fetch profile data from an API
    // For now, we're using the sample data
    if (type === 'candidate') {
      const candidate = sampleCandidates.find(c => c.id === id);
      if (candidate) {
        setProfile(candidate);
      }
    } else if (type === 'employer') {
      const employer = sampleEmployers.find(e => e.id === id);
      if (employer) {
        setProfile(employer);
      }
    }
  }, [id, type]);

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
      
      {type === 'candidate' ? (
        <CandidateProfile profile={profile} />
      ) : (
        <EmployerProfile profile={profile} />
      )}
    </div>
  );
};

const CandidateProfile = ({ profile }: { profile: any }) => {
  return (
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
      </div>
    </div>
  );
};

const EmployerProfile = ({ profile }: { profile: any }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Profile Info */}
      <Card className="lg:col-span-1">
        <CardHeader className="text-center border-b pb-6">
          <div className="flex justify-center mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar} alt={profile.company} />
              <AvatarFallback>{profile.company.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>{profile.company}</CardTitle>
          <CardDescription>{profile.industry}</CardDescription>
          <div className="flex justify-center mt-3">
            <Badge variant="secondary">{profile.size} employees</Badge>
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
              <Building className="h-4 w-4 text-muted-foreground" />
              <span>{profile.website}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{profile.founded}</span>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Star className="h-4 w-4 mr-2 text-primary" /> Employer Rating
              </h3>
              <div className="flex justify-between mb-2">
                <span>Overall Rating</span>
                <span className="font-bold">{profile.rating.overall}/5</span>
              </div>
              <Progress value={profile.rating.overall * 20} className="h-2 mb-4" />
              <div className="bg-primary/5 p-3 rounded-md">
                <div className="flex justify-between mb-2">
                  <div className="text-sm">Work Environment</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < profile.rating.environment ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between mb-2">
                  <div className="text-sm">Growth Opportunities</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < profile.rating.growth ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} 
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm">Work-Life Balance</div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < profile.rating.worklife ? "text-amber-400 fill-amber-400" : "text-gray-300"}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Right column - Jobs, Info */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Job Listings</CardTitle>
            <CardDescription>Current open positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.jobs.map((job: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-card last:mb-0">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.department}</p>
                    </div>
                    <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full h-fit">
                      {job.applicants} applicants
                    </div>
                  </div>
                  <div className="flex mt-3 gap-2">
                    <div className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {job.type}
                    </div>
                    <div className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {job.location}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Posted {job.posted}
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>About {profile.company}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {profile.about}
            </p>
            
            <h3 className="font-semibold mt-6 mb-3">Work Culture</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {profile.culture.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-2 bg-secondary/20 p-2 rounded-md">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Hiring Process</CardTitle>
            <CardDescription>Steps to join {profile.company}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {profile.hiringProcess.map((step: any, index: number) => (
                <div key={index} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
