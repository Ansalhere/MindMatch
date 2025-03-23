
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Calendar, Trophy, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

const PostJobForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [rankRestriction, setRankRestriction] = useState(false);
  const [minRank, setMinRank] = useState<number>(500);

  const handleAddSkill = () => {
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      setRequiredSkills([...requiredSkills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Job posted successfully!");
      
      // Reset form (would need to use formState in a real implementation)
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Post a New Job
        </CardTitle>
        <CardDescription>
          Create a job listing with specific requirements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="e.g., Senior Frontend Developer"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              placeholder="e.g., Engineering, Design, Marketing"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select required>
                <SelectTrigger id="jobType">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workLocation">Work Location</Label>
              <Select required>
                <SelectTrigger id="workLocation">
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location (if not remote)</Label>
              <div className="flex">
                <div className="bg-muted p-2 flex items-center rounded-l-md border border-r-0 border-input">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  className="rounded-l-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Application Deadline</Label>
              <div className="flex">
                <div className="bg-muted p-2 flex items-center rounded-l-md border border-r-0 border-input">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="deadline"
                  type="date"
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary">Minimum Salary (Annual)</Label>
              <Input
                id="minSalary"
                type="number"
                placeholder="e.g., 80000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxSalary">Maximum Salary (Annual)</Label>
              <Input
                id="maxSalary"
                type="number"
                placeholder="e.g., 120000"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and requirements"
              rows={4}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Required Skills</Label>
            <div className="flex">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a required skill"
                className="rounded-r-none"
              />
              <Button 
                type="button" 
                onClick={handleAddSkill}
                className="rounded-l-none"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {requiredSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <Trash className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {requiredSkills.length === 0 && (
                <span className="text-sm text-muted-foreground">No skills added yet</span>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-0.5">
                <Label htmlFor="rankRestriction" className="text-base">Ranking Requirement</Label>
                <p className="text-sm text-muted-foreground">Restrict applications to candidates above a certain rank</p>
              </div>
              <Switch
                id="rankRestriction"
                checked={rankRestriction}
                onCheckedChange={setRankRestriction}
              />
            </div>
            
            {rankRestriction && (
              <div className="space-y-2 pl-4 border-l-2 border-primary/20">
                <Label htmlFor="minRank" className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Minimum Candidate Ranking
                </Label>
                <Select 
                  value={minRank.toString()} 
                  onValueChange={(value) => setMinRank(parseInt(value))}
                >
                  <SelectTrigger id="minRank">
                    <SelectValue placeholder="Select minimum rank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">Top 50</SelectItem>
                    <SelectItem value="100">Top 100</SelectItem>
                    <SelectItem value="250">Top 250</SelectItem>
                    <SelectItem value="500">Top 500</SelectItem>
                    <SelectItem value="1000">Top 1000</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Only candidates ranked #{minRank} or better will be able to apply
                </p>
              </div>
            )}
          </div>
          
          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Posting Job..." : "Post Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PostJobForm;
