import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

const getTier = (score: number) => {
  if (score >= 90) return "Diamond";
  if (score >= 75) return "Platinum";
  if (score >= 60) return "Gold";
  if (score >= 40) return "Silver";
  return "Bronze";
};

const QuickUserPanel = () => {
  const { user } = useUser();
  if (!user || user.user_type !== 'candidate') return null;

  const score = user.rank_score || 0;
  const tier = getTier(score);

  return (
    <section className="container mx-auto px-6 -mt-12 md:-mt-16">
      <Card className="shadow-sm">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-primary" />
            Your Ranking at a Glance
          </CardTitle>
          <CardDescription>
            Simple score and quick actions to improve visibility
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <div className="text-sm mb-1">Overall Score</div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold">{score}</span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
            <Progress value={score} className="mt-2 h-2" />
          </div>
          <div>
            <div className="text-sm mb-1">Tier</div>
            <div className="font-semibold">{tier}</div>
            <p className="text-xs text-muted-foreground mt-1">Higher score = more employer visibility</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Button asChild size="sm">
              <Link to="/add-skill">Improve Ranking</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/ranking-explanation">Ranking Guide</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to={`/profile/${user.id}/candidate`}>View Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default QuickUserPanel;
