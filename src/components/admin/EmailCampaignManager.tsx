import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Mail, 
  Send, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

type EmailDesignTemplate = 'modern' | 'gradient' | 'minimal' | 'bold' | 'festive' | 'dark';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  recipient_filter: string;
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  sent_count: number;
  failed_count: number;
  created_at: string;
}

const designTemplates: { id: EmailDesignTemplate; name: string; description: string; preview: string }[] = [
  { id: 'modern', name: 'Modern', description: 'Clean blue gradient header', preview: '🔵' },
  { id: 'gradient', name: 'Gradient Wave', description: 'Purple gradient with rounded cards', preview: '🟣' },
  { id: 'minimal', name: 'Minimal', description: 'Simple clean design', preview: '⚪' },
  { id: 'bold', name: 'Bold Impact', description: 'Dark theme with amber accents', preview: '🟡' },
  { id: 'festive', name: 'Festive', description: 'Celebration style with warm colors', preview: '🎉' },
  { id: 'dark', name: 'Dark Mode', description: 'Sleek dark theme with neon accents', preview: '🌙' },
];

const emailTemplates = [
  {
    name: "New Feature Announcement",
    subject: "🚀 Exciting New Features on FresherPools!",
    content: `<h2 style="color: #1e293b; margin-bottom: 20px;">New Features Just Launched!</h2>
<p style="color: #475569; line-height: 1.8; margin-bottom: 20px;">
  We're excited to announce some amazing new features that will help you in your career journey:
</p>
<ul style="color: #475569; line-height: 2; margin-bottom: 20px;">
  <li><strong>Enhanced Resume Builder</strong> - Create stunning resumes with 17+ templates</li>
  <li><strong>Skill Assessments</strong> - Verify your skills and boost your rank</li>
  <li><strong>Job Matching AI</strong> - Get personalized job recommendations</li>
</ul>
<div style="text-align: center; margin: 30px 0;">
  <a href="https://fresherpools.com/dashboard" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explore Now</a>
</div>`
  },
  {
    name: "Job Alert Digest",
    subject: "📊 Your Weekly Job Matches",
    content: `<h2 style="color: #1e293b; margin-bottom: 20px;">Top Jobs Matching Your Profile</h2>
<p style="color: #475569; line-height: 1.8; margin-bottom: 20px;">
  Based on your skills and experience, we've found some exciting opportunities for you this week.
</p>
<div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
  <p style="color: #475569; margin: 0;">
    <strong>New jobs posted:</strong> 50+ positions matching your profile
  </p>
</div>
<div style="text-align: center; margin: 30px 0;">
  <a href="https://fresherpools.com/jobs" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Jobs</a>
</div>`
  },
  {
    name: "Welcome Email",
    subject: "🎉 Welcome to FresherPools!",
    content: `<h2 style="color: #1e293b; margin-bottom: 20px;">Welcome to Your Career Journey!</h2>
<p style="color: #475569; line-height: 1.8; margin-bottom: 20px;">
  Thank you for joining FresherPools! We're excited to help you take your career to the next level.
</p>
<p style="color: #475569; line-height: 1.8; margin-bottom: 20px;">
  Here's what you can do to get started:
</p>
<ol style="color: #475569; line-height: 2; margin-bottom: 20px;">
  <li>Complete your profile to improve your rank</li>
  <li>Add your skills and get verified assessments</li>
  <li>Upload your resume or create one using our builder</li>
  <li>Start applying to jobs that match your profile</li>
</ol>
<div style="text-align: center; margin: 30px 0;">
  <a href="https://fresherpools.com/dashboard" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Complete Profile</a>
</div>`
  },
  {
    name: "Promotional Offer",
    subject: "🔥 Limited Time: Premium Features Unlocked!",
    content: `<h2 style="color: #1e293b; margin-bottom: 20px;">Exclusive Offer Just for You!</h2>
<p style="color: #475569; line-height: 1.8; margin-bottom: 20px;">
  For a limited time, unlock premium features and supercharge your job search.
</p>
<div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
  <p style="color: #92400e; margin: 0; font-size: 18px; font-weight: bold;">
    Get 50% OFF Premium Subscription
  </p>
  <p style="color: #a16207; margin: 10px 0 0 0;">
    Use code: CAREER50
  </p>
</div>
<div style="text-align: center; margin: 30px 0;">
  <a href="https://fresherpools.com/pricing" style="background: #f59e0b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Claim Offer</a>
</div>`
  },
  {
    name: "New Year Greetings",
    subject: "✨ Happy New Year from FresherPools!",
    content: `<h2 style="color: #1e293b; margin-bottom: 20px; text-align: center;">🎊 Happy New Year 2026! 🎊</h2>
<p style="color: #475569; line-height: 1.8; margin-bottom: 20px; text-align: center;">
  Wishing you a year filled with success, growth, and amazing opportunities!
</p>
<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
  <p style="color: white; margin: 0; font-size: 20px; font-weight: bold;">
    Make 2026 Your Best Career Year Yet
  </p>
  <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0;">
    New features, new opportunities, new beginnings!
  </p>
</div>
<div style="text-align: center; margin: 30px 0;">
  <a href="https://fresherpools.com/jobs" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Explore Opportunities</a>
</div>`
  },
  {
    name: "Resume Builder Launch",
    subject: "📄 17+ New Resume Templates Available!",
    content: `<h2 style="color: #1e293b; margin-bottom: 20px;">Create Your Perfect Resume</h2>
<p style="color: #475569; line-height: 1.8; margin-bottom: 20px;">
  We've added 17+ professional resume templates to help you stand out. From modern to minimal, bold to classic – find the perfect style for your industry.
</p>
<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
  <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">
    <strong style="color: #1e293b;">Neon</strong><br><span style="color: #64748b; font-size: 12px;">Dark & Vibrant</span>
  </div>
  <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">
    <strong style="color: #1e293b;">Timeline</strong><br><span style="color: #64748b; font-size: 12px;">Career Journey</span>
  </div>
  <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; text-align: center;">
    <strong style="color: #1e293b;">Metro</strong><br><span style="color: #64748b; font-size: 12px;">Bold & Colorful</span>
  </div>
</div>
<div style="text-align: center; margin: 30px 0;">
  <a href="https://fresherpools.com/resume-builder" style="background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold;">Try Resume Builder</a>
</div>`
  }
];

const EmailCampaignManager = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  // Form state
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('all');
  const [selectedDesignTemplate, setSelectedDesignTemplate] = useState<EmailDesignTemplate>('modern');
  const [testEmail, setTestEmail] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (template: typeof emailTemplates[0]) => {
    setCampaignName(template.name);
    setSubject(template.subject);
    setContent(template.content);
    toast.success(`Template "${template.name}" applied`);
  };

  const saveDraft = async () => {
    if (!campaignName || !subject || !content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('email_campaigns')
        .insert({
          name: campaignName,
          subject,
          content,
          recipient_filter: recipientFilter,
          status: 'draft',
          created_by: userData.user?.id
        });

      if (error) throw error;
      
      toast.success("Draft saved successfully");
      resetForm();
      fetchCampaigns();
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast.error(error.message || "Failed to save draft");
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail || !subject || !content) {
      toast.error("Please enter a test email and fill in subject/content");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-promotional-email', {
        body: {
          campaignId: null,
          subject,
          content,
          recipientFilter,
          template: selectedDesignTemplate,
          testEmail
        }
      });

      if (error) throw error;
      toast.success(`Test email sent to ${testEmail}`);
    } catch (error: any) {
      console.error("Error sending test email:", error);
      toast.error(error.message || "Failed to send test email");
    } finally {
      setSending(false);
    }
  };

  const sendCampaign = async (campaignId?: string) => {
    if (!campaignId && (!subject || !content)) {
      toast.error("Please fill in subject and content");
      return;
    }

    const confirmSend = confirm(
      `Are you sure you want to send this campaign to ${recipientFilter === 'all' ? 'ALL users' : recipientFilter}?`
    );
    
    if (!confirmSend) return;

    setSending(true);
    try {
      let targetCampaignId = campaignId;
      
      // If sending new campaign, save it first
      if (!campaignId) {
        const { data: userData } = await supabase.auth.getUser();
        const { data: newCampaign, error: saveError } = await supabase
          .from('email_campaigns')
          .insert({
            name: campaignName || `Campaign ${new Date().toLocaleDateString()}`,
            subject,
            content,
            recipient_filter: recipientFilter,
            status: 'sending',
            created_by: userData.user?.id
          })
          .select()
          .single();

        if (saveError) throw saveError;
        targetCampaignId = newCampaign.id;
      } else {
        // Update existing campaign status
        await supabase
          .from('email_campaigns')
          .update({ status: 'sending' })
          .eq('id', campaignId);
      }

      const campaign = campaignId 
        ? campaigns.find(c => c.id === campaignId) 
        : { subject, content, recipient_filter: recipientFilter };

      const { data, error } = await supabase.functions.invoke('send-promotional-email', {
        body: {
          campaignId: targetCampaignId,
          subject: campaign?.subject || subject,
          content: campaign?.content || content,
          recipientFilter: campaign?.recipient_filter || recipientFilter,
          template: selectedDesignTemplate
        }
      });

      if (error) throw error;
      
      toast.success(`Campaign sent! ${data.sentCount} emails delivered, ${data.failedCount} failed`);
      resetForm();
      fetchCampaigns();
    } catch (error: any) {
      console.error("Error sending campaign:", error);
      toast.error(error.message || "Failed to send campaign");
    } finally {
      setSending(false);
    }
  };

  const deleteCampaign = async (campaignId: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;

    try {
      const { error } = await supabase
        .from('email_campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch (error: any) {
      console.error("Error deleting campaign:", error);
      toast.error(error.message || "Failed to delete campaign");
    }
  };

  const resetForm = () => {
    setCampaignName('');
    setSubject('');
    setContent('');
    setRecipientFilter('all');
    setSelectedDesignTemplate('modern');
    setTestEmail('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" />Sent</Badge>;
      case 'sending':
        return <Badge className="bg-blue-500"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Sending</Badge>;
      case 'draft':
        return <Badge variant="outline"><FileText className="w-3 h-3 mr-1" />Draft</Badge>;
      case 'scheduled':
        return <Badge className="bg-amber-500"><Clock className="w-3 h-3 mr-1" />Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="compose" className="space-y-4">
        <TabsList>
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Compose Email Campaign
              </CardTitle>
              <CardDescription>Create and send promotional emails to your users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    placeholder="e.g., January Newsletter"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipientFilter">Recipients</Label>
                  <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="candidates">Candidates Only</SelectItem>
                      <SelectItem value="employers">Employers Only</SelectItem>
                      <SelectItem value="newsletter">Newsletter Subscribers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Email Design Template Selector */}
              <div className="space-y-3">
                <Label>Email Design Template</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {designTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedDesignTemplate(template.id)}
                      className={`cursor-pointer p-3 rounded-lg border-2 transition-all text-center ${
                        selectedDesignTemplate === template.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{template.preview}</div>
                      <div className="text-xs font-medium">{template.name}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selected: <strong>{designTemplates.find(t => t.id === selectedDesignTemplate)?.name}</strong> - {designTemplates.find(t => t.id === selectedDesignTemplate)?.description}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject Line</Label>
                <Input
                  id="subject"
                  placeholder="Enter email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Email Content (HTML)</Label>
                <Textarea
                  id="content"
                  placeholder="Enter HTML content for the email body..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="testEmail">Test Email Address</Label>
                  <Input
                    id="testEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={sendTestEmail}
                  disabled={sending}
                >
                  {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />}
                  Send Test
                </Button>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={saveDraft} disabled={sending}>
                  <FileText className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button onClick={() => sendCampaign()} disabled={sending}>
                  {sending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailTemplates.map((template, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="truncate">{template.subject}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-sm text-muted-foreground line-clamp-3 mb-4"
                    dangerouslySetInnerHTML={{ __html: template.content.replace(/<[^>]*>/g, ' ').substring(0, 150) + '...' }}
                  />
                  <Button variant="outline" size="sm" onClick={() => applyTemplate(template)}>
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Campaign History</CardTitle>
              <CardDescription>View and manage past email campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No campaigns yet. Create your first campaign above!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{campaign.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{campaign.recipient_filter}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>
                          {campaign.sent_count > 0 && (
                            <span className="text-sm">
                              <span className="text-green-600">{campaign.sent_count}</span>
                              {campaign.failed_count > 0 && (
                                <span className="text-red-500 ml-1">/ {campaign.failed_count} failed</span>
                              )}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {campaign.status === 'draft' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => sendCampaign(campaign.id)}
                                disabled={sending}
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => deleteCampaign(campaign.id)}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailCampaignManager;
