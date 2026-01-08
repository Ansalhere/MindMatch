import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Building, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { signUp, signIn } from '@/lib/supabase';
import { supabase } from '@/integrations/supabase/client';
import { authSchema, signupSchema, loginSchema, type AuthFormData, sanitizeObject } from '@/lib/validation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useReferralTracking } from '@/hooks/useReferralTracking';
import { Separator } from "@/components/ui/separator";

import DetailedSignupForm from '@/components/candidate/DetailedSignupForm';

// Add additional fields for employer signup
const employerFields = [
  { name: 'company', label: 'Company Name', type: 'text', required: true },
  { name: 'industry', label: 'Industry', type: 'text', required: true },
  { name: 'size', label: 'Company Size', type: 'select', options: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'], required: true },
  { name: 'website', label: 'Company Website', type: 'url', required: false },
];

// Define the type for form values
interface FormValues {
  company?: string;
  industry?: string;
  size?: string;
  website?: string;
  [key: string]: string | undefined;
}

const AuthForm = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { completeReferral } = useReferralTracking();
  // Check for mode parameter from URL (e.g., ?mode=signup)
  const urlMode = searchParams.get('mode');
  // Get return URL for redirecting back after auth
  const returnTo = searchParams.get('returnTo') || '/dashboard';
  // Default to login unless explicitly on /register route or mode=signup
  const [isRegister, setIsRegister] = useState(location.pathname === '/register' || urlMode === 'signup');
  const [isLoading, setIsLoading] = useState(false);
  const [isSSOLoading, setIsSSOLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [showDetailedForm, setShowDetailedForm] = useState(false);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Update isRegister based on current route or URL params
  useEffect(() => {
    const mode = searchParams.get('mode');
    setIsRegister(location.pathname === '/register' || mode === 'signup');
  }, [location.pathname, searchParams]);

  const form = useForm<AuthFormData>({
    resolver: zodResolver(isRegister ? signupSchema : loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      name: '',
      user_type: 'candidate',
    },
  });

  // Handle form submission with proper validation
  const handleSubmit = async (data: AuthFormData) => {
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Sanitize input data
      const sanitizedData = sanitizeObject(data) as AuthFormData;
      
      // Validate required fields
      if (!sanitizedData.email || !sanitizedData.password) {
        throw new Error('Email and password are required');
      }
      
      if (isRegister && !sanitizedData.name) {
        throw new Error('Name is required for registration');
      }
      
      // Validate employer-specific fields if registering as employer
      if (isRegister && sanitizedData.user_type === 'employer') {
        if (!formValues.company?.trim()) {
          throw new Error('Company name is required for employer registration');
        }
        if (!formValues.industry?.trim()) {
          throw new Error('Industry is required for employer registration');
        }
        if (!formValues.size?.trim()) {
          throw new Error('Company size is required for employer registration');
        }
      }
      
      if (isRegister) {
        // Prepare user metadata with conditional employer fields
        const userData = {
          name: sanitizedData.name,
          user_type: sanitizedData.user_type,
          ...(sanitizedData.user_type === 'employer' && {
            company: formValues.company?.trim() || '',
            industry: formValues.industry?.trim() || '',
            size: formValues.size?.trim() || '',
            website: formValues.website?.trim() || '',
          })
        };
        
        // Create account immediately
        const { data: signUpData, error } = await signUp(sanitizedData.email, sanitizedData.password, userData);
        
        if (error) {
          throw error;
        }
        
        if (signUpData?.user) {
          // Complete referral if exists
          await completeReferral(signUpData.user.id);
          setCreatedUserId(signUpData.user.id);
          
          // For candidates, show detailed form to collect more info (can be skipped)
          if (sanitizedData.user_type === 'candidate') {
            toast.success("Account created! Now let's add some details to your profile.");
            setShowDetailedForm(true);
            setIsLoading(false);
            return;
          }
          
          toast.success("Account created successfully!");
          // Small delay to ensure auth state is updated
          setTimeout(() => {
            navigate(returnTo, { replace: true });
          }, 100);
        } else {
          throw new Error('Signup failed. Please try again.');
        }
      } else {
        const { data: signInData, error } = await signIn(sanitizedData.email, sanitizedData.password);
        
        if (error) {
          throw error;
        }
        
        if (signInData?.user && signInData?.session) {
          toast.success("Welcome back!");
          // Small delay to ensure auth state is updated
          setTimeout(() => {
            navigate(returnTo, { replace: true });
          }, 100);
        } else {
          throw new Error('Login failed. Please try again.');
        }
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred during authentication';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployerFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  // Update user profile with additional details after account creation
  const handleDetailedSignup = async (detailedData: any) => {
    if (!createdUserId) {
      navigate(returnTo, { replace: true });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Update the user's profile with additional data
      const { error } = await supabase
        .from('users')
        .update({
          phone: detailedData.phone || null,
          location: detailedData.location || null,
          current_ctc: detailedData.current_ctc || null,
          expected_ctc: detailedData.expected_ctc || null,
          bio: detailedData.bio || null,
        })
        .eq('id', createdUserId);
      
      if (error) {
        console.error('Profile update error:', error);
        // Don't throw - profile update is optional, still navigate to dashboard
      }
      
      toast.success("Profile updated!");
      navigate(returnTo, { replace: true });
    } catch (error: any) {
      console.error('Detailed signup error:', error);
      // Still navigate even if update fails
      navigate(returnTo, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Skip detailed form and go directly to return URL
  const handleSkipDetailedForm = () => {
    toast.success("Welcome! You can complete your profile later.");
    navigate(returnTo, { replace: true });
  };

  if (showDetailedForm) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <DetailedSignupForm 
            onSubmit={handleDetailedSignup} 
            onSkip={handleSkipDetailedForm}
            isLoading={isLoading} 
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
              <CardHeader>
                <CardTitle>{isRegister ? 'Create an Account' : 'Log In to RankMe.AI'}</CardTitle>
                <CardDescription>
                  {isRegister 
                    ? 'Sign up to find jobs or candidates' 
                    : 'Welcome back! Log in to continue'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    {isRegister && (
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div>
                          <Label>Account Type</Label>
                          <div className="grid grid-cols-2 gap-4 mt-2">
                            <Button 
                              type="button"
                              variant={form.watch('user_type') === 'candidate' ? 'default' : 'outline'}
                              className="w-full"
                              onClick={() => form.setValue('user_type', 'candidate')}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Candidate
                            </Button>
                            <Button 
                              type="button"
                              variant={form.watch('user_type') === 'employer' ? 'default' : 'outline'}
                              className="w-full"
                              onClick={() => form.setValue('user_type', 'employer')}
                            >
                              <Building className="h-4 w-4 mr-2" />
                              Employer
                            </Button>
                          </div>
                        </div>
                        
                        {/* Show employer fields if employer is selected */}
                        {isRegister && form.watch('user_type') === 'employer' && (
                          <div className="space-y-4 border rounded-md p-4 bg-secondary/20">
                            <h3 className="font-medium">Company Information</h3>
                            {employerFields.map(field => (
                              <div key={field.name}>
                                <Label htmlFor={field.name}>{field.label}{field.required && ' *'}</Label>
                                 {field.type === 'select' ? (
                                   <Select 
                                     onValueChange={(value) => setFormValues(prev => ({ ...prev, [field.name]: value }))}
                                     required={field.required}
                                     value={formValues[field.name] || ''}
                                   >
                                     <SelectTrigger>
                                       <SelectValue placeholder={`Select ${field.label}`} />
                                     </SelectTrigger>
                                     <SelectContent>
                                       {field.options?.map(option => (
                                         <SelectItem key={option} value={option}>{option}</SelectItem>
                                       ))}
                                     </SelectContent>
                                   </Select>
                                 ) : (
                                   <Input
                                     id={field.name}
                                     name={field.name}
                                     type={field.type}
                                     value={formValues[field.name] || ''}
                                     onChange={handleEmployerFieldChange}
                                     required={field.required}
                                   />
                                 )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                          {isRegister && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Password must contain at least 8 characters, including uppercase, lowercase, number, and special character
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                    
                    {error && (
                      <div className="text-sm text-red-500">{error}</div>
                    )}
                    
                     <Button 
                       type="submit" 
                       className="w-full" 
                       disabled={isLoading || isSSOLoading !== null}
                     >
                       {isLoading ? (
                         <>
                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                           {isRegister ? 'Creating Account...' : 'Logging In...'}
                         </>
                       ) : (
                         isRegister ? 'Create Account' : 'Log In'
                       )}
                     </Button>

                    {/* SSO Divider and Buttons */}
                    <div className="relative my-4">
                      <Separator />
                      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                        or continue with
                      </span>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      disabled={isLoading || isSSOLoading !== null}
                      onClick={async () => {
                        setIsSSOLoading('google');
                        try {
                          const { error } = await supabase.auth.signInWithOAuth({
                            provider: 'google',
                            options: {
                              redirectTo: `${window.location.origin}/dashboard`,
                            }
                          });
                          if (error) throw error;
                        } catch (err: any) {
                          toast.error(err.message || 'Failed to sign in with Google');
                          setIsSSOLoading(null);
                        }
                      }}
                    >
                      {isSSOLoading === 'google' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      )}
                      Continue with Google
                    </Button>
                    
                    <div className="text-center text-sm">
                      {isRegister ? (
                        <>
                          Already have an account?{' '}
                           <Button 
                             type="button"
                             variant="link" 
                             className="p-0 h-auto cursor-pointer" 
                             onClick={(e) => {
                               e.preventDefault();
                               setIsRegister(false); 
                               setError(null);
                               setFormValues({});
                               form.reset({
                                 email: '',
                                 password: '',
                                 name: '',
                                 user_type: 'candidate',
                               });
                               navigate('/auth');
                             }}
                           >
                             Log In
                           </Button>
                        </>
                      ) : (
                        <>
                          Don't have an account?{' '}
                           <Button 
                             type="button"
                             variant="link" 
                             className="p-0 h-auto cursor-pointer" 
                             onClick={(e) => {
                               e.preventDefault();
                               setIsRegister(true); 
                               setError(null);
                               setFormValues({});
                               form.reset({
                                 email: '',
                                 password: '',
                                 name: '',
                                 user_type: 'candidate',
                               });
                               navigate('/register');
                             }}
                           >
                             Sign Up
                           </Button>
                        </>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthForm;