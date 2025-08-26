import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Trophy, 
  Medal, 
  Crown, 
  Star, 
  TrendingUp, 
  MapPin, 
  Building2, 
  GraduationCap,
  Code,
  Search,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RankedCandidate {
  id: string;
  name: string;
  rank_score: number;
  position: number;
  location: string;
  company?: string;
  skills: string[];
  education?: string;
  experience_years: number;
  user_type: string;
}

const Rankings = () => {
  const [candidates, setCandidates] = useState<RankedCandidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<RankedCandidate[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterSkill, setFilterSkill] = useState('all');

  const [realCandidates, setRealCandidates] = useState<RankedCandidate[]>([]);
  
  // Real ranking data from Supabase
  useEffect(() => {
    fetchRealRankings();
  }, []);

  const fetchRealRankings = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          rank_score,
          location,
          company,
          user_type,
          skills:skills(name, level, experience_years),
          education:education(institution, degree, field),
          experiences:experiences(company, role, is_current)
        `)
        .eq('user_type', 'candidate')
        .order('rank_score', { ascending: false })
        .limit(100);

      if (!error && data) {
        const mappedCandidates = data.map((user, index) => ({
          id: user.id,
          name: user.name || 'Anonymous User',
          rank_score: user.rank_score || 0,
          position: index + 1,
          location: user.location || 'Not specified',
          company: user.company || user.experiences?.find(exp => exp.is_current)?.company,
          skills: user.skills?.map(skill => skill.name) || [],
          education: user.education?.[0] ? `${user.education[0].institution} - ${user.education[0].degree}` : undefined,
          experience_years: user.experiences?.length || 0,
          user_type: user.user_type
        }));
        setRealCandidates(mappedCandidates);
      }
    } catch (error) {
      console.error('Error fetching real rankings:', error);
    }
  };

  const mockCandidates: RankedCandidate[] = [
    {
      id: '1',
      name: 'Priya Sharma',
      rank_score: 98.5,
      position: 1,
      location: 'Bangalore',
      company: 'Google India',
      skills: ['React', 'Node.js', 'AWS', 'Python'],
      education: 'IIT Bangalore - Computer Science',
      experience_years: 5,
      user_type: 'candidate'
    },
    {
      id: '2',
      name: 'Rohit Kumar',
      rank_score: 96.2,
      position: 2,
      location: 'Delhi',
      company: 'Microsoft',
      skills: ['Java', 'Spring Boot', 'Azure', 'Microservices'],
      education: 'IIT Delhi - Software Engineering',
      experience_years: 6,
      user_type: 'candidate'
    },
    {
      id: '3',
      name: 'Ananya Patel',
      rank_score: 94.8,
      position: 3,
      location: 'Mumbai',
      company: 'Amazon',
      skills: ['Python', 'Machine Learning', 'Data Science', 'TensorFlow'],
      education: 'IIT Bombay - Data Science',
      experience_years: 4,
      user_type: 'candidate'
    },
    {
      id: '4',
      name: 'Vikram Singh',
      rank_score: 92.1,
      position: 4,
      location: 'Hyderabad',
      company: 'Facebook',
      skills: ['React Native', 'iOS', 'Swift', 'Kotlin'],
      education: 'BITS Pilani - Mobile Development',
      experience_years: 7,
      user_type: 'candidate'
    },
    {
      id: '5',
      name: 'Sneha Reddy',
      rank_score: 90.7,
      position: 5,
      location: 'Chennai',
      company: 'Adobe',
      skills: ['UI/UX Design', 'Figma', 'React', 'TypeScript'],
      education: 'NIT Trichy - Design Technology',
      experience_years: 3,
      user_type: 'candidate'
    }
  ];

  useEffect(() => {
    // Combine real and mock data for better UX
    const allCandidates = realCandidates.length > 0 ? 
      [...realCandidates, ...mockCandidates.slice(realCandidates.length)] : 
      mockCandidates;
    
    // Re-assign positions after combining
    const rankedCandidates = allCandidates
      .sort((a, b) => b.rank_score - a.rank_score)
      .map((candidate, index) => ({ ...candidate, position: index + 1 }));
    
    setCandidates(rankedCandidates);
    setFilteredCandidates(rankedCandidates);
  }, [realCandidates]);

  useEffect(() => {
    let filtered = candidates;

    if (searchTerm) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterLocation !== 'all') {
      filtered = filtered.filter(candidate => candidate.location === filterLocation);
    }

    if (filterSkill !== 'all') {
      filtered = filtered.filter(candidate =>
        candidate.skills.some(skill => skill.toLowerCase().includes(filterSkill.toLowerCase()))
      );
    }

    setFilteredCandidates(filtered);
  }, [searchTerm, filterLocation, filterSkill, candidates]);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Trophy className="h-6 w-6 text-orange-500" />;
      default: return <Star className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getRankColor = (position: number) => {
    if (position <= 3) return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    if (position <= 10) return 'bg-gradient-to-r from-blue-500 to-purple-600';
    if (position <= 50) return 'bg-gradient-to-r from-green-500 to-blue-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  const uniqueLocations = [...new Set(candidates.map(c => c.location))];
  const uniqueSkills = [...new Set(candidates.flatMap(c => c.skills))];

  const SkillRankings = () => {
    const skillGroups = uniqueSkills.map(skill => {
      const skillCandidates = candidates
        .filter(c => c.skills.includes(skill))
        .sort((a, b) => b.rank_score - a.rank_score)
        .slice(0, 5);
      
      return { skill, candidates: skillCandidates };
    });

    return (
      <>
        {skillGroups.slice(0, 6).map(({ skill, candidates }) => (
          <Card key={skill}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                {skill} Rankings
              </CardTitle>
              <CardDescription>
                Top performers in {skill}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidates.map((candidate, index) => (
                  <div key={candidate.id} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className="text-lg font-bold text-muted-foreground w-8">
                      #{index + 1}
                    </div>
                    <Avatar>
                      <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{candidate.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{candidate.location}</span>
                        {candidate.company && (
                          <>
                            <Building2 className="h-3 w-3 ml-2" />
                            <span>{candidate.company}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <Badge className={getRankColor(index + 1)} variant="secondary">
                      {candidate.rank_score.toFixed(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Global Rankings</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Discover top talent across skills, locations, and industries. See where you stand among the best professionals worldwide.
          </p>
        </div>

        <Tabs defaultValue="overall" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="overall" className="text-sm">Overall</TabsTrigger>
            <TabsTrigger value="skills" className="text-sm">Skills</TabsTrigger>
            <TabsTrigger value="location" className="text-sm">Location</TabsTrigger>
            <TabsTrigger value="education" className="text-sm">Education</TabsTrigger>
          </TabsList>

          <div className="flex flex-col lg:flex-row gap-3 mb-6 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterSkill} onValueChange={setFilterSkill}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {uniqueSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="overall" className="space-y-4 max-w-5xl mx-auto">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-primary w-12">
                        #{candidate.position}
                      </div>
                      {getRankIcon(candidate.position)}
                    </div>
                    
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg">{candidate.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{candidate.name}</h3>
                        <Badge className={`${getRankColor(candidate.position)} text-white font-bold px-4 py-1`}>
                          {candidate.rank_score.toFixed(1)}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {candidate.company && (
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            <span>{candidate.company}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{candidate.experience_years} years experience</span>
                        </div>
                        {candidate.education && (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{candidate.education}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {candidate.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SkillRankings />
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4 max-w-5xl mx-auto">
            {uniqueLocations.map(location => {
              const locationCandidates = candidates
                .filter(c => c.location === location)
                .sort((a, b) => b.rank_score - a.rank_score);
              
              return (
                <Card key={location}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      {location} Rankings
                    </CardTitle>
                    <CardDescription>
                      Top talent in {location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {locationCandidates.slice(0, 5).map((candidate, index) => (
                        <div key={candidate.id} className="flex items-center gap-4 p-3 rounded-lg border">
                          <div className="text-lg font-bold text-muted-foreground w-8">
                            #{index + 1}
                          </div>
                          <Avatar>
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">{candidate.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {candidate.company && (
                                <>
                                  <Building2 className="h-3 w-3" />
                                  <span>{candidate.company}</span>
                                </>
                              )}
                              <span>{candidate.experience_years} years exp</span>
                            </div>
                          </div>
                          <Badge className={getRankColor(index + 1)} variant="secondary">
                            {candidate.rank_score.toFixed(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="education" className="space-y-4 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education Rankings
                </CardTitle>
                <CardDescription>
                  Top performers by educational background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredCandidates.slice(0, 10).map((candidate, index) => (
                    <div key={candidate.id} className="flex items-center gap-4 p-3 rounded-lg border">
                      <div className="text-lg font-bold text-muted-foreground w-8">
                        #{index + 1}
                      </div>
                      <Avatar>
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{candidate.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <GraduationCap className="h-3 w-3" />
                          <span>{candidate.education || 'Education not specified'}</span>
                        </div>
                      </div>
                      <Badge className={getRankColor(index + 1)} variant="secondary">
                        {candidate.rank_score.toFixed(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Rankings;