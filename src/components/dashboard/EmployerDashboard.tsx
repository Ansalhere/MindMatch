
import { useNavigate } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import StatCard from './StatCard';
import ApplicationsList from './ApplicationsList';
import JobsList from './JobsList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building } from 'lucide-react';

interface EmployerDashboardProps {
  userData: any;
  realJobs?: any[];
  loadingJobs?: boolean;
}

const EmployerDashboard = ({ userData, realJobs = [], loadingJobs = false }: EmployerDashboardProps) => {
  const navigate = useNavigate();
  
  const jobsToDisplay = realJobs.length > 0 ? realJobs : userData.jobs;
  
  const totalApplications = realJobs.reduce((total: number, job: any) => {
    return total + (job.applications ? job.applications.length : 0);
  }, 0);
  
  const applicants = [
    {
      id: "c1",
      name: "John Smith",
      position: "Frontend Developer",
      skills: ["React", "TypeScript", "UI/UX"],
      matchScore: 95,
      ranking: {
        overall: 92,
        position: 45,
        total: 5000
      },
      appliedDate: "2 days ago"
    },
    {
      id: "c2",
      name: "Sarah Johnson",
      position: "Data Scientist",
      skills: ["Python", "Machine Learning", "SQL"],
      matchScore: 97,
      ranking: {
        overall: 96,
        position: 18,
        total: 3500
      },
      appliedDate: "3 days ago"
    },
    {
      id: "c3",
      name: "Michael Chen",
      position: "Mobile Developer",
      skills: ["Swift", "React Native", "UX Design"],
      matchScore: 88,
      ranking: {
        overall: 88,
        position: 103,
        total: 4200
      },
      appliedDate: "5 days ago"
    },
    {
      id: "c4",
      name: "Emily Rodriguez",
      position: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "CSS"],
      matchScore: 91,
      ranking: {
        overall: 84,
        position: 212,
        total: 3800
      },
      appliedDate: "1 week ago"
    },
    {
      id: "c5",
      name: "Alexander Kim",
      position: "Backend Developer",
      skills: ["Node.js", "MongoDB", "Express"],
      matchScore: 86,
      ranking: {
        overall: 79,
        position: 367,
        total: 4500
      },
      appliedDate: "1 week ago"
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Active Job Posts" 
          value={jobsToDisplay.length}
          buttonText="Post New Job"
          onButtonClick={() => navigate('/post-job')}
        />
        
        <StatCard 
          title="Total Applications" 
          value={realJobs.length > 0 ? totalApplications : userData.jobs.reduce((total: number, job: any) => total + job.applicants, 0)}
          secondaryText="Recent Activity"
          icon={<ChevronUp className="h-4 w-4 mr-1" />}
          bgColor="bg-emerald-50"
        />
        
        <StatCard 
          title="Company Rating" 
          value={`${userData.rating?.overall || "N/A"}/5`}
          secondaryText="Top Employer"
          bgColor="bg-orange-50"
          progress={(userData.rating?.overall || 0) * 20}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Candidate Applications</CardTitle>
                  <CardDescription>Ranked by skill and experience</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    <span>{userData.size}</span>
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ApplicationsList 
                applicants={applicants} 
                realJobs={realJobs} 
                totalApplications={totalApplications}
                loadingJobs={loadingJobs}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Job Posts</CardTitle>
              <CardDescription>Latest job openings</CardDescription>
            </CardHeader>
            <CardContent>
              <JobsList 
                jobs={jobsToDisplay}
                userData={userData}
                loading={loadingJobs}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;
