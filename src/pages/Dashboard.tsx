
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Plus, Loader2, User } from 'lucide-react';
import { toast } from "sonner";
import { getEmployerJobs, signOut, getUserApplications } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import Layout from '@/components/Layout';
import CandidateDashboard from '@/components/dashboard/CandidateDashboard';
import EmployerDashboard from '@/components/dashboard/EmployerDashboard';
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading } = useUser();
  const [employerJobs, setEmployerJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [candidateApplications, setCandidateApplications] = useState<any[]>([]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  // Fetch employer jobs if user is an employer
  useEffect(() => {
    if (user && user.user_type === 'employer') {
      fetchEmployerJobs(user.id);
    }
  }, [user]);

  // Fetch candidate applications if user is a candidate
  useEffect(() => {
    if (user && user.user_type === 'candidate') {
      fetchCandidateApplications(user.id);
    }
  }, [user]);

  const fetchCandidateApplications = async (candidateId: string) => {
    try {
      const { applications, error } = await getUserApplications(candidateId);
      if (error) throw error;
      setCandidateApplications(applications || []);
    } catch (error) {
      console.error('Error fetching candidate applications:', error);
    }
  };
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

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error logging out");
    }
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

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If not authenticated, this will be handled by the useEffect redirect
  if (!user) {
    return null;
  }

  // Create mock userData structure for dashboard components
  const mockUserData = user.user_type === 'candidate' ? {
    id: user.id,
    name: user.name,
    email: user.email,
    ranking: {
      overall: Math.round(user.rank_score || 0),
      position: 234,
      total: 1250
    },
    applications: candidateApplications,
  } : {
    id: user.id,
    company: user.company || 'Sample Company',
    email: user.email,
    size: user.size || '51-200',
    rating: { overall: 4.2 },
    jobs: [
      { id: '1', title: 'Software Developer', applicants: 12, status: 'active' },
      { id: '2', title: 'Data Analyst', applicants: 8, status: 'active' }
    ]
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.user_type === 'candidate' ? user.name : user.company}
              </p>
            </div>
            {/* Prominent Rank Display for Candidates */}
            {user.user_type === 'candidate' && user.rank_score && (
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">#{Math.floor(user.rank_score)}</div>
                  <div className="text-xs opacity-90">Your Rank</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/edit-profile')}>
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            {user.user_type === "candidate" && (
              <Button variant="outline" onClick={handleViewJobs}>
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
            )}
            <Button onClick={user.user_type === "candidate" ? handleAddSkill : handlePostJob}>
              <Plus className="h-4 w-4 mr-2" />
              {user.user_type === "candidate" ? "Add Skill" : "Post Job"}
            </Button>
          </div>
        </div>
        
        {user.user_type === "candidate" ? (
          <CandidateDashboard userData={mockUserData} />
        ) : (
          <EmployerDashboard 
            userData={mockUserData} 
            realJobs={employerJobs} 
            loadingJobs={loadingJobs} 
          />
        )}
        
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
