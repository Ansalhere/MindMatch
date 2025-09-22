import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Star, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  TrendingUp,
  Award,
  Eye,
  Clock,
  MessageCircle,
  Download
} from 'lucide-react';
import ResumeDownload from './ResumeDownload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Application {
  id: string;
  status: string;
  candidate_id: string;
  created_at: string;
  candidate_note: string;
  candidate?: {
    id: string;
    name: string;
    avatar_url: string;
    location: string;
    rank_score: number;
    company: string;
    resume_url?: string;
  };
}

interface SuggestedCandidate {
  id: string;
  name: string;
  avatar_url: string;
  location: string;
  rank_score: number;
  company: string;
  skills: string[];
}

interface EmployerJobViewProps {
  job: any;
  applications: Application[];
}

const EmployerJobView = ({ job, applications: initialApplications }: EmployerJobViewProps) => {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [suggestedCandidates, setSuggestedCandidates] = useState<SuggestedCandidate[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicationsWithCandidates();
    fetchSuggestedCandidates();
  }, [job.id]);

  const fetchApplicationsWithCandidates = async () => {
    try {
      const applicationIds = applications.map(app => app.candidate_id);
      if (applicationIds.length === 0) return;

      const { data: candidates } = await supabase.rpc('get_public_candidates', { limit_num: 100 });
      
      const applicationsWithCandidates = applications.map(app => ({
        ...app,
        candidate: candidates?.find((c: any) => c.id === app.candidate_id)
      }));

      setApplications(applicationsWithCandidates);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
    }
  };

  const fetchSuggestedCandidates = async () => {
    try {
      setLoadingSuggestions(true);
      const { data: candidates } = await supabase.rpc('get_public_candidates', { limit_num: 50 });
      
      if (candidates) {
        // Filter out candidates who have already applied
        const appliedCandidateIds = applications.map(app => app.candidate_id);
        const filtered = candidates.filter((c: any) => !appliedCandidateIds.includes(c.id));
        
        // Sort by rank score and take top suggestions
        const sorted = filtered
          .sort((a: any, b: any) => (b.rank_score || 0) - (a.rank_score || 0))
          .slice(0, 6);
        
        setSuggestedCandidates(sorted);
      }
    } catch (error) {
      console.error('Error fetching suggested candidates:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      setUpdatingStatus(applicationId);
      
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));

      toast.success(`Application ${newStatus} successfully`);
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getRankTier = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-600' };
    if (score >= 40) return { label: 'Average', color: 'text-yellow-600' };
    return { label: 'Entry Level', color: 'text-gray-600' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  return (
    <div className="space-y-6">
      {/* Job Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{pendingApplications.length}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{acceptedApplications.length}</p>
                <p className="text-xs text-muted-foreground">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {applications.length > 0 
                    ? Math.round(applications.reduce((acc, app) => acc + (app.candidate?.rank_score || 0), 0) / applications.length)
                    : 0
                  }
                </p>
                <p className="text-xs text-muted-foreground">Avg. Rank Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications and Suggestions */}
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="applications">
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            Suggested Candidates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground">
                    Your job posting hasn't received any applications yet. Check back later!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(application.candidate?.name || 'Unknown')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold">{application.candidate?.name || 'Unknown Candidate'}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            {application.candidate?.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{application.candidate.location}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Applied {formatDate(application.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                          {application.candidate?.rank_score && (
                            <Badge variant="outline" className={getRankTier(application.candidate.rank_score).color}>
                              <Star className="h-3 w-3 mr-1" />
                              {application.candidate.rank_score}/100 - {getRankTier(application.candidate.rank_score).label}
                            </Badge>
                          )}
                        </div>
                        
                        {application.candidate_note && (
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground">Cover Letter:</p>
                            <p className="text-sm bg-muted p-2 rounded-md mt-1">
                              {application.candidate_note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex gap-2 mb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <Link to={`/candidate/${application.candidate_id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </Link>
                        </Button>
                        
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                      
                      <ResumeDownload 
                        candidateId={application.candidate_id}
                        candidateName={application.candidate?.name || 'Unknown'}
                        resumeUrl={application.candidate?.resume_url}
                      />
                      
                      {application.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(application.id, 'accepted')}
                            disabled={updatingStatus === application.id}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateStatus(application.id, 'rejected')}
                            disabled={updatingStatus === application.id}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="suggestions" className="space-y-4">
          {loadingSuggestions ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Finding suitable candidates...</p>
                </div>
              </CardContent>
            </Card>
          ) : suggestedCandidates.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Suggestions Available</h3>
                  <p className="text-muted-foreground">
                    No suitable candidates found at the moment. Check back later!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedCandidates.map((candidate) => (
                <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(candidate.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            {candidate.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3" />
                                <span>{candidate.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getRankTier(candidate.rank_score || 0).color}>
                            <Star className="h-3 w-3 mr-1" />
                            {candidate.rank_score || 0}/100
                          </Badge>
                        </div>
                        
                        {candidate.skills && candidate.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {candidate.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{candidate.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full"
                        >
                          <Link to={`/candidate/${candidate.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
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
  );
};

export default EmployerJobView;