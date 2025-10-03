import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { ResumeTemplate } from '@/pages/ResumeBuilder';

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
    preview: '/templates/professional.svg',
  },
  {
    id: 'modern' as ResumeTemplate,
    name: 'Modern',
    description: 'Contemporary layout with accent colors for creative industries',
    badge: 'Trending',
    preview: '/templates/modern.svg',
  },
  {
    id: 'creative' as ResumeTemplate,
    name: 'Creative',
    description: 'Bold and unique design for designers and artists',
    badge: 'New',
    preview: '/templates/creative.svg',
  },
  {
    id: 'minimal' as ResumeTemplate,
    name: 'Minimal',
    description: 'Simple and elegant with maximum white space',
    badge: null,
    preview: '/templates/minimal.svg',
  },
  {
    id: 'executive' as ResumeTemplate,
    name: 'Executive',
    description: 'Premium design for senior leadership positions',
    badge: 'Premium',
    preview: '/templates/executive.svg',
  },
];

const TemplateSelector = ({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Choose Your Template</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-lg relative overflow-hidden ${
              selectedTemplate === template.id
                ? 'ring-2 ring-primary shadow-lg'
                : 'hover:border-primary/50'
            }`}
            onClick={() => onTemplateChange(template.id)}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
            
            {template.badge && (
              <Badge className="absolute top-2 left-2 z-10 text-xs">
                {template.badge}
              </Badge>
            )}
            
            <div className="aspect-[8.5/11] bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center p-4">
              <div className="w-full h-full bg-white dark:bg-card rounded shadow-sm flex items-center justify-center text-muted-foreground text-xs">
                Preview
              </div>
            </div>
            
            <div className="p-3 border-t">
              <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
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
