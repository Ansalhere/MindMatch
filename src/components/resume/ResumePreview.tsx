import { ResumeData, ResumeTemplate } from '@/pages/ResumeBuilder';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import ModernTemplate from './templates/ModernTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import TechTemplate from './templates/TechTemplate';
import CompactTemplate from './templates/CompactTemplate';

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
      case 'tech':
        return <TechTemplate data={data} />;
      case 'compact':
        return <CompactTemplate data={data} />;
      default:
        return <ProfessionalTemplate data={data} />;
    }
  };

  return (
    <div 
      className="resume-preview bg-white text-black"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}
    >
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
