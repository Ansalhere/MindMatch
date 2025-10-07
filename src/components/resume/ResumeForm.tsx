import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ResumeData } from '@/pages/ResumeBuilder';
import AIAssistantButton from './AIAssistantButton';

interface ResumeFormProps {
  section: 'personal' | 'experience' | 'skills';
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ResumeForm = ({ section, data, onChange }: ResumeFormProps) => {
  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experience: [
        ...data.experience,
        {
          id: Date.now().toString(),
          title: '',
          company: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          description: '',
        },
      ],
    });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    onChange({
      ...data,
      experience: data.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    onChange({
      ...data,
      experience: data.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        {
          id: Date.now().toString(),
          degree: '',
          institution: '',
          location: '',
          graduationDate: '',
          gpa: '',
        },
      ],
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    onChange({
      ...data,
      education: data.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    onChange({
      ...data,
      education: data.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkillCategory = () => {
    onChange({
      ...data,
      skills: [
        ...data.skills,
        { id: Date.now().toString(), category: '', items: [] },
      ],
    });
  };

  const updateSkillCategory = (id: string, category: string, items: string) => {
    onChange({
      ...data,
      skills: data.skills.map((skill) =>
        skill.id === id
          ? { ...skill, category, items: items.split(',').map((s) => s.trim()) }
          : skill
      ),
    });
  };

  const removeSkillCategory = (id: string) => {
    onChange({
      ...data,
      skills: data.skills.filter((skill) => skill.id !== id),
    });
  };

  if (section === 'personal') {
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={data.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={data.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
            <Input
              id="linkedin"
              value={data.personalInfo.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
          <div>
            <Label htmlFor="portfolio">Portfolio/Website (Optional)</Label>
            <Input
              id="portfolio"
              value={data.personalInfo.portfolio || ''}
              onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
              placeholder="johndoe.com"
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="summary">Professional Summary *</Label>
            <AIAssistantButton
              type="professional-summary"
              context={{
                experience: '5',
                field: 'Software Development',
                skills: data.skills.map(s => s.category).join(', ')
              }}
              onGenerated={(text) => updatePersonalInfo('summary', text)}
              label="AI Generate"
            />
          </div>
          <Textarea
            id="summary"
            value={data.personalInfo.summary}
            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
            placeholder="A brief summary of your professional background and career objectives..."
            rows={4}
          />
          <p className="text-xs text-muted-foreground mt-1">
            2-3 sentences highlighting your key strengths and career goals
          </p>
        </div>
      </div>
    );
  }

  if (section === 'experience') {
    return (
      <div className="space-y-6">
        {/* Experience Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Work Experience</h3>
            <Button onClick={addExperience} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
          {data.experience.map((exp) => (
            <Card key={exp.id} className="p-4 mb-4 relative">
              <div className="flex justify-between items-start mb-3">
                <AIAssistantButton
                  type="job-description"
                  context={{
                    title: exp.title,
                    company: exp.company
                  }}
                  onGenerated={(text) => updateExperience(exp.id, 'description', text)}
                  label="AI Generate Description"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Job Title *</Label>
                    <Input
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <Label>Company *</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Tech Corp"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      placeholder="New York, NY"
                    />
                  </div>
                  <div>
                    <Label>Start Date *</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      disabled={exp.current}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onCheckedChange={(checked) =>
                      updateExperience(exp.id, 'current', checked)
                    }
                  />
                  <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal">
                    I currently work here
                  </Label>
                </div>
                <div>
                  <Label>Description *</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="• Led team of 5 developers&#10;• Increased performance by 40%&#10;• Implemented CI/CD pipelines"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use bullet points to highlight key achievements
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Education Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Education</h3>
            <Button onClick={addEducation} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
          {data.education.map((edu) => (
            <Card key={edu.id} className="p-4 mb-4 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => removeEducation(edu.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Degree *</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="B.S. Computer Science"
                    />
                  </div>
                  <div>
                    <Label>Institution *</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="Stanford University"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                      placeholder="Stanford, CA"
                    />
                  </div>
                  <div>
                    <Label>Graduation Date *</Label>
                    <Input
                      type="month"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>GPA (Optional)</Label>
                    <Input
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      placeholder="3.8/4.0"
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Skills section
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Skills</h3>
          <Button onClick={addSkillCategory} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
        {data.skills.map((skill) => (
          <Card key={skill.id} className="p-4 mb-4 relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => removeSkillCategory(skill.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <div className="space-y-3">
              <div>
                <Label>Category *</Label>
                <Input
                  value={skill.category}
                  onChange={(e) =>
                    updateSkillCategory(skill.id, e.target.value, skill.items.join(', '))
                  }
                  placeholder="Programming Languages"
                />
              </div>
              <div>
                <Label>Skills (comma separated) *</Label>
                <Input
                  value={skill.items.join(', ')}
                  onChange={(e) =>
                    updateSkillCategory(skill.id, skill.category, e.target.value)
                  }
                  placeholder="JavaScript, Python, React, Node.js"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResumeForm;
