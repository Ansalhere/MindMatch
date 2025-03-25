
import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface RecommendedJobsProps {
  userData: any;
}

const RecommendedJobs = ({ userData }: RecommendedJobsProps) => {
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
        <div className="space-y-4">
          {[1, 2, 3].map((job) => (
            <div key={job} className="border rounded-lg p-4 bg-card">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">Frontend Developer</h3>
                  <p className="text-sm text-muted-foreground">TechCorp Inc.</p>
                </div>
                <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full h-fit">
                  98% Match
                </div>
              </div>
              <div className="flex mt-3 gap-2">
                <div className="text-xs bg-secondary px-2 py-1 rounded-full">React</div>
                <div className="text-xs bg-secondary px-2 py-1 rounded-full">TypeScript</div>
                <div className="text-xs bg-secondary px-2 py-1 rounded-full">Tailwind</div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">Posted 2 days ago</div>
                <Button size="sm">Apply Now</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedJobs;
