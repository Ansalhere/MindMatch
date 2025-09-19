import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Edit3, 
  Trash2, 
  Eye, 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign,
  Loader2,
  AlertTriangle,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  job_type: string;
  salary_min?: number;
  salary_max?: number;
  is_active: boolean;
  created_at: string;
  closing_date?: string;
  _count?: {
    applications: number;
  };
}

interface JobManagementProps {
  jobs: Job[];
  onUpdate?: () => void;
}

const JobManagement = ({ jobs, onUpdate }: JobManagementProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDeleteJob = async (jobId: string) => {
    try {
      setDeletingId(jobId);
      
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      toast.success('Job deleted successfully');
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job: ' + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      setTogglingId(jobId);
      
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !currentStatus })
        .eq('id', jobId);

      if (error) throw error;

      toast.success(`Job ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Error toggling job status:', error);
      toast.error('Failed to update job status: ' + error.message);
    } finally {
      setTogglingId(null);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return 'Not specified';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (jobs.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Plus className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Jobs Posted</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Start posting jobs to attract top talent to your company.
          </p>
          <Button asChild>
            <Link to="/post-job">Post Your First Job</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">My Job Postings</h3>
        <Button asChild>
          <Link to="/post-job">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <Badge className={getStatusColor(job.is_active)}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {job.job_type}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      {formatSalary(job.salary_min, job.salary_max)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {job._count?.applications || 0} applications
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {job.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  Posted on {new Date(job.created_at).toLocaleDateString()}
                  {job.closing_date && (
                    <span> • Closes {new Date(job.closing_date).toLocaleDateString()}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/job/${job.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleJobStatus(job.id, job.is_active)}
                    disabled={togglingId === job.id}
                  >
                    {togglingId === job.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>{job.is_active ? 'Deactivate' : 'Activate'}</>
                    )}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={deletingId === job.id}
                        className="text-destructive hover:text-destructive"
                      >
                        {deletingId === job.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Delete Job Posting
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{job.title}"? This will also remove all 
                          applications for this job. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteJob(job.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Job
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JobManagement;