import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, Building, Loader2, Save, ArrowLeft, Globe, MapPin, 
  Phone, Mail, Briefcase, GraduationCap, Award, Calendar,
  Link as LinkIcon, Github, Linkedin, Twitter, Camera, TrendingUp, Sparkles, FileText
} from 'lucide-react';
import ResumeUpload from '@/components/candidate/ResumeUpload';
import { toast } from "sonner";
import { useUser } from '@/hooks/useUser';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import { useRankingCalculator } from '@/hooks/useRankingCalculator';
import RankingImprovementGuide from '@/components/ranking/RankingImprovementGuide';
import * as z from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  // Social links
  linkedin_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  twitter_url: z.string().url().optional().or(z.literal('')),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  // Professional details
  current_title: z.string().optional(),
  years_experience: z.number().min(0).max(50).optional(),
  current_ctc: z.string().optional(),
  expected_ctc: z.string().optional(),
  notice_period: z.string().optional(),
  // Employer specific
  company: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  founding_year: z.number().min(1800).max(new Date().getFullYear()).optional(),
  // Preferences
  is_profile_public: z.boolean().optional(),
  available_for_opportunities: z.boolean().optional(),
  preferred_work_type: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const EnhancedEditProfile = () => {
  const { user, refreshUser, isLoading: userLoading } = useUser();
  const { recalculateRanking, isCalculating, lastResult } = useRankingCalculator();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [showRankingGuide, setShowRankingGuide] = useState(false);
  const [rankingBreakdown, setRankingBreakdown] = useState({
    skills: 0,
    education: 0,
    experience: 0,
    certifications: 0,
    profile: 0,
  });
  const navigate = useNavigate();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
      phone: '',
      location: '',
      website: '',
      linkedin_url: '',
      github_url: '',
      twitter_url: '',
      portfolio_url: '',
      current_title: '',
      years_experience: 0,
      current_ctc: '',
      expected_ctc: '',
      notice_period: '',
      company: '',
      industry: '',
      size: '',
      founding_year: undefined,
      is_profile_public: false,
      available_for_opportunities: true,
      preferred_work_type: '',
    },
  });

  useEffect(() => {
    if (!userLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
        linkedin_url: (user as any).linkedin_url || '',
        github_url: (user as any).github_url || '',
        twitter_url: (user as any).twitter_url || '',
        portfolio_url: (user as any).portfolio_url || '',
        current_title: (user as any).current_title || '',
        years_experience: (user as any).years_experience || 0,
        current_ctc: user.current_ctc || '',
        expected_ctc: user.expected_ctc || '',
        notice_period: (user as any).notice_period || '',
        company: user.company || '',
        industry: user.industry || '',
        size: user.size || '',
        founding_year: (user as any).founding_year || undefined,
        is_profile_public: user.is_profile_public || false,
        available_for_opportunities: (user as any).available_for_opportunities || true,
        preferred_work_type: (user as any).preferred_work_type || '',
      });
    }
  }, [user, userLoading, navigate, form]);

  const handleSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updateData: any = {
        name: data.name,
        bio: data.bio,
        phone: data.phone,
        location: data.location,
        is_profile_public: data.is_profile_public,
        current_ctc: data.current_ctc,
        expected_ctc: data.expected_ctc,
      };

      // Add candidate-specific fields
      if (user.user_type === 'candidate') {
        updateData.linkedin_url = data.linkedin_url;
        updateData.github_url = data.github_url;
        updateData.twitter_url = data.twitter_url;
        updateData.portfolio_url = data.portfolio_url;
        updateData.current_title = data.current_title;
        updateData.years_experience = data.years_experience;
        updateData.notice_period = data.notice_period;
        updateData.available_for_opportunities = data.available_for_opportunities;
        updateData.preferred_work_type = data.preferred_work_type;
      }

      // Add employer-specific fields
      if (user.user_type === 'employer') {
        updateData.company = data.company;
        updateData.industry = data.industry;
        updateData.size = data.size;
        updateData.website = data.website;
        updateData.founding_year = data.founding_year;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      // Update email in auth if changed
      if (data.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email
        });
        if (emailError) throw emailError;
      }

      // Get the current session before refreshing
      const { data: { session } } = await supabase.auth.getSession();
      await refreshUser(session);
      
      // Recalculate ranking for candidates after profile update
      if (user.user_type === 'candidate') {
        const result = await recalculateRanking(user.id);
        if (result) {
          setRankingBreakdown(result.breakdown);
        }
      }
      
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial ranking breakdown
  useEffect(() => {
    const fetchRankingData = async () => {
      if (user && user.user_type === 'candidate') {
        const result = await recalculateRanking(user.id);
        if (result) {
          setRankingBreakdown(result.breakdown);
        }
      }
    };
    fetchRankingData();
  }, [user]);

  if (userLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  const tabs = user.user_type === 'candidate' ? [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'social', label: 'Social Links', icon: LinkIcon },
    { id: 'ranking', label: 'Improve Ranking', icon: TrendingUp },
    { id: 'preferences', label: 'Preferences', icon: GraduationCap },
  ] : [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'social', label: 'Social Links', icon: LinkIcon },
    { id: 'preferences', label: 'Preferences', icon: GraduationCap },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Ranking Score Banner for Candidates */}
          {user.user_type === 'candidate' && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Your Ranking Score</p>
                    <p className="text-xs text-muted-foreground">Complete your profile to improve</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{(user.rank_score || 0).toFixed(1)}</span>
                    <span className="text-muted-foreground">/100</span>
                  </div>
                  {lastResult && lastResult.improvement > 0 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      <Sparkles className="h-3 w-3 mr-1" />
                      +{lastResult.improvement.toFixed(1)}
                    </Badge>
                  )}
                </div>
              </div>
              <Progress value={user.rank_score || 0} className="h-2 mt-3" />
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Enhanced Profile</h1>
              <p className="text-muted-foreground">Complete your professional profile to stand out</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 p-1 bg-secondary/50 rounded-xl">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all font-medium ${
                    activeTab === tab.id
                      ? 'bg-white shadow-md text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Your fundamental profile information
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        {...form.register('name')}
                        placeholder="Your full name"
                        className="h-12"
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register('email')}
                        placeholder="your@email.com"
                        className="h-12"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        {...form.register('phone')}
                        placeholder="+1 (555) 123-4567"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        {...form.register('location')}
                        placeholder="City, Country"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Professional Bio
                    </Label>
                    <Textarea
                      id="bio"
                      {...form.register('bio')}
                      placeholder={
                        user.user_type === 'employer'
                          ? 'Tell us about your company, culture, and what makes it special...'
                          : 'Tell us about yourself, your experience, and what you\'re passionate about...'
                      }
                      rows={4}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Professional Information Tab */}
            {activeTab === 'professional' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Details
                  </CardTitle>
                  <CardDescription>
                    {user.user_type === 'employer' 
                      ? 'Company and business information'
                      : 'Your career and professional background'
                    }
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {user.user_type === 'candidate' ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="current_title">Current Job Title</Label>
                          <Input
                            id="current_title"
                            {...form.register('current_title')}
                            placeholder="e.g., Senior Software Engineer"
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="years_experience">Years of Experience</Label>
                          <Input
                            id="years_experience"
                            type="number"
                            {...form.register('years_experience', { valueAsNumber: true })}
                            placeholder="5"
                            min="0"
                            max="50"
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="current_ctc">Current CTC</Label>
                          <Input
                            id="current_ctc"
                            {...form.register('current_ctc')}
                            placeholder="e.g., ₹15 LPA or $120k"
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="expected_ctc">Expected CTC</Label>
                          <Input
                            id="expected_ctc"
                            {...form.register('expected_ctc')}
                            placeholder="e.g., ₹20 LPA or $150k"
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="notice_period">Notice Period</Label>
                          <select
                            id="notice_period"
                            {...form.register('notice_period')}
                            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="">Select notice period</option>
                            <option value="immediate">Immediate</option>
                            <option value="15-days">15 days</option>
                            <option value="1-month">1 month</option>
                            <option value="2-months">2 months</option>
                            <option value="3-months">3 months</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="preferred_work_type">Preferred Work Type</Label>
                          <select
                            id="preferred_work_type"
                            {...form.register('preferred_work_type')}
                            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="">Select work type</option>
                            <option value="remote">Remote</option>
                            <option value="onsite">On-site</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="flexible">Flexible</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="company">Company Name *</Label>
                          <Input
                            id="company"
                            {...form.register('company')}
                            placeholder="Your company name"
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="industry">Industry</Label>
                          <Input
                            id="industry"
                            {...form.register('industry')}
                            placeholder="e.g., Technology, Healthcare"
                            className="h-12"
                          />
                        </div>

                        <div>
                          <Label htmlFor="size">Company Size</Label>
                          <select
                            id="size"
                            {...form.register('size')}
                            className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="">Select company size</option>
                            <option value="1-10">1-10 employees</option>
                            <option value="11-50">11-50 employees</option>
                            <option value="51-200">51-200 employees</option>
                            <option value="201-500">201-500 employees</option>
                            <option value="501-1000">501-1000 employees</option>
                            <option value="1000+">1000+ employees</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="founding_year">Founding Year</Label>
                          <Input
                            id="founding_year"
                            type="number"
                            {...form.register('founding_year', { valueAsNumber: true })}
                            placeholder="2020"
                            min="1800"
                            max={new Date().getFullYear()}
                            className="h-12"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="website" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Company Website
                          </Label>
                          <Input
                            id="website"
                            type="url"
                            {...form.register('website')}
                            placeholder="https://yourcompany.com"
                            className="h-12"
                          />
                          {form.formState.errors.website && (
                            <p className="text-sm text-red-600 mt-1">
                              {form.formState.errors.website.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    Social & Professional Links
                  </CardTitle>
                  <CardDescription>
                    Connect your professional social profiles
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-blue-600" />
                        LinkedIn Profile
                      </Label>
                      <Input
                        id="linkedin_url"
                        type="url"
                        {...form.register('linkedin_url')}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="h-12"
                      />
                      {form.formState.errors.linkedin_url && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.linkedin_url.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="github_url" className="flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub Profile
                      </Label>
                      <Input
                        id="github_url"
                        type="url"
                        {...form.register('github_url')}
                        placeholder="https://github.com/yourusername"
                        className="h-12"
                      />
                      {form.formState.errors.github_url && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.github_url.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="twitter_url" className="flex items-center gap-2">
                        <Twitter className="h-4 w-4 text-blue-400" />
                        Twitter Profile
                      </Label>
                      <Input
                        id="twitter_url"
                        type="url"
                        {...form.register('twitter_url')}
                        placeholder="https://twitter.com/yourusername"
                        className="h-12"
                      />
                      {form.formState.errors.twitter_url && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.twitter_url.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="portfolio_url" className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-purple-600" />
                        Portfolio Website
                      </Label>
                      <Input
                        id="portfolio_url"
                        type="url"
                        {...form.register('portfolio_url')}
                        placeholder="https://yourportfolio.com"
                        className="h-12"
                      />
                      {form.formState.errors.portfolio_url && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.portfolio_url.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h3>
                    <p className="text-sm text-blue-800">
                      Adding your professional social links helps employers discover your work and increases your profile visibility by 40%!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Profile Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how your profile appears to others
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h3 className="font-medium">Public Profile</h3>
                        <p className="text-sm text-muted-foreground">
                          Allow others to view your profile and contact you
                        </p>
                      </div>
                      <Switch
                        {...form.register('is_profile_public')}
                        checked={form.watch('is_profile_public')}
                        onCheckedChange={(checked) => form.setValue('is_profile_public', checked)}
                      />
                    </div>

                    {user.user_type === 'candidate' && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h3 className="font-medium">Available for Opportunities</h3>
                          <p className="text-sm text-muted-foreground">
                            Let recruiters know you're open to new opportunities
                          </p>
                        </div>
                        <Switch
                          {...form.register('available_for_opportunities')}
                          checked={form.watch('available_for_opportunities')}
                          onCheckedChange={(checked) => form.setValue('available_for_opportunities', checked)}
                        />
                      </div>
                    )}

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Profile Completion
                      </h3>
                      <p className="text-sm text-green-800 mb-3">
                        Complete your profile to improve your ranking and visibility
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Basic Info</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            ✓ Complete
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Professional Details</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            ✓ Complete
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Social Links</span>
                          <Badge variant="outline">
                            Optional
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documents Tab (Candidates Only) */}
            {activeTab === 'documents' && user.user_type === 'candidate' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Resume & Documents
                  </CardTitle>
                  <CardDescription>
                    Upload your resume to make it available to employers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResumeUpload />
                  
                  {user.resume_url && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Your resume is uploaded and visible to employers!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Ranking Improvement Tab (Candidates Only) */}
            {activeTab === 'ranking' && user.user_type === 'candidate' && (
              <RankingImprovementGuide
                currentScore={user.rank_score || 0}
                breakdown={rankingBreakdown}
                onActionClick={(path) => {
                  if (path === '/edit-profile') {
                    setActiveTab('basic');
                  } else {
                    navigate(path);
                  }
                }}
              />
            )}

            {/* Submit Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                size="lg"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EnhancedEditProfile;