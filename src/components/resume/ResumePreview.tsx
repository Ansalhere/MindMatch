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
      className="resume-preview bg-white text-black"
      style={{
        width: `${A4_WIDTH_PX}px`,
        minHeight: `${A4_HEIGHT_PX}px`,
        padding: `${PADDING_PX}px`,
        boxSizing: 'border-box',
        fontSize: '12px',
        lineHeight: '1.5',
        fontFamily: 'Arial, Helvetica, sans-serif',
        margin: '0 auto',
      }}
    >
      <style>{`
        .resume-preview * {
          box-sizing: border-box;
        }
        .resume-preview h1 {
          font-size: 24px;
          line-height: 1.2;
          margin: 0 0 8px 0;
        }
        .resume-preview h2 {
          font-size: 14px;
          line-height: 1.3;
          margin: 0 0 8px 0;
          break-after: avoid;
          page-break-after: avoid;
        }
        .resume-preview h2 + * {
          break-before: avoid;
          page-break-before: avoid;
        }
        .resume-preview h3 {
          font-size: 13px;
          line-height: 1.3;
          margin: 0;
          break-after: avoid;
          page-break-after: avoid;
        }
        .resume-preview h3 + * {
          break-before: avoid;
          page-break-before: avoid;
        }
        .resume-preview p {
          margin: 0;
          font-size: 12px;
          line-height: 1.5;
        }
        .resume-preview section,
        .resume-preview .resume-section {
          break-inside: avoid-column;
          page-break-inside: avoid;
          margin-bottom: 16px;
        }
        .resume-preview .space-y-6 > * + * {
          margin-top: 20px;
        }
        .resume-preview .space-y-4 > * + * {
          margin-top: 14px;
        }
        .resume-preview .space-y-3 > * + * {
          margin-top: 10px;
        }
        .resume-preview .space-y-2 > * + * {
          margin-top: 6px;
        }
        .resume-preview .flex {
          display: flex;
        }
        .resume-preview .flex-wrap {
          flex-wrap: wrap;
        }
        .resume-preview .items-center {
          align-items: center;
        }
        .resume-preview .items-baseline {
          align-items: baseline;
        }
        .resume-preview .justify-between {
          justify-content: space-between;
        }
        .resume-preview .gap-1 {
          gap: 4px;
        }
        .resume-preview .gap-x-4 {
          column-gap: 16px;
        }
        .resume-preview .gap-y-1 {
          row-gap: 4px;
        }
        .resume-preview .text-xs {
          font-size: 10px;
        }
        .resume-preview .text-sm {
          font-size: 11px;
        }
        .resume-preview .text-lg {
          font-size: 14px;
        }
        .resume-preview .text-3xl {
          font-size: 24px;
        }
        .resume-preview .font-bold {
          font-weight: 700;
        }
        .resume-preview .font-medium {
          font-weight: 500;
        }
        .resume-preview .uppercase {
          text-transform: uppercase;
        }
        .resume-preview .tracking-wide {
          letter-spacing: 0.05em;
        }
        .resume-preview .border-b-2 {
          border-bottom: 2px solid;
        }
        .resume-preview .border-gray-800 {
          border-color: #1f2937;
        }
        .resume-preview .pb-4 {
          padding-bottom: 16px;
        }
        .resume-preview .mb-1 {
          margin-bottom: 4px;
        }
        .resume-preview .mb-2 {
          margin-bottom: 8px;
        }
        .resume-preview .mb-3 {
          margin-bottom: 12px;
        }
        .resume-preview .pl-4 {
          padding-left: 16px;
        }
        .resume-preview .text-gray-900 {
          color: #111827;
        }
        .resume-preview .text-gray-700 {
          color: #374151;
        }
        .resume-preview .text-gray-600 {
          color: #4b5563;
        }
        .resume-preview .whitespace-pre-line {
          white-space: pre-line;
        }
        .resume-preview .leading-relaxed {
          line-height: 1.625;
        }
        .resume-preview .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
