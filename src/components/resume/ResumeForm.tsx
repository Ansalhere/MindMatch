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
          <Label htmlFor="fullName" className="text-sm font-medium">Full Name *</Label>
          <Input
            id="fullName"
            value={data.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
            placeholder="John Doe"
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.personalInfo.email}
              onChange={(e) => updatePersonalInfo('email', e.target.value)}
              placeholder="john@example.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-sm font-medium">Phone *</Label>
            <Input
              id="phone"
              value={data.personalInfo.phone}
              onChange={(e) => updatePersonalInfo('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="location" className="text-sm font-medium">Location *</Label>
          <Input
            id="location"
            value={data.personalInfo.location}
            onChange={(e) => updatePersonalInfo('location', e.target.value)}
            placeholder="San Francisco, CA"
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn (Optional)</Label>
            <Input
              id="linkedin"
              value={data.personalInfo.linkedin || ''}
              onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="portfolio" className="text-sm font-medium">Portfolio (Optional)</Label>
            <Input
              id="portfolio"
              value={data.personalInfo.portfolio || ''}
              onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
              placeholder="johndoe.com"
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
            <Label htmlFor="summary" className="text-sm font-medium">Professional Summary *</Label>
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
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1.5">
            Write 2-3 sentences about your key strengths and goals
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-base">Work Experience</h3>
            <Button onClick={addExperience} size="sm" variant="outline" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>
          {data.experience.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
              No experience added yet. Click "Add Experience" to get started.
            </p>
          )}
          {data.experience.map((exp) => (
            <Card key={exp.id} className="p-4 mb-4 relative">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3">
                <AIAssistantButton
                  type="job-description"
                  context={{
                    title: exp.title,
                    company: exp.company
                  }}
                  onGenerated={(text) => updateExperience(exp.id, 'description', text)}
                  label="AI Generate"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-2 right-2 sm:static"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Job Title *</Label>
                    <Input
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                      placeholder="Software Engineer"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Company *</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      placeholder="Tech Corp"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-sm">Location</Label>
                    <Input
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                      placeholder="New York, NY"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Start Date *</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">End Date</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                      disabled={exp.current}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 py-1">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onCheckedChange={(checked) =>
                      updateExperience(exp.id, 'current', checked)
                    }
                  />
                  <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal cursor-pointer">
                    I currently work here
                  </Label>
                </div>
                <div>
                  <Label className="text-sm">Description *</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    placeholder="• Led team of 5 developers&#10;• Increased performance by 40%"
                    rows={4}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use bullet points for achievements
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Education Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-base">Education</h3>
            <Button onClick={addEducation} size="sm" variant="outline" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
          {data.education.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
              No education added yet. Click "Add Education" to get started.
            </p>
          )}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Degree *</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="B.S. Computer Science"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Institution *</Label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="Stanford University"
                      className="mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-sm">Location</Label>
                    <Input
                      value={edu.location}
                      onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                      placeholder="Stanford, CA"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Graduation *</Label>
                    <Input
                      type="month"
                      value={edu.graduationDate}
                      onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm">GPA (Optional)</Label>
                    <Input
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                      placeholder="3.8/4.0"
                      className="mt-1"
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="font-semibold text-base">Skills</h3>
          <Button onClick={addSkillCategory} size="sm" variant="outline" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Skill Category
          </Button>
        </div>
        {data.skills.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
            No skills added yet. Click "Add Skill Category" to organize your skills.
          </p>
        )}
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
            <div className="space-y-3 pr-8">
              <div>
                <Label className="text-sm">Category *</Label>
                <Input
                  value={skill.category}
                  onChange={(e) =>
                    updateSkillCategory(skill.id, e.target.value, skill.items.join(', '))
                  }
                  placeholder="Programming Languages"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Skills (comma separated) *</Label>
                <Input
                  value={skill.items.join(', ')}
                  onChange={(e) =>
                    updateSkillCategory(skill.id, skill.category, e.target.value)
                  }
                  placeholder="JavaScript, Python, React"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate each skill with a comma
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResumeForm;
