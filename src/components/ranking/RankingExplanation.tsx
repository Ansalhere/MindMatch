
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Award, Book, Trophy, Briefcase, FileCheck, ExternalLink, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const RankingExplanation = () => {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Understand Your Ranking (Simple)
          </CardTitle>
          <CardDescription>
            A clear, easy way to see where you stand and how to improve
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-md border bg-card">
              <div className="text-sm font-medium mb-1">Your Score</div>
              <div className="text-3xl font-bold">0–100</div>
              <p className="text-sm text-muted-foreground mt-1">Higher score = more visibility to employers</p>
            </div>
            <div className="p-4 rounded-md border bg-card">
              <div className="text-sm font-medium mb-1">Your Tier</div>
              <div className="font-semibold">Bronze · Silver · Gold · Platinum · Diamond</div>
              <p className="text-sm text-muted-foreground mt-1">Tier updates as your score improves</p>
            </div>
            <div className="p-4 rounded-md border bg-card">
              <div className="text-sm font-medium mb-1">Your Position</div>
              <div className="font-semibold">Top percentile among candidates</div>
              <p className="text-sm text-muted-foreground mt-1">Simple rank to compare your standing</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-2">What affects your score</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Profile completeness (photo, contact, education, experience)</li>
              <li>Skills and assessments (verified skills score higher)</li>
              <li>Work experience (relevance and years)</li>
              <li>Certifications and projects</li>
            </ul>
          </div>

          <div className="bg-secondary/30 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Quick ways to improve</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 rounded-md border bg-background">Add 3–5 in‑demand skills</div>
              <div className="p-3 rounded-md border bg-background">Take skill exams to verify</div>
              <div className="p-3 rounded-md border bg-background">Add recent experience & certifications</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Job types we list</h3>
            <p className="text-sm text-muted-foreground">Full‑time · Part‑time · Contract · Internship · Remote</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/add-skill">Improve My Ranking</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/jobs">Browse All Jobs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingExplanation;
