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
  Briefcase, Award, EyeOff, Zap
} from 'lucide-react';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumePreview from '@/components/resume/ResumePreview';
import PagedResumePreview from '@/components/resume/PagedResumePreview';
import TemplateSelector from '@/components/resume/TemplateSelector';
import ATSScoreCard from '@/components/resume/ATSScoreCard';
import ResumePremiumGate from '@/components/resume/ResumePremiumGate';

import ResumeBuilderComments from '@/components/resume/ResumeBuilderComments';
import AuthGateModal from '@/components/resume/AuthGateModal';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { useResumeLimit } from '@/hooks/useResumeLimit';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export type ResumeTemplate = 'professional' | 'modern' | 'creative' | 'minimal' | 'executive' | 'tech' | 'compact' | 'elegant' | 'bold' | 'classic' | 'graduate' | 'ats-friendly' | 'infographic' | 'neon' | 'timeline' | 'split' | 'metro';

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
  const { user, profile } = useUser();
  const { canDownload, remainingDownloads, downloadCount, isPremium, recordDownload, upgradeToPremium } = useResumeLimit();
  const resumeRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>('professional');
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [tailoringStrength, setTailoringStrength] = useState<'light' | 'moderate' | 'strong'>('moderate');
  const [isTailoring, setIsTailoring] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
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

  // Track Google Ads conversion for Resume Builder page visit
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-803431504/Qx-DCPaVvNYbENDIjf8C',
        'value': 1.0,
        'currency': 'USD'
      });
    }
  }, []);

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
    toast.info(`Tailoring your resume (${tailoringStrength} optimization)...`);

    try {
      const { data, error } = await supabase.functions.invoke('resume-ai-assistant', {
        body: { 
          type: 'tailor-to-job',
          context: { 
            jobDescription: jobDescription.trim(),
            resumeData,
            tailoringStrength
          }
        }
      });

      if (error) throw error;

      // Check if the response indicates success and has valid data
      if (data?.success === false) {
        toast.error(data.error || "Could not tailor resume. Please try again.");
        return;
      }

      // Validate the returned data has content before replacing
      if (data?.resumeData && data.resumeData.personalInfo) {
        // Additional validation: ensure we're not replacing with empty data
        const hasContent = 
          data.resumeData.personalInfo.fullName || 
          data.resumeData.experience?.length > 0 ||
          data.resumeData.education?.length > 0 ||
          data.resumeData.skills?.length > 0;
        
        if (hasContent) {
          setResumeData(data.resumeData);
          toast.success("Resume tailored successfully!");
          setShowTailorModal(false);
        } else {
          toast.error("Tailoring returned empty data. Your original resume has been preserved.");
        }
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
    // Require login to download
    if (!user) {
      setShowAuthGate(true);
      return;
    }

    if (!canDownload) {
      setShowPremiumGate(true);
      return;
    }

    setIsDownloading(true);

    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      // Get the offscreen A4 render target (unscaled)
      const pdfTarget = resumeRef.current?.querySelector('.resume-preview') as HTMLElement | null;
      if (!pdfTarget) {
        toast.error("Resume preview not found");
        setIsDownloading(false);
        return;
      }

      toast.info("Generating your PDF...");

      // A4 dimensions in mm
      const a4WidthMM = 210;
      const a4HeightMM = 297;

      // A4 at 96 DPI = 794 x 1123 px
      const a4WidthPx = 794;
      const a4HeightPx = 1123;

      // Get actual content height (tolerate tiny overflow to avoid an extra blank page)
      const measuredHeightPx = Math.ceil(pdfTarget.scrollHeight);
      const captureHeightPx = measuredHeightPx <= a4HeightPx + 2 ? a4HeightPx : measuredHeightPx;

      // Capture at 2x scale for better quality
      const canvas = await html2canvas(pdfTarget, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: a4WidthPx,
        height: captureHeightPx,
        windowWidth: a4WidthPx,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidthMM = a4WidthMM;
      const imgHeightMM = (canvas.height / canvas.width) * a4WidthMM;

      // Prevent a near-empty last page due to rounding (common source of "extra blank page")
      let totalPages = Math.max(1, Math.ceil(imgHeightMM / a4HeightMM));
      const fullPages = Math.floor(imgHeightMM / a4HeightMM);
      const remainderMM = imgHeightMM - fullPages * a4HeightMM;
      if (totalPages > 1 && remainderMM > 0 && remainderMM < 0.8) {
        totalPages -= 1;
      }

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        const yOffset = -(page * a4HeightMM);
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidthMM, imgHeightMM);
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
    compact: 'Compact',
    elegant: 'Elegant',
    bold: 'Bold',
    classic: 'Classic',
    graduate: 'Graduate',
    'ats-friendly': 'ATS-Friendly',
    infographic: 'Infographic',
    neon: 'Neon',
    timeline: 'Timeline',
    split: 'Split',
    metro: 'Metro'
  };

  const formSections = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills & More', icon: Award },
  ];

  return (
    <>
      <SEOHead
        title="Free ATS Resume Builder - Create Professional Resumes Online | RankMe"
        description="Build a professional, ATS-optimized resume in minutes with our free online resume builder. Choose from 13+ templates, get AI suggestions, and download as PDF. Beat applicant tracking systems."
        keywords="free resume builder, ATS resume builder, ATS-friendly resume, CV maker, professional resume templates, online resume maker, resume generator, job resume, career resume"
        canonical="/resume-builder"
      />
      <Layout>
        <div className="min-h-screen bg-background">
          {/* Mobile-Optimized Header */}
          <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg sm:rounded-xl flex-shrink-0">
                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-sm sm:text-lg font-bold flex items-center gap-1.5 truncate">
                      Resume Builder
                      {isPremium && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] sm:text-[10px] px-1 sm:px-1.5">
                          <Crown className="h-2 w-2 sm:h-2.5 sm:w-2.5 mr-0.5" />
                          PRO
                        </Badge>
                      )}
                    </h1>
                    <p className="text-[10px] sm:text-xs text-muted-foreground hidden xs:flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-green-500" />
                      ATS-Optimized
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  {user && (
                    <Button 
                      onClick={loadUserProfile} 
                      variant="ghost" 
                      size="sm" 
                      className="hidden sm:flex gap-1.5 h-8"
                      disabled={isLoadingProfile}
                    >
                      {isLoadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <User className="h-4 w-4" />}
                      <span className="hidden md:inline">Load Profile</span>
                    </Button>
                  )}

                  {!isPremium && (
                    <Button
                      onClick={() => setShowPremiumGate(true)}
                      variant="outline"
                      size="sm"
                      className="gap-1 h-8 px-2 sm:px-3"
                    >
                      <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                      <span className="hidden sm:inline">Upgrade</span>
                    </Button>
                  )}

                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative gap-1 h-8 px-2 sm:px-3"
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Upload className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    <span className="hidden sm:inline">Upload</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isUploading}
                      aria-label="Upload existing resume"
                    />
                  </Button>
                  <Button 
                    onClick={handleDownload} 
                    size="sm" 
                    className="gap-1 h-8 px-2 sm:px-3"
                    disabled={isDownloading}
                  >
                    {isDownloading ? <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" /> : <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    <span className="hidden xs:inline">Download</span>
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content - Responsive Layout */}
          <main className="flex flex-col lg:flex-row min-h-[calc(100vh-57px)] sm:min-h-[calc(100vh-65px)]">
            {/* Left Side - Form Editor */}
            <section className="w-full lg:w-1/2 overflow-y-auto lg:border-r" aria-label="Resume form editor">
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 max-w-2xl mx-auto pb-24 lg:pb-4">
                {/* Quick Actions - Mobile Optimized */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTemplateModal(true)}
                    className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="truncate max-w-[80px] sm:max-w-none">{templateNames[selectedTemplate]}</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTailorModal(true)}
                    className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">AI</span> Tailor
                  </Button>
                  {user && (
                    <Button 
                      onClick={loadUserProfile} 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9 sm:hidden"
                      disabled={isLoadingProfile}
                    >
                      {isLoadingProfile ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <User className="h-3.5 w-3.5" />}
                      Profile
                    </Button>
                  )}
                  {!isPremium && (
                    <Button
                      size="sm"
                      onClick={() => setShowPremiumGate(true)}
                      className="gap-1.5 text-xs sm:text-sm h-8 sm:h-9 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hidden sm:flex"
                    >
                      <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Upgrade
                    </Button>
                  )}
                </div>

                {/* ATS Score Card */}
                <ATSScoreCard data={resumeData} />

                {/* Form Tabs - Mobile Optimized */}
                <Card className="overflow-hidden">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <nav className="border-b bg-muted/30 p-1" aria-label="Resume sections">
                      <TabsList className="w-full h-auto grid grid-cols-3 gap-1 bg-transparent">
                        {formSections.map((section) => {
                          const Icon = section.icon;
                          return (
                            <TabsTrigger 
                              key={section.id} 
                              value={section.id}
                              className="gap-1 sm:gap-1.5 px-2 sm:px-4 py-2 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
                            >
                              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                              <span className="truncate">{section.label}</span>
                            </TabsTrigger>
                          );
                        })}
                      </TabsList>
                    </nav>
                    
                    <div className="p-3 sm:p-4">
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
                <div className="flex justify-between gap-2 pt-1">
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
                    className="gap-1 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                    className="gap-1 text-xs sm:text-sm h-8 sm:h-9"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            </section>

            {/* Right Side - Live Preview (Desktop Only) */}
            <aside className="hidden lg:block w-1/2 bg-muted/30 overflow-y-auto" aria-label="Resume preview">
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
                <div className="bg-white rounded-lg shadow-xl overflow-auto max-h-[calc(100vh-200px)]">
                  <div
                    className="origin-top-left w-full"
                    style={{ 
                      transform: 'scale(0.65)', 
                      transformOrigin: 'top left',
                      width: '154%',
                    }}
                  >
                    <PagedResumePreview template={selectedTemplate} data={resumeData} showPageBreaks={true} />
                  </div>
                </div>
              </div>
            </aside>
          </main>

          {/* Mobile Fixed Bottom Actions */}
          <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t p-3 flex gap-2 z-50 shadow-lg">
            <Button
              variant="outline"
              onClick={() => setShowMobilePreview(true)}
              className="flex-1 gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button 
              onClick={handleDownload} 
              className="flex-1 gap-2"
              disabled={isDownloading}
            >
              {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Download PDF
            </Button>
          </div>
        </div>

        {/* Mobile Preview Modal - Improved */}
        <Dialog open={showMobilePreview} onOpenChange={setShowMobilePreview}>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-hidden p-0">
            <DialogHeader className="px-4 py-3 border-b bg-background">
              <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Eye className="h-4 w-4" />
                Resume Preview
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-auto flex-1 p-3 sm:p-4 bg-muted/30" style={{ maxHeight: 'calc(90vh - 130px)' }}>
              <div className="bg-white rounded-lg shadow-lg mx-auto overflow-hidden" style={{ width: 'fit-content', maxWidth: '100%' }}>
                <div
                  style={{ 
                    transform: 'scale(0.45)', 
                    transformOrigin: 'top left', 
                    width: '794px',
                    marginBottom: '-55%',
                  }}
                >
                  <PagedResumePreview template={selectedTemplate} data={resumeData} showPageBreaks={true} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-3 border-t bg-background">
              <Button variant="outline" onClick={() => setShowMobilePreview(false)} className="flex-1 h-10">
                <EyeOff className="h-4 w-4 mr-2" />
                Close
              </Button>
              <Button onClick={handleDownload} disabled={isDownloading} className="flex-1 h-10">
                {isDownloading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                Download
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
              
              {/* Tailoring Strength Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tailoring Strength</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={tailoringStrength === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTailoringStrength('light')}
                    className="flex flex-col h-auto py-3"
                  >
                    <span className="font-medium">Light</span>
                    <span className="text-xs opacity-70">Subtle changes</span>
                  </Button>
                  <Button
                    type="button"
                    variant={tailoringStrength === 'moderate' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTailoringStrength('moderate')}
                    className="flex flex-col h-auto py-3"
                  >
                    <span className="font-medium">Moderate</span>
                    <span className="text-xs opacity-70">Balanced</span>
                  </Button>
                  <Button
                    type="button"
                    variant={tailoringStrength === 'strong' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTailoringStrength('strong')}
                    className="flex flex-col h-auto py-3"
                  >
                    <span className="font-medium">Strong</span>
                    <span className="text-xs opacity-70">Full optimization</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {tailoringStrength === 'light' && 'Preserves your original content with minor keyword additions'}
                  {tailoringStrength === 'moderate' && 'Balances optimization with authenticity'}
                  {tailoringStrength === 'strong' && 'Significantly rewrites content to match the job'}
                </p>
              </div>
              
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

        {/* Offscreen A4 render target for PDF export (must NOT be scaled/hidden via opacity) */}
        <div aria-hidden="true" className="fixed -left-[10000px] top-0 pointer-events-none">
          <div ref={resumeRef}>
            <ResumePreview template={selectedTemplate} data={resumeData} />
          </div>
        </div>

        {/* Premium Gate Modal */}
        <ResumePremiumGate
          open={showPremiumGate}
          onClose={() => setShowPremiumGate(false)}
          resumeCount={downloadCount}
          onUpgrade={upgradeToPremium}
        />

        {/* Auth Gate Modal */}
        <AuthGateModal
          open={showAuthGate}
          onClose={() => setShowAuthGate(false)}
        />
        

        {/* User Reviews Section */}
        <div className="container mx-auto px-4 py-8 border-t">
          <ResumeBuilderComments isAdmin={profile?.user_type === 'admin'} />
        </div>
      </Layout>
    </>
  );
};

export default ResumeBuilder;
