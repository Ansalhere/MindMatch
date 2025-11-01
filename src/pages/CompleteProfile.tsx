import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, ArrowLeft, Plus, Trash2, Building2 } from 'lucide-react';
import { toast } from "sonner";
import { useUser } from '@/hooks/useUser';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import AvatarUpload from '@/components/profile/AvatarUpload';
import ResumeUpload from '@/components/candidate/ResumeUpload';
import { globalCities } from '@/data/globalLocations';
import { degrees, fieldOfStudy, collegeTiers } from '@/data/educationOptions';
import ProfileCompletionCard from '@/components/dashboard/ProfileCompletionCard';
import * as z from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().min(20, 'Bio must be at least 20 characters').optional().or(z.literal('')),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  company: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  current_ctc: z.string().optional(),
  expected_ctc: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Experience {
  id?: string;
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
}

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  gpa: number | null;
  tier: number;
  college_tier: number;
}

const CompleteProfile = () => {
  const { user, session, refreshUser, isLoading: userLoading } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [profileCompletion, setProfileCompletion] = useState({ 
    percentage: 0, 
    completedFields: [], 
    missingFields: [], 
    recommendations: [] 
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
      company: '',
      industry: '',
      size: '',
      current_ctc: '',
      expected_ctc: '',
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
        company: user.company || '',
        industry: user.industry || '',
        size: user.size || '',
        current_ctc: user.current_ctc || '',
        expected_ctc: user.expected_ctc || '',
      });
      fetchUserData();
    }
  }, [user, userLoading, navigate]);

  const fetchUserData = async () => {
    if (!user?.id) return;
    
    setLoadingData(true);
    try {
      const [expData, eduData, skillsData, certsData] = await Promise.all([
        supabase.from('experiences').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
        supabase.from('education').select('*').eq('user_id', user.id).order('start_date', { ascending: false }),
        supabase.from('skills').select('*').eq('user_id', user.id),
        supabase.from('certifications').select('*').eq('user_id', user.id),
      ]);

      if (expData.data) setExperiences(expData.data);
      if (eduData.data) setEducations(eduData.data);

      // Calculate profile completion
      const { calculateProfileCompletion } = await import('@/utils/profileCompletion');
      const completion = calculateProfileCompletion(
        user,
        skillsData.data || [],
        eduData.data || [],
        expData.data || [],
        certsData.data || []
      );
      setProfileCompletion(completion);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updateData: any = {
        name: data.name,
        bio: data.bio,
        phone: data.phone,
        location: data.location,
      };

      if (user.user_type === 'employer') {
        updateData.company = data.company;
        updateData.industry = data.industry;
        updateData.size = data.size;
        updateData.website = data.website;
      }

      if (user.user_type === 'candidate') {
        updateData.current_ctc = data.current_ctc;
        updateData.expected_ctc = data.expected_ctc;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      if (data.email !== user.email && data.email.trim()) {
        try {
          await supabase.auth.updateUser({ email: data.email });
        } catch (emailErr: any) {
          console.warn('Email update warning:', emailErr);
        }
      }

      await refreshUser(session);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addExperience = () => {
    setExperiences([...experiences, {
      company: '',
      role: '',
      location: '',
      start_date: '',
      end_date: null,
      is_current: false,
      description: ''
    }]);
  };

  const removeExperience = async (index: number) => {
    const exp = experiences[index];
    if (exp.id) {
      await supabase.from('experiences').delete().eq('id', exp.id);
    }
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const saveExperience = async (index: number) => {
    const exp = experiences[index];
    if (!user?.id) return;

    const expData = {
      user_id: user.id,
      company: exp.company,
      role: exp.role,
      location: exp.location,
      start_date: exp.start_date,
      end_date: exp.is_current ? null : exp.end_date,
      is_current: exp.is_current,
      description: exp.description
    };

    if (exp.id) {
      await supabase.from('experiences').update(expData).eq('id', exp.id);
    } else {
      const { data } = await supabase.from('experiences').insert(expData).select().single();
      if (data) {
        const newExps = [...experiences];
        newExps[index].id = data.id;
        setExperiences(newExps);
      }
    }
    
    toast.success('Experience saved');
  };

  const addEducation = () => {
    setEducations([...educations, {
      institution: '',
      degree: '',
      field: '',
      start_date: '',
      end_date: null,
      is_current: false,
      gpa: null,
      tier: 3,
      college_tier: 3
    }]);
  };

  const removeEducation = async (index: number) => {
    const edu = educations[index];
    if (edu.id) {
      await supabase.from('education').delete().eq('id', edu.id);
    }
    setEducations(educations.filter((_, i) => i !== index));
  };

  const saveEducation = async (index: number) => {
    const edu = educations[index];
    if (!user?.id) return;

    const eduData = {
      user_id: user.id,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      start_date: edu.start_date,
      end_date: edu.is_current ? null : edu.end_date,
      is_current: edu.is_current,
      gpa: edu.gpa,
      tier: edu.tier,
      college_tier: edu.college_tier
    };

    if (edu.id) {
      await supabase.from('education').update(eduData).eq('id', edu.id);
    } else {
      const { data } = await supabase.from('education').insert(eduData).select().single();
      if (data) {
        const newEdus = [...educations];
        newEdus[index].id = data.id;
        setEducations(newEdus);
      }
    }
    
    toast.success('Education saved');
  };

  if (userLoading || loadingData) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Complete Your Profile</h1>
              <p className="text-muted-foreground">Build a comprehensive profile to stand out</p>
            </div>
          </div>

          <div className="mb-6">
            <ProfileCompletionCard completion={profileCompletion} />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              {user.user_type === 'candidate' && (
                <>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="basic" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AvatarUpload />
                  
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" {...form.register('name')} />
                        {form.formState.errors.name && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" {...form.register('email')} />
                        {form.formState.errors.email && (
                          <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" {...form.register('phone')} placeholder="+1 (555) 123-4567" />
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Select value={form.watch('location')} onValueChange={(value) => form.setValue('location', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {globalCities.map((city) => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" {...form.register('bio')} rows={4} placeholder="Tell us about yourself..." />
                      {form.formState.errors.bio && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.bio.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Your career and professional details</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    {user.user_type === 'employer' ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="company">Company Name</Label>
                            <Input id="company" {...form.register('company')} />
                          </div>
                          <div>
                            <Label htmlFor="industry">Industry</Label>
                            <Input id="industry" {...form.register('industry')} />
                          </div>
                          <div>
                            <Label htmlFor="size">Company Size</Label>
                            <Select value={form.watch('size')} onValueChange={(value) => form.setValue('size', value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1-10">1-10 employees</SelectItem>
                                <SelectItem value="11-50">11-50 employees</SelectItem>
                                <SelectItem value="51-200">51-200 employees</SelectItem>
                                <SelectItem value="201-500">201-500 employees</SelectItem>
                                <SelectItem value="501-1000">501-1000 employees</SelectItem>
                                <SelectItem value="1000+">1000+ employees</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="website">Company Website</Label>
                            <Input id="website" type="url" {...form.register('website')} />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="current_ctc">Current CTC (Annual)</Label>
                          <Input id="current_ctc" {...form.register('current_ctc')} placeholder="e.g., 500000" />
                        </div>
                        <div>
                          <Label htmlFor="expected_ctc">Expected CTC (Annual)</Label>
                          <Input id="expected_ctc" {...form.register('expected_ctc')} placeholder="e.g., 800000" />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {user.user_type === 'candidate' && (
              <>
                <TabsContent value="experience" className="mt-6 space-y-4">
                  {experiences.map((exp, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Experience #{index + 1}
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveExperience(index)}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => removeExperience(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Company *</Label>
                            <Input value={exp.company} onChange={(e) => {
                              const newExps = [...experiences];
                              newExps[index].company = e.target.value;
                              setExperiences(newExps);
                            }} />
                          </div>
                          <div>
                            <Label>Role *</Label>
                            <Input value={exp.role} onChange={(e) => {
                              const newExps = [...experiences];
                              newExps[index].role = e.target.value;
                              setExperiences(newExps);
                            }} />
                          </div>
                          <div>
                            <Label>Location</Label>
                            <Select value={exp.location} onValueChange={(value) => {
                              const newExps = [...experiences];
                              newExps[index].location = value;
                              setExperiences(newExps);
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                              <SelectContent>
                                {globalCities.map((city) => (
                                  <SelectItem key={city} value={city}>{city}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Start Date *</Label>
                            <Input type="month" value={exp.start_date} onChange={(e) => {
                              const newExps = [...experiences];
                              newExps[index].start_date = e.target.value;
                              setExperiences(newExps);
                            }} />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input type="month" value={exp.end_date || ''} disabled={exp.is_current} onChange={(e) => {
                              const newExps = [...experiences];
                              newExps[index].end_date = e.target.value;
                              setExperiences(newExps);
                            }} />
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked={exp.is_current} onChange={(e) => {
                              const newExps = [...experiences];
                              newExps[index].is_current = e.target.checked;
                              if (e.target.checked) newExps[index].end_date = null;
                              setExperiences(newExps);
                            }} />
                            <Label>Currently working here</Label>
                          </div>
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea value={exp.description} rows={3} onChange={(e) => {
                            const newExps = [...experiences];
                            newExps[index].description = e.target.value;
                            setExperiences(newExps);
                          }} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button onClick={addExperience} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </TabsContent>

                <TabsContent value="education" className="mt-6 space-y-4">
                  {educations.map((edu, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Education #{index + 1}</CardTitle>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveEducation(index)}>
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => removeEducation(index)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Institution *</Label>
                            <Input value={edu.institution} onChange={(e) => {
                              const newEdus = [...educations];
                              newEdus[index].institution = e.target.value;
                              setEducations(newEdus);
                            }} />
                          </div>
                          <div>
                            <Label>Degree *</Label>
                            <Select value={edu.degree} onValueChange={(value) => {
                              const newEdus = [...educations];
                              newEdus[index].degree = value;
                              setEducations(newEdus);
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select degree" />
                              </SelectTrigger>
                              <SelectContent>
                                {degrees.map((degree) => (
                                  <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Field of Study *</Label>
                            <Select value={edu.field} onValueChange={(value) => {
                              const newEdus = [...educations];
                              newEdus[index].field = value;
                              setEducations(newEdus);
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select field" />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldOfStudy.map((field) => (
                                  <SelectItem key={field} value={field}>{field}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>College Tier</Label>
                            <Select value={edu.college_tier?.toString()} onValueChange={(value) => {
                              const newEdus = [...educations];
                              newEdus[index].college_tier = parseInt(value);
                              setEducations(newEdus);
                            }}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tier" />
                              </SelectTrigger>
                              <SelectContent>
                                {collegeTiers.map((tier) => (
                                  <SelectItem key={tier.value} value={tier.value.toString()}>{tier.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Start Date *</Label>
                            <Input type="month" value={edu.start_date} onChange={(e) => {
                              const newEdus = [...educations];
                              newEdus[index].start_date = e.target.value;
                              setEducations(newEdus);
                            }} />
                          </div>
                          <div>
                            <Label>End Date</Label>
                            <Input type="month" value={edu.end_date || ''} disabled={edu.is_current} onChange={(e) => {
                              const newEdus = [...educations];
                              newEdus[index].end_date = e.target.value;
                              setEducations(newEdus);
                            }} />
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" checked={edu.is_current} onChange={(e) => {
                              const newEdus = [...educations];
                              newEdus[index].is_current = e.target.checked;
                              if (e.target.checked) newEdus[index].end_date = null;
                              setEducations(newEdus);
                            }} />
                            <Label>Currently studying</Label>
                          </div>
                          <div>
                            <Label>GPA/Percentage</Label>
                            <Input type="number" step="0.01" value={edu.gpa || ''} onChange={(e) => {
                              const newEdus = [...educations];
                              newEdus[index].gpa = e.target.value ? parseFloat(e.target.value) : null;
                              setEducations(newEdus);
                            }} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button onClick={addEducation} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </TabsContent>

                <TabsContent value="documents" className="mt-6">
                  <ResumeUpload />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CompleteProfile;
