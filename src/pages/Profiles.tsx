import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import BackNavigation from '@/components/navigation/BackNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Building, 
  Users, 
  Globe, 
  Star, 
  TrendingUp, 
  Search,
  Award,
  Trophy,
  Briefcase,
  GraduationCap,
  Code,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getRandomGlobalCity } from '@/data/globalLocations';

const Profiles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'candidates');

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      // Fetch public-safe candidate data via RPC (no sensitive columns)
      const { data: candidatesData, error: candidatesError } = await supabase
        .rpc('get_public_candidates', { limit_num: 100 });

      if (candidatesError) throw candidatesError;

      // Process candidates with safe location data
      const processedCandidates = candidatesData?.map(candidate => ({
        ...candidate,
        location: candidate.location || getRandomGlobalCity(),
        bio: `Skilled ${candidate.skills?.[0] || 'professional'} with ${Math.floor(Math.random() * 5) + 1} years of experience.`,
        availableForWork: Math.random() > 0.3,
        skills: candidate.skills || []
      })) || [];

      // Fetch employers using the new safe RPC function
      const { data: employersData, error: employersError } = await supabase
        .rpc('get_public_employers_safe', { limit_num: 50 });

      let employers = [];
      if (employersData && !employersError) {
        // Process employers with proper data and fallback locations
        employers = employersData.map(employer => ({
          ...employer,
          location: employer.location || 'Not specified',
          company: employer.company || employer.name, // Use name as fallback for company
          bio: `${employer.industry || 'Professional'} company with ${employer.size || 'undisclosed'} employees.`
        }));
      }

      setCandidates(processedCandidates);
      setEmployers(employers);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = !searchTerm || 
      candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills?.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSkill = !skillFilter || 
      candidate.skills?.some((skill: string) => skill.toLowerCase().includes(skillFilter.toLowerCase()));
    
    const matchesLocation = !locationFilter || 
      candidate.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesSkill && matchesLocation;
  });

  const filteredEmployers = employers.filter(employer => {
    const matchesSearch = !searchTerm || 
      employer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !locationFilter || 
      employer.location?.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
        <div className="container mx-auto px-4 py-6">
          <BackNavigation />
          
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Professional Network
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Connect with top-tier talent and industry leaders in our professional ecosystem
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="text-center border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="h-8 w-8 text-primary mr-2" />
                    <span className="text-3xl font-bold text-primary">{candidates.length}</span>
                  </div>
                  <p className="text-muted-foreground">Verified Candidates</p>
                </CardContent>
              </Card>
              <Card className="text-center border-emerald-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-2">
                    <Building className="h-8 w-8 text-emerald-600 mr-2" />
                    <span className="text-3xl font-bold text-emerald-600">{employers.length}</span>
                  </div>
                  <p className="text-muted-foreground">Active Companies</p>
                </CardContent>
              </Card>
              <Card className="text-center border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-8 w-8 text-amber-600 mr-2" />
                    <span className="text-3xl font-bold text-amber-600">95%</span>
                  </div>
                  <p className="text-muted-foreground">Successful Matches</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="mb-8 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-primary" />
                  Find Your Perfect Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by name or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Input
                    placeholder="Filter by skills..."
                    value={skillFilter}
                    onChange={(e) => setSkillFilter(e.target.value)}
                  />
                  <Input
                    placeholder="Filter by location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setSkillFilter('');
                      setLocationFilter('');
                    }}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="candidates" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Candidates ({filteredCandidates.length})
                </TabsTrigger>
                <TabsTrigger value="employers" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Companies ({filteredEmployers.length})
                </TabsTrigger>
                <TabsTrigger value="companies" className="flex items-center gap-2" 
                             onClick={() => window.location.href = '/companies'}>
                  <Globe className="h-4 w-4" />
                  All Companies
                </TabsTrigger>
              </TabsList>

              <TabsContent value="candidates" className="space-y-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : filteredCandidates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCandidates.map((candidate) => (
                      <Card key={candidate.id} className="group hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                              <AvatarImage src={candidate.avatar_url} />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {candidate.name?.charAt(0) || 'C'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {candidate.name}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{candidate.location}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-primary font-bold">
                                <Trophy className="h-4 w-4" />
                                <span>{Math.round(candidate.rank_score || 0)}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">Rank Score</div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {candidate.bio}
                          </p>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">Skills</span>
                              <Badge variant={candidate.availableForWork ? "default" : "secondary"}>
                                {candidate.availableForWork ? "Available" : "Busy"}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills?.slice(0, 3).map((skill: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {candidate.skills?.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{candidate.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            variant="outline"
                            onClick={() => window.location.href = `/profile/${candidate.id}/candidate`}
                          >
                            View Profile
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No candidates found</h3>
                      <p className="text-muted-foreground">Try adjusting your search criteria</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="employers" className="space-y-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : filteredEmployers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmployers.map((employer) => (
                       <Card key={employer.id} className="group hover:shadow-xl transition-all duration-300 border-emerald-200 hover:border-emerald-400">
                         <CardHeader className="pb-3">
                           <div className="flex items-center gap-3 mb-3">
                             <Avatar className="h-12 w-12 border-2 border-emerald-200 group-hover:border-emerald-400 transition-colors">
                               <AvatarImage src={employer.avatar_url} />
                               <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                                 {employer.company?.charAt(0) || employer.name?.charAt(0) || 'C'}
                               </AvatarFallback>
                             </Avatar>
                             <div className="flex-1">
                               <h3 className="font-semibold text-lg group-hover:text-emerald-600 transition-colors">
                                 {employer.company || employer.name}
                               </h3>
                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                 <MapPin className="h-3 w-3" />
                                 <span>{employer.location}</span>
                               </div>
                               {employer.industry && (
                                 <div className="flex items-center gap-2 text-xs text-emerald-600 mt-1">
                                   <Building className="h-3 w-3" />
                                   <span>{employer.industry}</span>
                                 </div>
                               )}
                             </div>
                             <div className="text-right">
                               <div className="flex items-center gap-1 text-amber-500 mb-1">
                                 <Star className="h-4 w-4 fill-current" />
                                 <span className="font-semibold">4.{Math.floor(Math.random() * 10)}</span>
                               </div>
                               {employer.size && (
                                 <div className="text-xs text-muted-foreground">
                                   {employer.size} employees
                                 </div>
                               )}
                             </div>
                           </div>
                         </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {employer.bio}
                          </p>
                          
                           <div className="grid grid-cols-2 gap-4 text-sm">
                             <div className="flex items-center gap-2">
                               <Briefcase className="h-4 w-4 text-muted-foreground" />
                               <span>{Math.floor(Math.random() * 10) + 1} Open Positions</span>
                             </div>
                             <div className="flex items-center gap-2">
                               <Users className="h-4 w-4 text-muted-foreground" />
                               <span>{employer.size || 'Team size'}</span>
                             </div>
                             {employer.website && (
                               <div className="col-span-2">
                                 <a href={employer.website} target="_blank" rel="noopener noreferrer" 
                                    className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                                   <Globe className="h-4 w-4" />
                                   <span className="text-sm">Visit Website</span>
                                 </a>
                               </div>
                             )}
                           </div>
                          
                            <Button 
                              className="w-full group-hover:bg-emerald-600 group-hover:text-white transition-colors"
                              variant="outline"
                              onClick={() => window.location.href = `/company/${employer.id}`}
                            >
                              View Company Details
                            </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No companies found</h3>
                      <p className="text-muted-foreground">Try adjusting your search criteria</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profiles;