
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Clock, Trophy, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface JobsListProps {
  jobs: any[];
  userData: any;
  loading?: boolean;
}

const JobsList = ({ jobs, userData, loading = false }: JobsListProps) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
        <p className="text-sm">Loading job posts...</p>
      </div>
    );
  }
  
  if (jobs.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground mb-4">No job posts yet</p>
        <Button onClick={() => navigate('/post-job')}>Post Your First Job</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {jobs.map((job: any, index: number) => (
        <div key={job.id || index} className="p-3 border rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{job.title}</h3>
            <span className="text-xs text-white bg-green-500 px-2 py-0.5 rounded-full">
              {job.is_active ? "Active" : "Closed"}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-1 mb-2">
            <Briefcase className="h-3 w-3 mr-1" />
            <span>{job.job_type}</span>
            <span className="mx-2">•</span>
            <Clock className="h-3 w-3 mr-1" />
            <span>
              Posted {job.created_at 
                ? new Date(job.created_at).toLocaleDateString() 
                : job.posted || 'Recently'}
            </span>
          </div>
          <div className="flex justify-between">
            <div className="text-sm">
              <span className="font-medium">
                {job.applications ? job.applications.length : job.applicants || 0}
              </span>
              <span className="text-muted-foreground"> applications</span>
            </div>
            {job.applications && job.applications.some((app: any) => 
              app.candidate?.rank_score && app.candidate.rank_score > 80
            ) && (
              <div className="text-sm text-amber-600 flex items-center">
                <Trophy className="h-3 w-3 mr-1" />
                <span>Top ranked</span>
              </div>
            )}
          </div>
        </div>
      ))}
      
      <Button asChild variant="outline" className="w-full mt-2">
        <Link to={`/profile/${userData.id}/employer`}>
          View Company Profile
        </Link>
      </Button>
    </div>
  );
};

export default JobsList;
