import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ReferralCard } from '@/components/referral/ReferralCard';
import RecommendedJobs from './RecommendedJobs';
import SkillsList from './SkillsList';
import ApplicationActions from '../candidate/ApplicationActions';
import { 
  Award, Trophy, TrendingUp, Briefcase, MapPin, Phone, 
  FileText, User, Target, Zap, ArrowUpRight, Sparkles,
  ChevronRight, Star, Calendar, Clock
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';
import ProfileCompletionCard from './ProfileCompletionCard';
import { calculateProfileCompletion } from '@/utils/profileCompletion';
import { getUserSkills, getUserEducation, getUserExperience, getUserCertifications } from '@/lib/supabase';
import { useDailyLogin } from '@/hooks/useDailyLogin';
import { ScrollReveal, StaggerContainer, StaggerItem, FadeInScale } from '@/components/ui/scroll-reveal';

interface CandidateDashboardProps {
  userData: any;
}

const CandidateDashboard = ({ userData }: CandidateDashboardProps) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { loginResult } = useDailyLogin();
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchApplications();
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;
    try {
      const [skillsResult, educationResult, experienceResult, certificationsResult] = await Promise.all([
        getUserSkills(user.id),
        getUserEducation(user.id),
        getUserExperience(user.id),
        getUserCertifications(user.id),
      ]);
      const completion = calculateProfileCompletion(
        user,
        skillsResult.skills || [],
        educationResult.education || [],
        experienceResult.experiences || [],
        certificationsResult.certifications || []
      );
      setProfileCompletion(completion);
    } catch (error) {
      console.error('Error calculating profile completion:', error);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;
    try {
      setLoadingApplications(true);
      const { data, error } = await supabase
        .rpc('get_candidate_applications', { candidate_id: user.id });
      if (error) throw error;
      const formattedApplications = data?.map((app: any) => ({
        id: app.id,
        status: app.status,
        created_at: app.created_at,
        job: {
          id: app.job_id,
          title: app.job_title,
          company: app.job_company
        }
      })) || [];
      setApplications(formattedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const rankPercentile = Math.round((1 - userData.ranking.position / userData.ranking.total) * 100);

  return (
    <div className="space-y-8">
      {/* Hero Stats Section */}
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-6 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rank Display */}
            <div className="lg:col-span-1 flex flex-col items-center justify-center text-center p-6 bg-background/60 backdrop-blur-sm rounded-2xl border border-primary/10">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-xl shadow-primary/25">
                  <div className="w-24 h-24 rounded-full bg-background flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">#{userData.ranking.position}</span>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  <Trophy className="h-3 w-3 inline mr-1" />
                  Top {rankPercentile}%
                </div>
              </div>
              <h3 className="mt-4 text-lg font-semibold">Global Ranking</h3>
              <p className="text-sm text-muted-foreground">Out of {userData.ranking.total.toLocaleString()}</p>
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-4 bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 cursor-pointer"
                onClick={() => navigate('/jobs')}
              >
                <Briefcase className="h-5 w-5 text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-xs text-muted-foreground">Applications</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-4 bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 cursor-pointer"
                onClick={() => navigate('/add-skill')}
              >
                <Target className="h-5 w-5 text-green-500 mb-2" />
                <p className="text-2xl font-bold">{Math.round(userData.ranking.overall)}</p>
                <p className="text-xs text-muted-foreground">Rank Score</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-4 bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 cursor-pointer"
                onClick={() => navigate('/edit-profile')}
              >
                <Star className="h-5 w-5 text-amber-500 mb-2" />
                <p className="text-2xl font-bold">{profileCompletion?.percentage || 0}%</p>
                <p className="text-xs text-muted-foreground">Profile</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-4 bg-background/60 backdrop-blur-sm rounded-xl border border-border/50 cursor-pointer"
                onClick={() => navigate('/skills')}
              >
                <Zap className="h-5 w-5 text-purple-500 mb-2" />
                <p className="text-2xl font-bold">+{Math.round(userData.ranking.overall * 0.1)}</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="relative z-10 mt-6 flex flex-wrap gap-3">
            <Button onClick={() => navigate('/add-skill')} className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Improve Ranking
            </Button>
            <Button variant="outline" onClick={() => navigate('/ranking-explanation')} className="gap-2">
              <Sparkles className="h-4 w-4" />
              How Rankings Work
            </Button>
            <Button variant="ghost" onClick={() => navigate('/edit-profile')} className="gap-2">
              Edit Profile
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Profile Overview Card */}
      <ScrollReveal delay={0.1}>
        <Card className="overflow-hidden border-border/50">
          <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {user?.name && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Name</p>
                  <p className="font-medium truncate">{user.name}</p>
                </div>
              )}
              {user?.location && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </p>
                  <p className="font-medium truncate">{user.location}</p>
                </div>
              )}
              {user?.phone && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Contact
                  </p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              )}
              {user?.current_ctc && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Current CTC</p>
                  <p className="font-medium text-primary">₹{user.current_ctc} LPA</p>
                </div>
              )}
              {user?.expected_ctc && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Expected CTC</p>
                  <p className="font-medium text-primary">₹{user.expected_ctc} LPA</p>
                </div>
              )}
              {user?.resume_url && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <FileText className="h-3 w-3" /> Resume
                  </p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    ✓ Uploaded
                  </Badge>
                </div>
              )}
            </div>
            {user?.bio && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Bio</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </ScrollReveal>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ScrollReveal delay={0.2}>
            <RecommendedJobs userData={userData} />
          </ScrollReveal>
          
          <ScrollReveal delay={0.3}>
            <ApplicationActions 
              applications={applications}
              onUpdate={fetchApplications}
            />
          </ScrollReveal>
        </div>
        
        <div className="space-y-6">
          <ScrollReveal delay={0.2} direction="right">
            {profileCompletion && (
              <ProfileCompletionCard completion={profileCompletion} />
            )}
          </ScrollReveal>
          
          <ScrollReveal delay={0.3} direction="right">
            <ReferralCard />
          </ScrollReveal>
          
          <ScrollReveal delay={0.4} direction="right">
            <SkillsList />
          </ScrollReveal>
          
          <ScrollReveal delay={0.5} direction="right">
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  size="sm" 
                  className="w-full justify-between" 
                  onClick={() => navigate('/add-skill')}
                >
                  Add Skills
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-between" 
                  onClick={() => navigate('/skills')}
                >
                  Take Assessment
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full justify-between" 
                  onClick={() => navigate('/resume-builder')}
                >
                  Build Resume
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
