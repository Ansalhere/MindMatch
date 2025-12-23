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

// A4 dimensions at 96 DPI (standard screen resolution)
// 210mm × 297mm = 794px × 1123px at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const PADDING_PX = 48; // ~12.7mm padding

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
        width: `${A4_WIDTH_PX}px`,
        minHeight: `${A4_HEIGHT_PX}px`,
        padding: `${PADDING_PX}px`,
        boxSizing: 'border-box',
        fontSize: '12px',
        lineHeight: '1.5',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
