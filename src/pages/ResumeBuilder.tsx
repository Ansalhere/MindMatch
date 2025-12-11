import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, Download, Eye, Upload, User, Crown, CheckCircle2, 
  Sparkles, Loader2, ChevronDown, ChevronUp, Palette, 
  Settings, Target, PanelRightClose, PanelRight
} from 'lucide-react';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumePreview from '@/components/resume/ResumePreview';
import TemplateSelector from '@/components/resume/TemplateSelector';
import ATSScoreCard from '@/components/resume/ATSScoreCard';
import ResumePremiumGate from '@/components/resume/ResumePremiumGate';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { useResumeLimit } from '@/hooks/useResumeLimit';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const { user } = useUser();
  const { canDownload, remainingDownloads, downloadCount, isPremium, recordDownload, upgradeToPremium } = useResumeLimit();
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('professional');
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTailoring, setShowTailoring] = useState(false);
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

  // Load user profile data on mount
  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user?.id]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id);

      const { data: experiences } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      const { data: education } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      const { data: certifications } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', user.id)
        .order('issue_date', { ascending: false });

      const skillsGrouped = skills?.reduce((acc, skill) => {
        const category = 'Technical Skills';
        const existing = acc.find(s => s.category === category);
        if (existing) {
          existing.items.push(skill.name);
        } else {
          acc.push({ id: crypto.randomUUID(), category, items: [skill.name] });
        }
        return acc;
      }, [] as ResumeData['skills']) || [];

      setResumeData({
        personalInfo: {
          fullName: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          location: user.location || '',
          summary: user.bio || '',
        },
        experience: experiences?.map(exp => ({
          id: exp.id,
          title: exp.role,
          company: exp.company,
          location: exp.location || '',
          startDate: exp.start_date,
          endDate: exp.end_date || '',
          current: exp.is_current || false,
          description: exp.description || '',
        })) || [],
        education: education?.map(edu => ({
          id: edu.id,
          degree: edu.degree,
          institution: edu.institution,
          location: '',
          graduationDate: edu.end_date || '',
          gpa: edu.gpa?.toString() || '',
        })) || [],
        skills: skillsGrouped,
        certifications: certifications?.map(cert => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          date: cert.issue_date,
        })) || [],
        projects: [],
      });

      toast.success('Profile data loaded!');
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      event.target.value = '';
      return;
    }

    toast.info("Parsing your resume...");

    try {
      const fileContent = await readFileAsText(file);
      
      const { data, error } = await supabase.functions.invoke('resume-ai-assistant', {
        body: { 
          type: 'parse',
          context: { 
            fileName: file.name,
            fileContent: fileContent.substring(0, 10000)
          }
        }
      });

      if (error) throw error;

      if (data?.resumeData) {
        const mergedData = mergeResumeData(resumeData, data.resumeData);
        setResumeData(mergedData);
        toast.success("Resume parsed successfully!");
      } else {
        toast.warning("Could not extract all data. Please fill in missing details.");
      }
    } catch (error: any) {
      console.error('Error parsing resume:', error);
      toast.error(error.message || "Could not process your resume.");
    } finally {
      event.target.value = '';
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string || '');
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const mergeResumeData = (existing: ResumeData, parsed: ResumeData): ResumeData => {
    return {
      personalInfo: {
        fullName: parsed.personalInfo?.fullName || existing.personalInfo.fullName,
        email: parsed.personalInfo?.email || existing.personalInfo.email,
        phone: parsed.personalInfo?.phone || existing.personalInfo.phone,
        location: parsed.personalInfo?.location || existing.personalInfo.location,
        linkedin: parsed.personalInfo?.linkedin || existing.personalInfo.linkedin,
        portfolio: parsed.personalInfo?.portfolio || existing.personalInfo.portfolio,
        summary: parsed.personalInfo?.summary || existing.personalInfo.summary,
      },
      experience: parsed.experience?.length > 0 ? parsed.experience.map(exp => ({
        ...exp,
        id: exp.id || crypto.randomUUID()
      })) : existing.experience,
      education: parsed.education?.length > 0 ? parsed.education.map(edu => ({
        ...edu,
        id: edu.id || crypto.randomUUID()
      })) : existing.education,
      skills: parsed.skills?.length > 0 ? parsed.skills.map(skill => ({
        ...skill,
        id: skill.id || crypto.randomUUID(),
        items: skill.items || []
      })) : existing.skills,
      certifications: parsed.certifications?.length > 0 ? parsed.certifications.map(cert => ({
        ...cert,
        id: cert.id || crypto.randomUUID()
      })) : existing.certifications,
      projects: parsed.projects?.length > 0 ? parsed.projects.map(proj => ({
        ...proj,
        id: proj.id || crypto.randomUUID(),
        technologies: proj.technologies || []
      })) : existing.projects,
    };
  };

  const handleTailorToJob = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    if (!resumeData.personalInfo.fullName && resumeData.experience.length === 0) {
      toast.error("Please add some resume content first");
      return;
    }

    setIsTailoring(true);
    toast.info("Tailoring your resume...");

    try {
      const { data, error } = await supabase.functions.invoke('resume-ai-assistant', {
        body: { 
          type: 'tailor-to-job',
          context: { 
            jobDescription: jobDescription.trim(),
            resumeData 
          }
        }
      });

      if (error) throw error;

      if (data?.resumeData) {
        setResumeData(data.resumeData);
        toast.success("Resume tailored successfully!");
        setShowTailoring(false);
      } else {
        toast.warning("Could not tailor resume. Please try again.");
      }
    } catch (error: any) {
      console.error('Error tailoring resume:', error);
      toast.error(error.message || "Could not tailor your resume.");
    } finally {
      setIsTailoring(false);
    }
  };

  const handleDownload = async () => {
    if (!canDownload) {
      setShowPremiumGate(true);
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const resumeElement = document.querySelector('.resume-preview') as HTMLElement;
      if (!resumeElement) {
        toast.error("Resume preview not found");
        return;
      }

      toast.info("Generating your PDF...");

      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_${selectedTemplate}_ATS.pdf`;
      pdf.save(fileName);

      recordDownload(selectedTemplate);
      toast.success("Resume downloaded!");
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error("Error creating PDF. Please try again.");
    }
  };

  const templateNames: Record<ResumeTemplate, string> = {
    professional: 'Professional',
    modern: 'Modern',
    creative: 'Creative',
    minimal: 'Minimal',
    executive: 'Executive',
    tech: 'Tech Pro',
    compact: 'Compact'
  };

  return (
    <>
      <SEOHead
        title="ATS-Friendly Resume Builder - Create Professional Resumes | RankMe.AI"
        description="Build professional, ATS-optimized resumes with our free resume builder. Real-time ATS score, expert tips, and multiple templates."
        keywords="ATS resume builder, ATS-friendly resume, CV maker, professional resume templates"
        canonical="/resume-builder"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Compact Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Resume Builder</h1>
                    {isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ATS-Optimized Templates
                  </p>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                {user && (
                  <Button onClick={loadUserProfile} variant="outline" size="sm" className="gap-1.5">
                    <User className="h-4 w-4" />
                    Load Profile
                  </Button>
                )}
                <Button variant="outline" size="sm" className="relative gap-1.5">
                  <Upload className="h-4 w-4" />
                  Upload Resume
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
                <Button onClick={handleDownload} size="sm" className="gap-1.5">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Main Layout */}
            <div className="flex gap-6">
              {/* Left Panel - Editor */}
              <div className={`flex-1 space-y-4 transition-all ${showPreview ? 'lg:max-w-[55%]' : ''}`}>
                
                {/* Template & Options Bar */}
                <Card className="p-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="gap-2"
                    >
                      <Palette className="h-4 w-4" />
                      {templateNames[selectedTemplate]}
                      {showTemplates ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowTailoring(!showTailoring)}
                      className="gap-2"
                    >
                      <Target className="h-4 w-4" />
                      Tailor to Job
                      {showTailoring ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>

                    <div className="flex-1" />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPreview(!showPreview)}
                      className="gap-2 hidden lg:flex"
                    >
                      {showPreview ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </Button>

                    {!isPremium && remainingDownloads <= 0 && (
                      <Button 
                        onClick={() => setShowPremiumGate(true)} 
                        size="sm"
                        className="gap-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                      >
                        <Crown className="h-3.5 w-3.5" />
                        Upgrade
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Template Selector - Collapsible */}
                <Collapsible open={showTemplates} onOpenChange={setShowTemplates}>
                  <CollapsibleContent>
                    <Card className="p-4">
                      <TemplateSelector
                        selectedTemplate={selectedTemplate}
                        onTemplateChange={(t) => {
                          setSelectedTemplate(t);
                          setShowTemplates(false);
                        }}
                      />
                    </Card>
                  </CollapsibleContent>
                </Collapsible>

                {/* Job Tailoring - Collapsible */}
                <Collapsible open={showTailoring} onOpenChange={setShowTailoring}>
                  <CollapsibleContent>
                    <Card className="p-4 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">AI Job Tailoring</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Paste a job description to optimize your resume for the role.
                      </p>
                      <Textarea 
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="min-h-[100px] mb-3"
                      />
                      <Button 
                        onClick={handleTailorToJob} 
                        disabled={isTailoring || !jobDescription.trim()}
                        className="w-full gap-2"
                      >
                        {isTailoring ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Tailoring...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Tailor Resume
                          </>
                        )}
                      </Button>
                    </Card>
                  </CollapsibleContent>
                </Collapsible>

                {/* ATS Score - Compact */}
                <ATSScoreCard data={resumeData} />

                {/* Resume Form */}
                <Card className="p-4">
                  <Tabs defaultValue="personal" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="personal" className="text-sm">Personal</TabsTrigger>
                      <TabsTrigger value="experience" className="text-sm">Experience</TabsTrigger>
                      <TabsTrigger value="other" className="text-sm">Skills & More</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="personal" className="space-y-4 mt-0">
                      <ResumeForm 
                        section="personal" 
                        data={resumeData}
                        onChange={setResumeData}
                      />
                    </TabsContent>
                    
                    <TabsContent value="experience" className="space-y-4 mt-0">
                      <ResumeForm 
                        section="experience" 
                        data={resumeData}
                        onChange={setResumeData}
                      />
                    </TabsContent>
                    
                    <TabsContent value="other" className="space-y-4 mt-0">
                      <ResumeForm 
                        section="skills" 
                        data={resumeData}
                        onChange={setResumeData}
                      />
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>

              {/* Right Panel - Preview */}
              {showPreview && (
                <div className="hidden lg:block lg:w-[45%]">
                  <div className="sticky top-4">
                    <Card className="p-4 bg-white dark:bg-card">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-semibold flex items-center gap-2">
                          <Eye className="h-4 w-4 text-primary" />
                          Live Preview
                        </h2>
                        <Badge variant="outline" className="text-xs">
                          {templateNames[selectedTemplate]}
                        </Badge>
                      </div>
                      <div className="border rounded-lg overflow-auto bg-white max-h-[calc(100vh-180px)]">
                        <ResumePreview 
                          template={selectedTemplate}
                          data={resumeData}
                        />
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Preview Button */}
            <div className="fixed bottom-4 right-4 lg:hidden z-50">
              <Button 
                onClick={() => setShowPreview(!showPreview)}
                className="shadow-lg gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </Button>
            </div>
          </div>
        </div>

        {/* Premium Gate Modal */}
        <ResumePremiumGate
          open={showPremiumGate}
          onClose={() => setShowPremiumGate(false)}
          resumeCount={downloadCount}
          onUpgrade={upgradeToPremium}
        />
      </Layout>
    </>
  );
};

export default ResumeBuilder;
