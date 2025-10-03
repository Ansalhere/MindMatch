import { ResumeData, ResumeTemplate } from '@/pages/ResumeBuilder';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';

interface ResumePreviewProps {
  template: ResumeTemplate;
  data: ResumeData;
}

const ResumePreview = ({ template, data }: ResumePreviewProps) => {
  const renderTemplate = () => {
    switch (template) {
      case 'professional':
        return <ProfessionalTemplate data={data} />;
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'minimal':
        return <MinimalTemplate data={data} />;
      case 'executive':
        return <ExecutiveTemplate data={data} />;
      default:
        return <ProfessionalTemplate data={data} />;
    }
  };

  return (
    <div className="w-full min-h-[11in] bg-white text-black p-8 resume-preview">
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
