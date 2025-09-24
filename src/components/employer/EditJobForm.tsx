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
import { Briefcase, MapPin, Calendar, Plus, Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface EditJobFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting: boolean;
  initialData: any;
  isAdmin?: boolean;
}

const EditJobForm = ({ onSubmit, isSubmitting, initialData, isAdmin = false }: EditJobFormProps) => {
  const [jobTitle, setJobTitle] = useState(initialData?.title || "");
  const [jobType, setJobType] = useState(initialData?.job_type || "full-time");
  const [location, setLocation] = useState(initialData?.location || "");
  const [deadline, setDeadline] = useState(initialData?.closing_date || "");
  const [minSalary, setMinSalary] = useState(initialData?.salary_min?.toString() || "");
  const [maxSalary, setMaxSalary] = useState(initialData?.salary_max?.toString() || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [requiredSkills, setRequiredSkills] = useState<string[]>(initialData?.required_skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [rankRestriction, setRankRestriction] = useState(!!initialData?.min_rank_requirement);
  const [minRank, setMinRank] = useState<number>(initialData?.min_rank_requirement || 500);
  const [minExperience, setMinExperience] = useState(initialData?.min_experience?.toString() || "");
  const [companyName, setCompanyName] = useState(initialData?.company_name || "");
  const [externalApplyUrl, setExternalApplyUrl] = useState(initialData?.external_apply_url || "");

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setJobTitle(initialData.title || "");
      setJobType(initialData.job_type || "full-time");
      setLocation(initialData.location || "");
      setDescription(initialData.description || "");
      setRequiredSkills(initialData.required_skills || []);
      setMinSalary(initialData.salary_min?.toString() || "");
      setMaxSalary(initialData.salary_max?.toString() || "");
      setMinExperience(initialData.min_experience?.toString() || "");
      setCompanyName(initialData.company_name || "");
      setExternalApplyUrl(initialData.external_apply_url || "");
      setDeadline(initialData.closing_date || "");
      setRankRestriction(!!initialData.min_rank_requirement);
      setMinRank(initialData.min_rank_requirement || 500);
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
      jobType,
      location,
      deadline,
      salary: { min: minSalary, max: maxSalary },
      description,
      requiredSkills,
      rankRestriction,
      minRank: rankRestriction ? minRank : null,
      minExperience,
      companyName,
      externalApplyUrl
    };
    
    // Call the parent's onSubmit handler
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Edit Job Posting
        </CardTitle>
        <CardDescription>
          Update your job listing details
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
          
          {isAdmin && (
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="e.g., Google, Microsoft, OpenAI"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                As an admin, you can edit jobs on behalf of any company
              </p>
            </div>
          )}
          
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
              <Label htmlFor="location">Location</Label>
              <div className="flex">
                <div className="bg-muted p-2 flex items-center rounded-l-md border border-r-0 border-input">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="location"
                  placeholder="e.g., Mumbai, India | London, UK | Remote"
                  className="rounded-l-none"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minExperience">Minimum Experience (years)</Label>
              <Input
                id="minExperience"
                type="number"
                placeholder="0"
                value={minExperience}
                onChange={(e) => setMinExperience(e.target.value)}
                min="0"
              />
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
            <Label htmlFor="externalApplyUrl">External Application URL (Optional)</Label>
            <Input
              id="externalApplyUrl"
              type="url"
              placeholder="https://company.com/careers/apply"
              value={externalApplyUrl}
              onChange={(e) => setExternalApplyUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              If provided, candidates will be redirected to this URL instead of applying through our platform
            </p>
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
                <Label htmlFor="minRank">Minimum Candidate Ranking</Label>
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
            {isSubmitting ? "Updating Job..." : "Update Job"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditJobForm;