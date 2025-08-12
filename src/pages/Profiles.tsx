import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import BackButton from '@/components/navigation/BackButton';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MapPin, Star, Trophy, Building, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import { getRandomIndianCity } from '@/data/indianCities';

const Profiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      // Fetch all candidates
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          avatar_url,
          current_ctc,
          expected_ctc,
          rank_score,
          skills!inner(
            name,
            level,
            experience_years
          )
        `)
        .eq('user_type', 'candidate')
        .limit(50);

      if (candidatesError) throw candidatesError;

      // Process candidates data
      const processedCandidates = candidatesData?.map(candidate => ({
        ...candidate,
        title: candidate.skills?.[0]?.name ? `${candidate.skills[0].name} Developer` : 'Software Developer',
        location: getRandomIndianCity(),
        ranking: {
          overall: candidate.rank_score || 0,
          position: Math.floor(Math.random() * 500) + 1,
          total: 5000
        },
        skillsList: candidate.skills?.map((skill: any) => skill.name) || []
      })) || [];

      setCandidates(processedCandidates);

      // Fetch all employers
      const { data: employersData, error: employersError } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          avatar_url,
          company,
          industry,
          size,
          website,
          jobs(
            id,
            title,
            job_type,
            location,
            created_at,
            applications(id)
          )
        `)
        .eq('user_type', 'employer')
        .limit(50);

      if (employersError) throw employersError;

      // Process employers data
      const processedEmployers = employersData?.map(employer => ({
        ...employer,
        location: getRandomIndianCity(),
        rating: {
          overall: 4.5,
          environment: 5,
          growth: 4,
          worklife: 4
        },
        jobsWithApplicants: employer.jobs?.map((job: any) => ({
          ...job,
          applicants: job.applications?.length || 0
        })) || []
      })) || [];

      setEmployers(processedEmployers);

      // Fallback: If no data from API, use sample demo profiles
      if (processedCandidates.length === 0 || processedEmployers.length === 0) {
        const { sampleCandidates, sampleEmployers } = await import('@/data/sampleProfiles');
        if (processedCandidates.length === 0) {
          const demoCandidates = sampleCandidates.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            avatar_url: c.avatar,
            title: c.title,
            location: c.location,
            ranking: c.ranking,
            skillsList: c.skills || []
          }));
          setCandidates(demoCandidates);
        }
        if (processedEmployers.length === 0) {
          const demoEmployers = sampleEmployers.map((e: any) => ({
            id: e.id,
            company: e.company,
            industry: e.industry,
            email: e.email,
            avatar_url: e.avatar,
            location: e.location,
            rating: e.rating,
            size: e.size,
            jobsWithApplicants: (e.jobs || []).map((j: any) => ({ title: j.title, applicants: j.applicants }))
          }));
          setEmployers(demoEmployers);
        }
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skillsList?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredEmployers = employers.filter(employer => 
    employer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profiles...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-6">
        <BackButton className="mb-6" />
        <h1 className="text-3xl font-bold mb-2">Browse Profiles</h1>
        <p className="text-muted-foreground mb-8">Discover talented candidates and top employers</p>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name, skills, or company..."
          className="w-full p-3 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue="candidates" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="candidates">Candidates ({filteredCandidates.length})</TabsTrigger>
          <TabsTrigger value="employers">Employers ({filteredEmployers.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="candidates">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No candidates found</p>
              {user?.user_type === 'candidate' && (
                <Button onClick={() => window.location.href = '/add-skill'}>
                  Complete Your Profile
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <Avatar>
                          <AvatarImage src={candidate.avatar_url} alt={candidate.name} />
                          <AvatarFallback>{candidate.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{candidate.name || 'Anonymous'}</CardTitle>
                          <CardDescription>{candidate.title}</CardDescription>
                          <div className="flex items-center text-sm mt-1">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">{candidate.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm font-semibold">
                        <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                        <span>#{candidate.ranking.position}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Overall Ranking</span>
                          <span className="font-semibold">{candidate.ranking.overall}/100</span>
                        </div>
                        <Progress value={candidate.ranking.overall} className="h-1.5" />
                        <div className="text-xs text-muted-foreground mt-1">
                          Top {Math.round((candidate.ranking.position / candidate.ranking.total) * 100)}% in {candidate.skillsList[0] || 'Skills'}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {candidate.skillsList.slice(0, 4).map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skillsList.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skillsList.length - 4} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="pt-4">
                        <Button asChild className="w-full">
                          <Link to={`/profile/${candidate.id}/candidate`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="employers">
          {filteredEmployers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No employers found</p>
              {user?.user_type === 'employer' && (
                <Button onClick={() => window.location.href = '/post-job'}>
                  Post Your First Job
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployers.map((employer) => (
                <Card key={employer.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={employer.avatar_url} alt={employer.company} />
                        <AvatarFallback>{employer.company?.charAt(0) || 'C'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{employer.company || employer.name}</CardTitle>
                        <CardDescription>{employer.industry || 'Technology'}</CardDescription>
                        <div className="flex items-center text-sm mt-1">
                          <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground">{employer.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Company Rating</span>
                          <div className="flex items-center">
                            <span className="font-semibold mr-1">{employer.rating.overall}</span>
                            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                          </div>
                        </div>
                        <Progress value={employer.rating.overall * 20} className="h-1.5" />
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span>{employer.size || '50-200'} employees</span>
                      </div>
                      
                      <div className="bg-secondary/20 p-2 rounded-md text-sm">
                        <span className="font-medium">{employer.jobsWithApplicants?.length || 0} open positions</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {employer.jobsWithApplicants?.slice(0, 3).map((job: any, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {job.title}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button asChild className="w-full">
                          <Link to={`/profile/${employer.id}/employer`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
};

export default Profiles;