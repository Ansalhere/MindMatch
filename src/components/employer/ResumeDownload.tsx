import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface ResumeDownloadProps {
  candidateId: string;
  candidateName: string;
  resumeUrl?: string;
}

const ResumeDownload = ({ candidateId, candidateName, resumeUrl }: ResumeDownloadProps) => {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!resumeUrl) {
      toast({
        title: "No resume available",
        description: "This candidate hasn't uploaded a resume yet",
        variant: "destructive"
      });
      return;
    }

    setDownloading(true);
    
    try {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(resumeUrl);

      if (error) throw error;

      // Create blob and download
      const blob = new Blob([data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${candidateName.replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Resume downloaded",
        description: `${candidateName}'s resume has been downloaded successfully`
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };

  if (!resumeUrl) {
    return (
      <Button variant="outline" size="sm" disabled>
        <FileText className="h-4 w-4 mr-2" />
        No Resume
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={downloading}
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Download Resume
        </>
      )}
    </Button>
  );
};

export default ResumeDownload;