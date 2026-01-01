import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles } from 'lucide-react';
import { ResumeTemplate, ResumeData } from '@/pages/ResumeBuilder';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import TechTemplate from './templates/TechTemplate';
import CompactTemplate from './templates/CompactTemplate';
import ElegantTemplate from './templates/ElegantTemplate';
import BoldTemplate from './templates/BoldTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import GraduateTemplate from './templates/GraduateTemplate';
import ATSFriendlyTemplate from './templates/ATSFriendlyTemplate';
import InfographicTemplate from './templates/InfographicTemplate';
import NeonTemplate from './templates/NeonTemplate';
import TimelineTemplate from './templates/TimelineTemplate';
import SplitTemplate from './templates/SplitTemplate';
import MetroTemplate from './templates/MetroTemplate';

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
}

const templates = [
  {
    id: 'professional' as ResumeTemplate,
    name: 'Professional',
    description: 'Clean and traditional design perfect for corporate roles',
    badge: 'Most Popular',
  },
  {
    id: 'modern' as ResumeTemplate,
    name: 'Modern',
    description: 'Contemporary layout with accent colors for creative industries',
    badge: 'Trending',
  },
  {
    id: 'tech' as ResumeTemplate,
    name: 'Tech Pro',
    description: 'Tech-focused design with skills highlighted prominently',
    badge: null,
  },
  {
    id: 'ats-friendly' as ResumeTemplate,
    name: 'ATS-Friendly',
    description: 'Maximum ATS compatibility with simple text-based format',
    badge: 'Recommended',
  },
  {
    id: 'graduate' as ResumeTemplate,
    name: 'Graduate',
    description: 'Perfect for fresh graduates with education-focused layout',
    badge: 'New',
  },
  {
    id: 'infographic' as ResumeTemplate,
    name: 'Infographic',
    description: 'Visual resume with skill bars and modern sidebar design',
    badge: 'New',
  },
  {
    id: 'creative' as ResumeTemplate,
    name: 'Creative',
    description: 'Bold and unique design for designers and artists',
    badge: null,
  },
  {
    id: 'compact' as ResumeTemplate,
    name: 'Compact',
    description: 'Space-efficient two-column layout for extensive experience',
    badge: null,
  },
  {
    id: 'minimal' as ResumeTemplate,
    name: 'Minimal',
    description: 'Simple and elegant with maximum white space',
    badge: null,
  },
  {
    id: 'executive' as ResumeTemplate,
    name: 'Executive',
    description: 'Premium design for senior leadership positions',
    badge: 'Premium',
  },
  {
    id: 'elegant' as ResumeTemplate,
    name: 'Elegant',
    description: 'Refined typography with centered layout for a sophisticated look',
    badge: null,
  },
  {
    id: 'bold' as ResumeTemplate,
    name: 'Bold',
    description: 'High contrast dark header with vibrant accents for impact',
    badge: null,
  },
  {
    id: 'classic' as ResumeTemplate,
    name: 'Classic',
    description: 'Traditional timeless design perfect for any industry',
    badge: null,
  },
  {
    id: 'neon' as ResumeTemplate,
    name: 'Neon',
    description: 'Dark theme with vibrant neon accents for creative tech roles',
    badge: 'Hot',
  },
  {
    id: 'timeline' as ResumeTemplate,
    name: 'Timeline',
    description: 'Visual timeline layout showcasing your career journey',
    badge: 'New',
  },
  {
    id: 'split' as ResumeTemplate,
    name: 'Split',
    description: 'Two-tone split design with dark sidebar and light content',
    badge: 'New',
  },
  {
    id: 'metro' as ResumeTemplate,
    name: 'Metro',
    description: 'Bold colorful tiles inspired by metro UI design',
    badge: 'Creative',
  },
];

// Sample data for template previews
const sampleData: ResumeData = {
  personalInfo: {
    fullName: 'John Anderson',
    email: 'john@email.com',
    phone: '+1 234 567 890',
    location: 'New York, NY',
    linkedin: 'linkedin.com/in/john',
    summary: 'Experienced software engineer with 5+ years building scalable applications.',
  },
  experience: [
    {
      id: '1',
      title: 'Senior Developer',
      company: 'Tech Corp',
      location: 'NYC',
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: '• Led team of 5 engineers\n• Increased performance by 40%',
    },
    {
      id: '2',
      title: 'Developer',
      company: 'StartupXYZ',
      location: 'Boston',
      startDate: '2018-06',
      endDate: '2019-12',
      current: false,
      description: '• Built core features\n• Improved user retention',
    },
  ],
  education: [
    {
      id: '1',
      degree: 'B.S. Computer Science',
      institution: 'MIT',
      location: 'Cambridge, MA',
      graduationDate: '2018',
      gpa: '3.8',
    },
  ],
  skills: [
    { id: '1', category: 'Languages', items: ['JavaScript', 'Python', 'Go'] },
    { id: '2', category: 'Frameworks', items: ['React', 'Node.js', 'Django'] },
  ],
  certifications: [
    { id: '1', name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2022' },
  ],
  projects: [
    { id: '1', name: 'E-commerce Platform', description: 'Built full-stack e-commerce', technologies: ['React', 'Node'] },
  ],
};

const TemplatePreview = ({ templateId }: { templateId: ResumeTemplate }) => {
  const renderMiniTemplate = () => {
    switch (templateId) {
      case 'professional':
        return <ProfessionalTemplate data={sampleData} />;
      case 'modern':
        return <ModernTemplate data={sampleData} />;
      case 'creative':
        return <CreativeTemplate data={sampleData} />;
      case 'minimal':
        return <MinimalTemplate data={sampleData} />;
      case 'executive':
        return <ExecutiveTemplate data={sampleData} />;
      case 'tech':
        return <TechTemplate data={sampleData} />;
      case 'compact':
        return <CompactTemplate data={sampleData} />;
      case 'elegant':
        return <ElegantTemplate data={sampleData} />;
      case 'bold':
        return <BoldTemplate data={sampleData} />;
      case 'classic':
        return <ClassicTemplate data={sampleData} />;
      case 'graduate':
        return <GraduateTemplate data={sampleData} />;
      case 'ats-friendly':
        return <ATSFriendlyTemplate data={sampleData} />;
      case 'infographic':
        return <InfographicTemplate data={sampleData} />;
      case 'neon':
        return <NeonTemplate data={sampleData} />;
      case 'timeline':
        return <TimelineTemplate data={sampleData} />;
      case 'split':
        return <SplitTemplate data={sampleData} />;
      case 'metro':
        return <MetroTemplate data={sampleData} />;
      default:
        return <ProfessionalTemplate data={sampleData} />;
    }
  };

  return (
    <div className="w-full h-full bg-white text-black overflow-hidden" style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400%', height: '400%' }}>
      <div className="p-4">
        {renderMiniTemplate()}
      </div>
    </div>
  );
};

const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-3">Choose Your Template ({templates.length} Available)</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg relative overflow-hidden group ${
              selectedTemplate === template.id
                ? 'ring-2 ring-primary shadow-lg'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-3 w-3" />
              </div>
            )}
            
            {template.badge && (
              <Badge className="absolute top-2 left-2 z-10 text-[10px] px-1.5 py-0.5">
                {template.badge}
              </Badge>
            )}
            
            {/* Live Template Preview */}
            <div className="aspect-[8.5/11] bg-gray-100 overflow-hidden relative">
              <TemplatePreview templateId={template.id} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="p-2 border-t bg-card">
              <h3 className="font-semibold text-xs mb-0.5">{template.name}</h3>
              <p className="text-[10px] text-muted-foreground line-clamp-2">
                {template.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
