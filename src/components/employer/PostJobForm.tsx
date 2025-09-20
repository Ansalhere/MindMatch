import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Switch } from "@/components/ui/switch";

interface PostJobFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting: boolean;
  initialData?: any;
}

const PostJobForm = ({ onSubmit, isSubmitting, initialData }: PostJobFormProps) => {
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || "");
  const [department, setDepartment] = useState("");
  const [jobType, setJobType] = useState(initialData?.jobType || "full-time");
  const [workLocation, setWorkLocation] = useState("");
  const [location, setLocation] = useState(initialData?.location || "");
  const [deadline, setDeadline] = useState("");
  const [minSalary, setMinSalary] = useState(initialData?.salary?.min || "");
  const [maxSalary, setMaxSalary] = useState(initialData?.salary?.max || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [requiredSkills, setRequiredSkills] = useState<string[]>(initialData?.requiredSkills || []);
  const [newSkill, setNewSkill] = useState("");
  const [rankRestriction, setRankRestriction] = useState(false);
  const [minRank, setMinRank] = useState<number>(500);
  const [minExperience, setMinExperience] = useState(initialData?.minExperience || "");

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setJobTitle(initialData.jobTitle || "");
      setJobType(initialData.jobType || "full-time");
      setLocation(initialData.location || "");
      setDescription(initialData.description || "");
      setRequiredSkills(initialData.requiredSkills || []);
      setMinSalary(initialData.salary?.min || "");
      setMaxSalary(initialData.salary?.max || "");
      setMinExperience(initialData.minExperience || "");
    }
  }, [initialData]);

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
    
    // Prepare form data
    const formData = {
      jobTitle,
      department,
      jobType,
      workLocation,
      location,
      deadline,
      salary: { min: minSalary, max: maxSalary },
      description,
      requiredSkills,
      rankRestriction,
      minRank: rankRestriction ? minRank : null
    };
    
    // Call the parent's onSubmit handler
    onSubmit(formData);
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
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              placeholder="e.g., Engineering, Design, Marketing"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type</Label>
              <Select value={jobType} onValueChange={setJobType} required>
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
              <Select value={workLocation} onValueChange={setWorkLocation} required>
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
                    placeholder="e.g., Mumbai, India | London, UK | New York, USA"
                    className="rounded-l-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    list="global-cities"
                  />
                  <datalist id="global-cities">
                    {['Mumbai, India', 'London, UK', 'New York, USA', 'Remote', 'Singapore, Singapore', 'Toronto, Canada', 'Berlin, Germany', 'Sydney, Australia', 'Tokyo, Japan', 'Dubai, UAE'].map(city => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
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
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary">Minimum Salary (₹/month)</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  ₹
                </div>
                <Input
                  id="minSalary"
                  type="number"
                  placeholder="30,000"
                  className="pl-8"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxSalary">Maximum Salary (₹/month)</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  ₹
                </div>
                <Input
                  id="maxSalary"
                  type="number"
                  placeholder="80,000"
                  className="pl-8"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and requirements"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
