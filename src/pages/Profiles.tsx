
import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { MapPin, Star, Trophy, Building } from 'lucide-react';
import { sampleCandidates, sampleEmployers } from '../data/sampleProfiles';

const Profiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCandidates = sampleCandidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredEmployers = sampleEmployers.filter(employer => 
    employer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employer.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="container mx-auto py-12 px-6">
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
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="employers">Employers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="candidates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((candidate) => (
              <Card key={candidate.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-xl">{candidate.name}</CardTitle>
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
                        Top {Math.round((candidate.ranking.position / candidate.ranking.total) * 100)}% in {candidate.skills[0]}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{candidate.skills.length - 4} more
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
        </TabsContent>
        
        <TabsContent value="employers">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployers.map((employer) => (
              <Card key={employer.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={employer.avatar} alt={employer.company} />
                      <AvatarFallback>{employer.company.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{employer.company}</CardTitle>
                      <CardDescription>{employer.industry}</CardDescription>
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
                      <span>{employer.size} employees</span>
                    </div>
                    
                    <div className="bg-secondary/20 p-2 rounded-md text-sm">
                      <span className="font-medium">{employer.jobs.length} open positions</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {employer.jobs.map((job, index) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profiles;
