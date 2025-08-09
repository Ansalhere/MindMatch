import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, MapPin, Phone, DollarSign, ArrowRight } from 'lucide-react';

interface DetailedSignupFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const DetailedSignupForm = ({ onSubmit, isLoading }: DetailedSignupFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info (Step 1)
    phone: '',
    location: '',
    
    // Experience & Salary (Step 2)
    current_ctc: '',
    expected_ctc: '',
    experience_level: '',
    industry_preference: '',
    
    // Skills & Education (Step 3)
    primary_skills: '',
    education_level: '',
    bio: '',
    availability: '',
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.phone && formData.location;
      case 2:
        return formData.expected_ctc && formData.experience_level;
      case 3:
        return formData.primary_skills && formData.education_level;
      default:
        return false;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Complete Your Profile - Step {currentStep} of 3
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData('location', e.target.value)}
                    placeholder="City, State"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Experience & Compensation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="current_ctc">Current CTC (Optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current_ctc"
                    value={formData.current_ctc}
                    onChange={(e) => updateFormData('current_ctc', e.target.value)}
                    placeholder="$75,000"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="expected_ctc">Expected CTC *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="expected_ctc"
                    value={formData.expected_ctc}
                    onChange={(e) => updateFormData('expected_ctc', e.target.value)}
                    placeholder="$90,000"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience_level">Experience Level *</Label>
                <Select onValueChange={(value) => updateFormData('experience_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                    <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                    <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                    <SelectItem value="lead">Lead/Principal (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="industry_preference">Industry Preference</Label>
                <Select onValueChange={(value) => updateFormData('industry_preference', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Skills & Background</h3>
            
            <div>
              <Label htmlFor="primary_skills">Primary Skills *</Label>
              <Input
                id="primary_skills"
                value={formData.primary_skills}
                onChange={(e) => updateFormData('primary_skills', e.target.value)}
                placeholder="e.g., JavaScript, React, Node.js, Python"
              />
              <p className="text-xs text-muted-foreground mt-1">
                List your main technical skills separated by commas
              </p>
            </div>
            
            <div>
              <Label htmlFor="education_level">Education Level *</Label>
              <Select onValueChange={(value) => updateFormData('education_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_school">High School</SelectItem>
                  <SelectItem value="associate">Associate Degree</SelectItem>
                  <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                  <SelectItem value="master">Master's Degree</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="bootcamp">Coding Bootcamp</SelectItem>
                  <SelectItem value="self_taught">Self-Taught</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="bio">Professional Summary</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => updateFormData('bio', e.target.value)}
                placeholder="Brief description of your professional background and career goals..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="availability">Availability</Label>
              <Select onValueChange={(value) => updateFormData('availability', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="When can you start?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Immediately</SelectItem>
                  <SelectItem value="2_weeks">2 weeks notice</SelectItem>
                  <SelectItem value="1_month">1 month</SelectItem>
                  <SelectItem value="2_months">2 months</SelectItem>
                  <SelectItem value="3_months">3+ months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <Button
            type="button"
            onClick={nextStep}
            disabled={!canProceed() || isLoading}
            className="flex items-center gap-2"
          >
            {currentStep === 3 ? (
              isLoading ? 'Creating Account...' : 'Complete Registration'
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedSignupForm;