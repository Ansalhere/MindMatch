import { ResumeData, ResumeTemplate } from '@/pages/ResumeBuilder';
import ResumePreview from './ResumePreview';
import { useEffect, useRef, useState } from 'react';

interface PagedResumePreviewProps {
  template: ResumeTemplate;
  data: ResumeData;
  showPageBreaks?: boolean;
}

// A4 dimensions at 96 DPI
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

const PagedResumePreview = ({ template, data, showPageBreaks = true }: PagedResumePreviewProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const pages = Math.ceil(contentHeight / A4_HEIGHT_PX);
      setPageCount(Math.max(1, pages));
    }
  }, [data, template]);

  return (
    <div className="relative">
      {/* Main resume content */}
      <div ref={contentRef}>
        <ResumePreview template={template} data={data} />
      </div>

      {/* Page break indicators overlay */}
      {showPageBreaks && pageCount > 1 && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: pageCount - 1 }, (_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 flex items-center justify-center"
              style={{
                top: `${(i + 1) * A4_HEIGHT_PX}px`,
                height: '40px',
                marginTop: '-20px',
              }}
            >
              {/* Page break line */}
              <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-destructive/50" />
              
              {/* Page labels */}
              <div className="absolute left-2 -top-6 bg-muted/90 backdrop-blur-sm text-xs text-muted-foreground px-2 py-0.5 rounded-t border border-b-0 border-border">
                End of Page {i + 1}
              </div>
              <div className="absolute left-2 top-6 bg-muted/90 backdrop-blur-sm text-xs text-muted-foreground px-2 py-0.5 rounded-b border border-t-0 border-border">
                Page {i + 2}
              </div>
              
              {/* Center badge */}
              <div className="relative bg-destructive/10 backdrop-blur-sm text-destructive text-xs font-medium px-3 py-1 rounded-full border border-destructive/30">
                Page Break
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Page spacing indicators */}
      {showPageBreaks && pageCount > 1 && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: pageCount - 1 }, (_, i) => (
            <div
              key={`spacing-${i}`}
              className="absolute left-0 right-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent"
              style={{
                top: `${(i + 1) * A4_HEIGHT_PX - 20}px`,
                height: '40px',
              }}
            />
          ))}
        </div>
      )}

      {/* Page count indicator */}
      {pageCount > 0 && (
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-xs text-muted-foreground px-2 py-1 rounded-md border border-border shadow-sm">
          {pageCount} {pageCount === 1 ? 'page' : 'pages'}
        </div>
      )}
    </div>
  );
};

export default PagedResumePreview;
