import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Eye, Upload, User, Crown, CheckCircle2, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import ResumeForm from '@/components/resume/ResumeForm';
import ResumePreview from '@/components/resume/ResumePreview';
import TemplateSelector from '@/components/resume/TemplateSelector';
import ATSScoreCard from '@/components/resume/ATSScoreCard';
import ResumePremiumGate from '@/components/resume/ResumePremiumGate';
import { toast } from 'sonner';
import { useUser } from '@/hooks/useUser';
import { useResumeLimit } from '@/hooks/useResumeLimit';
import { supabase } from '@/integrations/supabase/client';
import { ScrollReveal } from '@/components/ui/scroll-reveal';

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
      // Fetch user skills
      const { data: skills } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id);

      // Fetch experiences
      const { data: experiences } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      // Fetch education
      const { data: education } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', user.id)
        .order('start_date', { ascending: false });

      // Fetch certifications
      const { data: certifications } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', user.id)
        .order('issue_date', { ascending: false });

      // Transform and set data
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

      toast.success('Profile data loaded successfully!');
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

    toast.info("Parsing your resume... This may take a moment.");

    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `temp/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      // Call edge function to parse resume with AI
      const { data, error } = await supabase.functions.invoke('resume-ai-assistant', {
        body: { 
          type: 'parse',
          context: { fileUrl: publicUrl, fileName: file.name }
        }
      });

      if (error) throw error;

      if (data?.resumeData) {
        setResumeData(data.resumeData);
        toast.success("Resume parsed successfully! Review and customize as needed.");
      } else {
        toast.warning("Could not extract all data. Please fill in missing details.");
      }

      // Cleanup temp file
      await supabase.storage.from('resumes').remove([filePath]);
    } catch (error: any) {
      console.error('Error parsing resume:', error);
      toast.error(error.message || "Could not process your resume. Please try again.");
    } finally {
      event.target.value = '';
    }
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
    toast.info("Tailoring your resume to match the job description...");

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
        toast.success("Resume tailored successfully! Review the changes.");
      } else {
        toast.warning("Could not tailor resume. Please try again.");
      }
    } catch (error: any) {
      console.error('Error tailoring resume:', error);
      toast.error(error.message || "Could not tailor your resume. Please try again.");
    } finally {
      setIsTailoring(false);
    }
  };

  const handleDownload = async () => {
    // Check if user can download
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

      toast.info("Generating your ATS-friendly PDF resume...");

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

      // Record the download
      recordDownload(selectedTemplate);

      toast.success("Your ATS-friendly resume has been downloaded!");
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error("There was an error creating your PDF. Please try again.");
    }
  };

  return (
    <>
      <SEOHead
        title="ATS-Friendly Resume Builder - Create Professional Resumes | RankMe.AI"
        description="Build professional, ATS-optimized resumes with our free resume builder. Real-time ATS score, expert tips, and multiple templates. Download as PDF instantly."
        keywords="ATS resume builder, ATS-friendly resume, CV maker, professional resume templates, free resume builder, applicant tracking system"
        canonical="/resume-builder"
      />
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <ScrollReveal>
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    ATS-Friendly Resume Builder
                  </h1>
                  {isPremium && (
                    <Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Create professional, ATS-optimized resumes that pass applicant tracking systems and land more interviews.
                </p>

                {/* ATS Info Banner */}
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Optimized for 50+ ATS systems including Workday, Taleo, Greenhouse</span>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-6 flex gap-3 justify-center flex-wrap">
                  {user && (
                    <Button onClick={loadUserProfile} variant="outline" className="gap-2">
                      <User className="h-4 w-4" />
                      Load My Profile
                    </Button>
                  )}
                  <Button variant="outline" className="relative gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Existing Resume
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                  {!isPremium && (
                    <Button 
                      onClick={() => setShowPremiumGate(true)} 
                      className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      <Crown className="h-4 w-4" />
                      Upgrade to Premium
                    </Button>
                  )}
                </div>

                {/* Download Status */}
                {!isPremium && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>
                      {remainingDownloads > 0 
                        ? `${remainingDownloads} free download remaining` 
                        : 'Free limit reached. Upgrade for unlimited resumes.'}
                    </span>
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Template Selector */}
            <ScrollReveal delay={0.1}>
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
              />
            </ScrollReveal>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Left: Form */}
              <ScrollReveal delay={0.2}>
                <div className="space-y-4">
                  {/* Job Description Tailoring */}
                  <Card className="p-4 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Tailor to Job Description</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Paste a job description to automatically optimize your resume for the role.
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

                  {/* ATS Score Card */}
                  <ATSScoreCard data={resumeData} />

                  <Card className="p-6 h-fit">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold">Resume Details</h2>
                      <Button onClick={handleDownload} size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
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
                </div>
              </ScrollReveal>

              {/* Right: Preview */}
              <ScrollReveal delay={0.3}>
                <div className="sticky top-4">
                  <Card className="p-6 bg-white dark:bg-card">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Eye className="h-5 w-5 text-primary" />
                        Live Preview
                      </h2>
                      <Badge variant="outline" className="text-xs">
                        ATS-Optimized
                      </Badge>
                    </div>
                    <div className="border rounded-lg overflow-hidden bg-white">
                      <ResumePreview 
                        template={selectedTemplate}
                        data={resumeData}
                      />
                    </div>
                  </Card>
                </div>
              </ScrollReveal>
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
