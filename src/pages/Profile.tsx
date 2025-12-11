
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
  Book,
  CheckCircle
} from 'lucide-react';
import { 
  getUserProfile, 
  getUserSkills, 
  getUserExperience, 
  getUserEducation, 
  getUserCertifications, 
  getUserApplications,
  calculateUserRank,
  getEmployerJobs 
} from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import ContactActions from '@/components/employer/ContactActions';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const { id, type = 'candidate' } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const handleViewResume = async (resumeUrl: string): Promise<void> => {
    try {
      // Extract the path from the URL
      const resumePath = resumeUrl.includes('resumes/') 
        ? resumeUrl.split('resumes/')[1]?.split('?')[0]
        : null;
      
      if (!resumePath) {
        // Try opening direct URL if path extraction fails
        window.open(resumeUrl, '_blank');
        return;
      }

      const { data, error } = await supabase.storage
        .from('resumes')
        .createSignedUrl(resumePath, 3600);
      
      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Error viewing resume:', error);
      toast.error('Could not open resume. Please try again.');
    }
  };
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Get user profile
        const { profile: userProfile, error: profileError } = await getUserProfile(id);
        if (profileError) throw profileError;
        
        if (!userProfile) {
          // Fallback to demo profiles if not found
          if (type === 'candidate') {
            try {
              const { sampleCandidates } = await import('@/data/sampleProfiles');
              const demo = sampleCandidates.find((c: any) => c.id === id);
              if (demo) {
                setProfile({
                  ...demo,
                  email: demo.email,
                  phone: demo.phone,
                  location: demo.location,
                  skills: (demo.skills || []).map((name: string) => ({ name, level: 4, experience_years: 3, is_verified: false })),
                  experience: [],
                  education: [],
                  certifications: [],
                  applications: demo.applications?.map((a: any, idx: number) => ({
                    id: `demo-app-${idx}`,
                    created_at: new Date().toISOString(),
                    status: (a.status || 'Pending').toLowerCase(),
                    job: { title: a.position, location: demo.location }
                  })) || [],
                  ranking: demo.ranking
                });
                return;
              }
            } catch {}
          } else if (type === 'employer') {
            try {
              const { sampleEmployers } = await import('@/data/sampleProfiles');
              const demo = sampleEmployers.find((e: any) => e.id === id);
              if (demo) {
                setProfile({
                  ...demo,
                  avatar_url: demo.avatar,
                  rating: demo.rating,
                  jobs: (demo.jobs || []).map((j: any, idx: number) => ({ id: `demo-job-${idx}`, title: j.title, job_type: j.type, location: j.location, applications: new Array(j.applicants).fill(null) })),
                  about: demo.about,
                  culture: demo.culture,
                  hiringProcess: demo.hiringProcess
                });
                return;
              }
            } catch {}
          }
          setProfile(null);
          return;
        }
        
        if (type === 'candidate') {
          // Fetch candidate-specific data
          const [skillsResult, experienceResult, educationResult, certificationsResult, applicationsResult] = await Promise.all([
            getUserSkills(id),
            getUserExperience(id),
            getUserEducation(id),
            getUserCertifications(id),
            getUserApplications(id)
          ]);
          
          // Calculate rank
          const { rank } = await calculateUserRank(id);
          
          setProfile({
            ...userProfile,
            skills: skillsResult.skills || [],
            experience: experienceResult.experiences || [],
            education: educationResult.education || [],
            certifications: certificationsResult.certifications || [],
            applications: applicationsResult.applications || [],
            ranking: {
              overall: Math.round(rank || 0),
              position: Math.floor(Math.random() * 500) + 1, // Mock position
              total: 5000 // Mock total
            }
          });
        } else if (type === 'employer') {
          // Fetch employer-specific data
          const { jobs } = await getEmployerJobs(id);
          
          setProfile({
            ...userProfile,
            jobs: jobs || [],
            rating: {
              overall: 4.5,
              environment: 5,
              growth: 4,
              worklife: 4
            },
            about: userProfile.company ? `${userProfile.company} is a growth-focused company committed to building great products and empowering our teams.` : 'Company information',
            culture: ['Remote-friendly', 'Professional development', 'Health benefits'],
            hiringProcess: [
              { title: 'Application', description: 'Submit your resume and cover letter' },
              { title: 'Screening', description: 'Initial screening by HR' },
              { title: 'Interviews', description: 'Technical and culture-fit interviews' },
              { title: 'Offer', description: 'Receive and accept your offer' },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [id, type]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

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
        <CandidateProfile profile={profile} currentUser={currentUser} onViewResume={handleViewResume} />
      ) : (
        <EmployerProfile profile={profile} />
      )}
    </div>
  );
};

const CandidateProfile = ({ profile, currentUser, onViewResume }: { profile: any; currentUser: any; onViewResume: (url: string) => void }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column - Ranking First (Main Focus) */}
      <div className="lg:col-span-1 space-y-4">
        {/* Ranking Card - PRIMARY */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-5 w-5 text-primary" /> Candidate Ranking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-5xl font-bold text-primary mb-1">{profile.ranking.overall}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
            <Progress value={profile.ranking.overall} className="h-3" />
            <div className="bg-background/50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">#{profile.ranking.position}</div>
              <div className="text-sm text-muted-foreground">of {profile.ranking.total} candidates</div>
              <div className="text-xs text-muted-foreground mt-2 px-2 py-1 bg-primary/10 rounded-full inline-block">
                Top {Math.round((profile.ranking.position / profile.ranking.total) * 100)}% in {profile.skills[0]?.name || 'Skills'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compact Profile Overview */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{profile.name}</CardTitle>
                <CardDescription className="text-xs">{profile.title}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 3).map((skill: any, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">{skill.name}</Badge>
              ))}
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{profile.location}</span>
              </div>
              {profile.education?.[0] && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span className="truncate text-xs">{profile.education[0].degree}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">Available immediately</span>
              </div>
            </div>
            {profile.resume_url && (
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => onViewResume(profile.resume_url)}
              >
                <Book className="h-3.5 w-3.5 mr-1.5" />
                View Resume
              </Button>
            )}
            {/* Contact Actions for Employers */}
            {currentUser?.user_type === 'employer' && (
              <div className="pt-2 border-t mt-2">
                <ContactActions
                  candidateName={profile.name}
                  candidateEmail={profile.email}
                  candidatePhone={profile.phone}
                  candidateId={profile.id}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Right column - Skills, Experience, etc. */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
            <CardDescription>Skill assessment and ranking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {profile.skills.map((skill: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Code className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                    <span className="text-sm font-medium">Level {skill.level}/5</span>
                  </div>
                  <Progress value={skill.level * 20} className="h-1.5" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Experience: {skill.experience_years} years</span>
                    <span>{skill.is_verified ? 'Verified' : 'Self-reported'}</span>
                  </div>
                </div>
              ))}
              {profile.skills.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No skills added yet</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Professional experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {profile.experience.map((exp: any, index: number) => (
                <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                  <h3 className="font-semibold">{exp.role}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <div className="flex gap-2 mb-2 mt-1">
                    <Badge variant="outline">
                      {new Date(exp.start_date).getFullYear()} - {exp.is_current ? 'Present' : new Date(exp.end_date).getFullYear()}
                    </Badge>
                    {exp.location && <Badge variant="outline">{exp.location}</Badge>}
                  </div>
                  {exp.description && (
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  )}
                </div>
              ))}
              {profile.experience.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No work experience added yet</p>
              )}
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
                  <TableHead>Job Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profile.applications.map((app: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{app.job?.title || 'N/A'}</TableCell>
                    <TableCell>{app.job?.location || 'N/A'}</TableCell>
                    <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          app.status === 'accepted' ? 'default' :
                          app.status === 'pending' ? 'secondary' :
                          'outline'
                        }
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {profile.applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                      No applications yet
                    </TableCell>
                  </TableRow>
                )}
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
              <AvatarImage src={profile.avatar_url} alt={profile.company || profile.name} />
              <AvatarFallback>{(profile.company || profile.name)?.charAt(0) || 'C'}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle>{profile.company || profile.name}</CardTitle>
          <CardDescription>{profile.industry || 'Technology'}</CardDescription>
          <div className="flex justify-center mt-3">
            <Badge variant="secondary">{profile.size || '50-200'} employees</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile.location || 'Location not specified'}</span>
            </div>
            {profile.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {profile.website}
                </a>
              </div>
            )}
            {profile.bio && (
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg mt-4">
                <p className="text-sm">{profile.bio}</p>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Founded 2020</span>
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
              {(profile.jobs || []).map((job: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 bg-card last:mb-0">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{job.title}</h3>
                      <p className="text-sm text-muted-foreground">{job.job_type}</p>
                    </div>
                    <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full h-fit">
                      {job.applications?.length || 0} applicants
                    </div>
                  </div>
                  <div className="flex mt-3 gap-2">
                    <div className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {job.job_type}
                    </div>
                    <div className="text-xs bg-secondary px-2 py-1 rounded-full">
                      {job.location}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <Button size="sm" asChild>
                      <Link to={`/job/${job.id}`}>View Details</Link>
                    </Button>
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
              {profile.about || 'We are a growth-focused company committed to building great products and empowering our teams.'}
            </p>
            
            <h3 className="font-semibold mt-6 mb-3">Work Culture</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(profile.culture || ['Remote-friendly', 'Professional development', 'Health benefits']).map((item: string, index: number) => (
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
              {(profile.hiringProcess || [
                { title: 'Application', description: 'Submit your resume and cover letter' },
                { title: 'Screening', description: 'Initial screening by HR' },
                { title: 'Interviews', description: 'Technical and culture-fit interviews' },
                { title: 'Offer', description: 'Receive and accept your offer' },
              ]).map((step: any, index: number) => (
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
