
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ColorfulJobCard from '@/components/jobs/ColorfulJobCard';

interface JobsListProps {
  jobs: any[];
  userData: any;
  loading?: boolean;
  onJobClick?: (jobId: string) => void;
}

const JobsList = ({ jobs, userData, loading = false, onJobClick }: JobsListProps) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
        <p className="text-muted-foreground">Loading job posts...</p>
      </div>
    );
  }
  
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-6xl">📋</div>
        <div>
          <h3 className="text-lg font-semibold mb-2">No job posts yet</h3>
          <p className="text-muted-foreground mb-6">Start attracting top talent by posting your first job</p>
          <Button onClick={() => navigate('/post-job')} size="lg">
            Post Your First Job
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {jobs.map((job: any, index: number) => (
          <div 
            key={job.id || index} 
            onClick={() => onJobClick?.(job.id)}
            className="cursor-pointer"
          >
            <ColorfulJobCard 
              job={job} 
              compact={true}
              showApplications={true}
            />
          </div>
        ))}
      </div>
      
      <Button asChild variant="outline" size="lg" className="w-full">
        <Link to={`/profile/${userData.id}/employer`}>
          View Company Profile
        </Link>
      </Button>
    </div>
  );
};

export default JobsList;
