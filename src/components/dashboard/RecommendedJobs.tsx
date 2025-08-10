
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Briefcase, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from '@/hooks/useUser';
import { applyForJob, getJobs, getUserApplications } from '@/lib/supabase';
import { toast } from 'sonner';

interface RecommendedJobsProps {
  userData: any;
}

const RecommendedJobs = ({ userData }: RecommendedJobsProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState<string | null>(null);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [{ jobs: allJobs }, { applications: myApps }] = await Promise.all([
          getJobs(),
          user ? getUserApplications(user.id) : Promise.resolve({ applications: [] as any[] })
        ] as const);
        setApplications(myApps || []);
        // Very simple recommendation: prioritize jobs that match a user's top skills
        const topSkills = (userData?.skillsList || userData?.skills || []).map((s: any) => (typeof s === 'string' ? s : s.name)).slice(0, 5);
        const scored = (allJobs || []).map((job: any) => {
          const required = (job.required_skills || []) as string[];
          const overlap = required.filter((s) => topSkills.includes(s)).length;
          return { ...job, _match: required.length ? Math.round((overlap / required.length) * 100) : 60 };
        });
        const sorted = scored.sort((a, b) => (b._match || 0) - (a._match || 0)).slice(0, 5);
        setJobs(sorted);
      } catch (e) {
        console.error('Failed to load recommended jobs', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  const hasApplied = useMemo(() => new Set(applications.map((a) => a.job_id)), [applications]);

  const handleApply = async (jobId: string) => {
    if (!user) {
      toast.error('Please log in to apply');
      navigate('/login');
      return;
    }
    if (user.user_type !== 'candidate') {
      toast.error('Only candidates can apply');
      return;
    }
    try {
      setApplyingTo(jobId);
      const { error } = await applyForJob({
        job_id: jobId,
        candidate_id: user.id,
        status: 'pending',
        candidate_note: 'Interested in this role.'
      });
      if (error) throw error;
      toast.success('Application submitted');
      const { applications: refreshed } = await getUserApplications(user.id);
      setApplications(refreshed || []);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Failed to apply');
    } finally {
      setApplyingTo(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recommended Jobs</CardTitle>
            <CardDescription>Based on your skills and preferences</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Trophy className="h-3 w-3" />
              <span>Rank: #{userData.ranking.position}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Loading recommendations...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No recommendations yet. Browse all jobs to get started.</div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const applied = hasApplied.has(job.id);
              return (
                <div key={job.id} className="border rounded-lg p-4 bg-card">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold cursor-pointer hover:underline" onClick={() => navigate(`/job/${job.id}`)}>
                        {job.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{job.employer?.company || job.employer?.name || 'Company'}</p>
                    </div>
                    <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full h-fit">
                      {Math.max(50, Math.min(99, job._match || 60))}% Match
                    </div>
                  </div>
                  <div className="flex mt-3 gap-2">
                    {(job.required_skills || []).slice(0, 4).map((s: string, i: number) => (
                      <div key={i} className="text-xs bg-secondary px-2 py-1 rounded-full">{s}</div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">{job.location || 'Remote'}</div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/job/${job.id}`)}>
                        View
                      </Button>
                      <Button size="sm" onClick={() => handleApply(job.id)} disabled={applied || applyingTo === job.id}>
                        {applied ? (
                          <>
                            <Briefcase className="h-4 w-4 mr-1" /> Applied
                          </>
                        ) : applyingTo === job.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Applying...
                          </>
                        ) : (
                          'Apply Now'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedJobs;
