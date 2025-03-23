
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
import { FileCheck, Award, Plus } from "lucide-react";
import { toast } from "sonner";

const AddSkillForm = () => {
  const [formType, setFormType] = useState<"skill" | "certification">("skill");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`${formType === "skill" ? "Skill" : "Certification"} added successfully!`);
      
      // Reset form (would need to use formState in a real implementation)
    }, 1000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add to Your Profile
        </CardTitle>
        <CardDescription>
          Enhance your ranking by adding skills and certifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <Button
            type="button"
            variant={formType === "skill" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setFormType("skill")}
          >
            <FileCheck className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
          <Button
            type="button"
            variant={formType === "certification" ? "default" : "outline"}
            className="flex-1"
            onClick={() => setFormType("certification")}
          >
            <Award className="mr-2 h-4 w-4" />
            Add Certification
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          {formType === "skill" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skillName">Skill Name</Label>
                <Input
                  id="skillName"
                  placeholder="e.g., React.js, Python, UI/UX Design"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="proficiency">Proficiency Level</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  step="0.5"
                  placeholder="e.g., 2.5"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="details">Details & Examples</Label>
                <Textarea
                  id="details"
                  placeholder="Describe your experience with this skill and any notable projects"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="certName">Certification Name</Label>
                <Input
                  id="certName"
                  placeholder="e.g., AWS Solutions Architect, Google Analytics"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issuingOrg">Issuing Organization</Label>
                <Input
                  id="issuingOrg"
                  placeholder="e.g., Amazon Web Services, Google"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiration">Expiration Date (optional)</Label>
                <Input
                  id="expiration"
                  type="date"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="credentialID">Credential ID</Label>
                <Input
                  id="credentialID"
                  placeholder="e.g., ABC123XYZ"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="credentialURL">Credential URL (optional)</Label>
                <Input
                  id="credentialURL"
                  type="url"
                  placeholder="e.g., https://credential.net/verify/abc123"
                />
              </div>
            </div>
          )}
          
          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : `Add ${formType === "skill" ? "Skill" : "Certification"}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSkillForm;
