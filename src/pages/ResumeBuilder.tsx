import { useState } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Eye, Sparkles } from 'lucide-react';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumePreview from '@/components/resume/ResumePreview';
import TemplateSelector from '@/components/resume/TemplateSelector';
import { useToast } from '@/hooks/use-toast';

export type ResumeTemplate = 'professional' | 'modern' | 'creative' | 'minimal' | 'executive' | 'tech' | 'compact';

export interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    portfolio?: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
}

const ResumeBuilder = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('professional');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
  });

  const handleDownload = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const resumeElement = document.querySelector('.resume-preview') as HTMLElement;
      if (!resumeElement) {
        toast({ title: "Error", description: "Resume preview not found", variant: "destructive" });
        return;
      }

      toast({ title: "Preparing Download", description: "Generating your PDF resume..." });

      // Capture the resume as canvas
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Download
      const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_${selectedTemplate}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Success!",
        description: "Your resume has been downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Download Failed",
        description: "There was an error creating your PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <SEOHead
        title="Professional Resume Builder - Create ATS-Friendly Resumes | RankMe.AI"
        description="Build professional, ATS-optimized resumes with our free resume builder. Choose from multiple templates including modern, creative, and executive designs. Download as PDF instantly."
        keywords="resume builder, CV maker, ATS resume, professional resume templates, free resume builder, resume creator, job application"
        canonical="/resume-builder"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-3">
                <FileText className="h-8 w-8 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Resume Builder
                </h1>
              </div>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Create professional, ATS-optimized resumes in minutes. Choose from multiple templates and download as PDF.
              </p>
            </div>

            {/* Template Selector */}
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Left: Form */}
              <Card className="p-6 h-fit sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Resume Details
                  </h2>
                  <Button onClick={handleDownload} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>

                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="other">Skills & More</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="space-y-4">
                    <ResumeForm 
                      section="personal" 
                      data={resumeData}
                      onChange={setResumeData}
                    />
                  </TabsContent>
                  
                  <TabsContent value="experience" className="space-y-4">
                    <ResumeForm 
                      section="experience" 
                      data={resumeData}
                      onChange={setResumeData}
                    />
                  </TabsContent>
                  
                  <TabsContent value="other" className="space-y-4">
                    <ResumeForm 
                      section="skills" 
                      data={resumeData}
                      onChange={setResumeData}
                    />
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Right: Preview */}
              <div className="sticky top-4">
                <Card className="p-6 bg-white dark:bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Live Preview
                    </h2>
                  </div>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <ResumePreview 
                      template={selectedTemplate}
                      data={resumeData}
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ResumeBuilder;
