import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { User, Building, Loader2, Save, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { useUser } from '@/hooks/useUser';
import Layout from '@/components/Layout';
import { supabase } from '@/integrations/supabase/client';
import ResumeUpload from '@/components/candidate/ResumeUpload';
import * as z from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  // Employer specific fields
  company: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  // Candidate specific fields
  current_ctc: z.string().optional(),
  expected_ctc: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const EditProfile = () => {
  const { user, session, refreshUser, isLoading: userLoading } = useUser();
  const [isLoading, setIsLoading] = useState(false);
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
      };

      // Add employer-specific fields if user is an employer
      if (user.user_type === 'employer') {
        updateData.company = data.company;
        updateData.industry = data.industry;
        updateData.size = data.size;
        updateData.website = data.website;
      }

      // Add candidate-specific fields if user is a candidate
      if (user.user_type === 'candidate') {
        updateData.current_ctc = data.current_ctc;
        updateData.expected_ctc = data.expected_ctc;
      }

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      // Only update email in auth if changed and not empty
      if (data.email !== user.email && data.email.trim()) {
        try {
          const { error: emailError } = await supabase.auth.updateUser({
            email: data.email
          });
          if (emailError && !emailError.message.includes('email_change_token_already_issued')) {
            throw emailError;
          }
        } catch (emailErr: any) {
          console.warn('Email update warning:', emailErr);
          // Don't block the profile update if only email fails
        }
      }

      await refreshUser(session);
      toast.success('Profile updated successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
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
              <h1 className="text-3xl font-bold">Edit Profile</h1>
              <p className="text-muted-foreground">Update your profile information</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {user.user_type === 'employer' ? (
                  <Building className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
                {user.user_type === 'employer' ? 'Company Profile' : 'Personal Profile'}
              </CardTitle>
              <CardDescription>
                Keep your information up to date to improve your visibility
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      {user.user_type === 'employer' ? 'Contact Name' : 'Full Name'}
                    </Label>
                    <Input
                      id="name"
                      {...form.register('name')}
                      placeholder="Your full name"
                    />
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      placeholder="your@email.com"
                    />
                    {form.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {user.user_type === 'employer' && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold">Company Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          {...form.register('company')}
                          placeholder="Your company name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Input
                          id="industry"
                          {...form.register('industry')}
                          placeholder="e.g., Technology, Healthcare"
                        />
                      </div>

                      <div>
                        <Label htmlFor="size">Company Size</Label>
                        <select
                          id="size"
                          {...form.register('size')}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        <Label htmlFor="website">Company Website</Label>
                        <Input
                          id="website"
                          type="url"
                          {...form.register('website')}
                          placeholder="https://yourcompany.com"
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

                {user.user_type === 'candidate' && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold">Professional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="current_ctc">Current CTC</Label>
                        <Input
                          id="current_ctc"
                          {...form.register('current_ctc')}
                          placeholder="e.g., 500000"
                        />
                      </div>

                      <div>
                        <Label htmlFor="expected_ctc">Expected CTC</Label>
                        <Input
                          id="expected_ctc"
                          {...form.register('expected_ctc')}
                          placeholder="e.g., 800000"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  
                  <div>
                    <Label htmlFor="bio">
                      {user.user_type === 'employer' ? 'Company Description' : 'Bio'}
                    </Label>
                    <Textarea
                      id="bio"
                      {...form.register('bio')}
                      placeholder={
                        user.user_type === 'employer'
                          ? 'Tell us about your company...'
                          : 'Tell us about yourself...'
                      }
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        {...form.register('phone')}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        {...form.register('location')}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {user?.user_type === 'candidate' && (
            <div className="mt-6">
              <ResumeUpload />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EditProfile;