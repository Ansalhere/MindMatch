import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, Download, Eye, Upload, User, Crown, CheckCircle2, 
  Sparkles, Loader2, ChevronRight, ChevronLeft, 
  Briefcase, Award, EyeOff
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const resumeRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('professional');
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTailorModal, setShowTailorModal] = useState(false);
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

  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user?.id]);

  const loadUserProfile = async () => {
    if (!user?.id) {
      toast.error('Please login to load your profile');
      return;
    }

    setIsLoadingProfile(true);
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
      toast.error('Failed to load profile');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/msword',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, Word document, or text file");
      event.target.value = '';
      return;
    }

    setIsUploading(true);
    toast.info("Parsing your resume... This may take a moment.");

    try {
      const fileBase64 = await readFileAsBase64(file);
      
      const { data, error } = await supabase.functions.invoke('resume-ai-assistant', {
        body: { 
          type: 'parse',
          context: { 
            fileName: file.name,
            mimeType: file.type,
            fileBase64: fileBase64
          }
        }
      });

      if (error) throw error;

      if (data?.parseError) {
        toast.warning(data.parseError);
      }

      if (data?.resumeData) {
        const mergedData = mergeResumeData(resumeData, data.resumeData);
        setResumeData(mergedData);
        toast.success("Resume parsed successfully!");
      } else {
        toast.warning("Could not extract data. Please fill in details manually.");
      }
    } catch (error: any) {
      console.error('Error parsing resume:', error);
      toast.error(error.message || "Could not process your resume.");
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const base64 = result.split(',')[1] || result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
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
        id: exp.id || crypto.randomUUID(),
      })) : existing.experience,
      education: parsed.education?.length > 0 ? parsed.education.map(edu => ({
        ...edu,
        id: edu.id || crypto.randomUUID()
      })) : existing.education,
      skills: parsed.skills?.length > 0 ? parsed.skills.map(skill => ({
        ...skill,
        id: skill.id || crypto.randomUUID(),
        items: Array.isArray(skill.items) ? skill.items : []
      })) : existing.skills,
      certifications: parsed.certifications?.length > 0 ? parsed.certifications.map(cert => ({
        ...cert,
        id: cert.id || crypto.randomUUID()
      })) : existing.certifications,
      projects: parsed.projects?.length > 0 ? parsed.projects.map(proj => ({
        ...proj,
        id: proj.id || crypto.randomUUID(),
        technologies: Array.isArray(proj.technologies) ? proj.technologies : []
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
        setShowTailorModal(false);
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

    setIsDownloading(true);

    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const resumeElement = resumeRef.current;
      if (!resumeElement) {
        toast.error("Resume preview not found");
        setIsDownloading(false);
        return;
      }

      toast.info("Generating your PDF...");

      // A4 dimensions in mm and pixels at 96 DPI
      const a4WidthMM = 210;
      const a4HeightMM = 297;
      
      // Create canvas with high quality
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculate dimensions
      const imgWidth = a4WidthMM;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Calculate number of pages needed
      let heightLeft = imgHeight;
      let position = 0;
      let pageCount = 0;

      // Add pages
      while (heightLeft > 0) {
        if (pageCount > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= a4HeightMM;
        position -= a4HeightMM;
        pageCount++;
      }
      
      const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_${selectedTemplate}.pdf`;
      pdf.save(fileName);

      recordDownload(selectedTemplate);
      toast.success("Resume downloaded!");
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error("Error creating PDF. Please try again.");
    } finally {
      setIsDownloading(false);
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

  const formSections = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills & More', icon: Award },
  ];

  return (
    <>
      <SEOHead
        title="ATS-Friendly Resume Builder - Create Professional Resumes | RankMe.AI"
        description="Build professional, ATS-optimized resumes with our free resume builder. Real-time ATS score, expert tips, and multiple templates."
        keywords="ATS resume builder, ATS-friendly resume, CV maker, professional resume templates"
        canonical="/resume-builder"
      />
      <Layout>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold flex items-center gap-2">
                      Resume Builder
                      {isPremium && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px]">
                          <Crown className="h-2.5 w-2.5 mr-0.5" />
                          PRO
                        </Badge>
                      )}
                    </h1>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ATS-Optimized
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {user && (
                    <Button 
                      onClick={loadUserProfile} 
                      variant="ghost" 
                      size="sm" 
                      className="hidden sm:flex gap-1.5"
                      disabled={isLoadingProfile}
                    >
                      {isLoadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
                      <span className="hidden md:inline">Load Profile</span>
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative gap-1.5"
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    <span className="hidden md:inline">Upload</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isUploading}
                    />
                  </Button>
                  <Button 
                    onClick={handleDownload} 
                    size="sm" 
                    className="gap-1.5"
                    disabled={isDownloading}
                  >
                    {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Two Column Layout */}
          <div className="flex h-[calc(100vh-73px)]">
            {/* Left Side - Form Editor */}
            <div className="w-full lg:w-1/2 overflow-y-auto border-r">
              <div className="p-4 space-y-4 max-w-2xl mx-auto">
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTemplateModal(true)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {templateNames[selectedTemplate]}
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTailorModal(true)}
                    className="gap-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Tailor
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMobilePreview(true)}
                    className="lg:hidden gap-2 ml-auto"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                </div>

                {/* ATS Score Card */}
                <ATSScoreCard data={resumeData} />

                {/* Form Tabs */}
                <Card className="overflow-hidden">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <div className="border-b bg-muted/30 p-1">
                      <TabsList className="w-full h-auto flex-wrap gap-1 bg-transparent">
                        {formSections.map((section) => {
                          const Icon = section.icon;
                          return (
                            <TabsTrigger 
                              key={section.id} 
                              value={section.id}
                              className="flex-1 min-w-[80px] gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                              <Icon className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline text-xs">{section.label}</span>
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                    </div>
                    
                    <div className="p-4">
                      <TabsContent value="personal" className="mt-0">
                        <ResumeForm section="personal" data={resumeData} onChange={setResumeData} />
                      </TabsContent>
                      
                      <TabsContent value="experience" className="mt-0">
                        <ResumeForm section="experience" data={resumeData} onChange={setResumeData} />
                      </TabsContent>
                      
                      <TabsContent value="skills" className="mt-0">
                        <ResumeForm section="skills" data={resumeData} onChange={setResumeData} />
                      </TabsContent>
                    </div>
                  </Tabs>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentIndex = formSections.findIndex(s => s.id === activeTab);
                      if (currentIndex > 0) {
                        setActiveTab(formSections[currentIndex - 1].id);
                      }
                    }}
                    disabled={activeTab === 'personal'}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentIndex = formSections.findIndex(s => s.id === activeTab);
                      if (currentIndex < formSections.length - 1) {
                        setActiveTab(formSections[currentIndex + 1].id);
                      }
                    }}
                    disabled={activeTab === 'skills'}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Live Preview (Desktop Only) */}
            <div className="hidden lg:block w-1/2 bg-muted/30 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Eye className="h-4 w-4 text-primary" />
                    Live Preview
                  </h2>
                  <Badge variant="outline" className="text-xs">
                    {templateNames[selectedTemplate]}
                  </Badge>
                </div>
                <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ maxWidth: '100%' }}>
                  <div 
                    ref={resumeRef}
                    className="resume-preview origin-top-left"
                    style={{ 
                      transform: 'scale(0.65)', 
                      transformOrigin: 'top left',
                      width: '153.8%', // 1/0.65 to compensate for scale
                    }}
                  >
                    <ResumePreview template={selectedTemplate} data={resumeData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview Modal */}
        <Dialog open={showMobilePreview} onOpenChange={setShowMobilePreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Resume Preview
              </DialogTitle>
            </DialogHeader>
            <div className="bg-white rounded-lg overflow-auto">
              <div 
                ref={!resumeRef.current ? resumeRef : undefined}
                className="resume-preview"
                style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%' }}
              >
                <ResumePreview template={selectedTemplate} data={resumeData} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowMobilePreview(false)}>
                <EyeOff className="h-4 w-4 mr-2" />
                Close
              </Button>
              <Button onClick={handleDownload} disabled={isDownloading}>
                {isDownloading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Template Selector Modal */}
        <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Choose a Template</DialogTitle>
            </DialogHeader>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateChange={(t) => {
                setSelectedTemplate(t);
                setShowTemplateModal(false);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* AI Tailor Modal */}
        <Dialog open={showTailorModal} onOpenChange={setShowTailorModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Job Tailoring
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Paste a job description and our AI will optimize your resume to match the role's requirements.
              </p>
              <Textarea 
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowTailorModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleTailorToJob} 
                  disabled={isTailoring || !jobDescription.trim()}
                  className="gap-2"
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
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
