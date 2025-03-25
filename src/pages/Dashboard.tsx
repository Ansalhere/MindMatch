
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Plus, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { sampleCandidates, sampleEmployers } from '../data/sampleProfiles';
import { getEmployerJobs } from '@/lib/supabase';
import { useUser } from '@/hooks/useUser';
import Layout from '@/components/Layout';
import CandidateDashboard from '@/components/dashboard/CandidateDashboard';
import EmployerDashboard from '@/components/dashboard/EmployerDashboard';
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [userType, setUserType] = useState("candidate");
  const [userData, setUserData] = useState<any>(null);
  const [employerJobs, setEmployerJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const storedUserId = localStorage.getItem('userId');
    
    if (storedUserType) {
      setUserType(storedUserType);
      
      if (storedUserType === 'candidate' && storedUserId) {
        const candidate = sampleCandidates.find(c => c.id === storedUserId);
        if (candidate) {
          setUserData(candidate);
        }
      } else if (storedUserType === 'employer' && storedUserId) {
        const employer = sampleEmployers.find(e => e.id === storedUserId);
        if (employer) {
          setUserData(employer);
          if (user && user.id) {
            fetchEmployerJobs(user.id);
          }
        }
      }
    }
  }, [user]);

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

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    toast.success("Logged out successfully");
    navigate('/');
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

  if (loadingJobs) {
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

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {userData && (
              <p className="text-muted-foreground">
                Welcome back, {userType === 'candidate' ? userData.name : userData.company}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {userType === "candidate" && (
              <Button variant="outline" onClick={handleViewJobs}>
                <Briefcase className="h-4 w-4 mr-2" />
                Browse Jobs
              </Button>
            )}
            <Button variant="outline" onClick={handleViewAllProfiles}>
              <Users className="h-4 w-4 mr-2" />
              Browse Profiles
            </Button>
            <Button onClick={userType === "candidate" ? handleAddSkill : handlePostJob}>
              <Plus className="h-4 w-4 mr-2" />
              {userType === "candidate" ? "Add Skill" : "Post Job"}
            </Button>
          </div>
        </div>
        
        {!userData ? (
          <div className="text-center py-12">
            <Card>
              <CardContent className="pt-6 pb-6">
                <p className="mb-4">Please log in to view your dashboard</p>
                <Button onClick={() => navigate('/')}>Go to Login</Button>
              </CardContent>
            </Card>
          </div>
        ) : userType === "candidate" ? (
          <CandidateDashboard userData={userData} />
        ) : (
          <EmployerDashboard 
            userData={userData} 
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
