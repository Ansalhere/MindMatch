import { ResumeData, ResumeTemplate } from '@/pages/ResumeBuilder';
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
      case 'elegant':
        return <ElegantTemplate data={data} />;
      case 'bold':
        return <BoldTemplate data={data} />;
      case 'classic':
        return <ClassicTemplate data={data} />;
      case 'graduate':
        return <GraduateTemplate data={data} />;
      case 'ats-friendly':
        return <ATSFriendlyTemplate data={data} />;
      case 'infographic':
        return <InfographicTemplate data={data} />;
      default:
        return <ProfessionalTemplate data={data} />;
    }
  };

  return (
    <div 
      className="resume-preview bg-white text-black w-full"
      style={{
        width: '100%',
        maxWidth: `${A4_WIDTH_PX}px`,
        minHeight: `${A4_HEIGHT_PX}px`,
        padding: `${PADDING_PX}px`,
        boxSizing: 'border-box',
        fontSize: '12px',
        lineHeight: '1.5',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <style>{`
        .resume-preview h2 {
          break-after: avoid;
          page-break-after: avoid;
        }
        .resume-preview h2 + * {
          break-before: avoid;
          page-break-before: avoid;
        }
        .resume-preview section,
        .resume-preview .resume-section {
          break-inside: avoid-column;
          page-break-inside: avoid;
        }
        .resume-preview h3 {
          break-after: avoid;
          page-break-after: avoid;
        }
        .resume-preview h3 + * {
          break-before: avoid;
          page-break-before: avoid;
        }
      `}</style>
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
