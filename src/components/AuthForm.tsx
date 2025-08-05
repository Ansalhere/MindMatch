import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Building, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { signUp, signIn } from '@/lib/supabase';
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
import LoginCredentials from '@/components/LoginCredentials';

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
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const navigate = useNavigate();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(isRegister ? signupSchema : loginSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      user_type: 'candidate',
    },
  });

  // Handle form submission with proper validation
  const handleSubmit = async (data: AuthFormData) => {
    console.log('handleSubmit called with:', data);
    setIsLoading(true);
    setError(null);
    
    try {
      // Sanitize input data
      const sanitizedData = sanitizeObject(data) as AuthFormData;
      console.log('Form submission:', { email: sanitizedData.email, isRegister, userType: sanitizedData.user_type });
      
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
        
        console.log('Attempting signup with userData:', userData);
        const { data: signUpData, error } = await signUp(sanitizedData.email, sanitizedData.password, userData);
        
        if (error) {
          console.error('Signup error:', error);
          throw error;
        }
        
        if (signUpData?.user) {
          console.log('Signup successful:', signUpData);
          toast.success("Account created successfully! You can now access your dashboard.");
          navigate('/dashboard');
        } else {
          throw new Error('Signup failed. Please try again.');
        }
      } else {
        console.log('Attempting signin...');
        const { data: signInData, error } = await signIn(sanitizedData.email, sanitizedData.password);
        
        if (error) {
          console.error('Signin error:', error);
          throw error;
        }
        
        if (signInData?.user && signInData?.session) {
          console.log('Signin successful:', signInData);
          toast.success("Welcome back! Successfully logged in.");
          navigate('/dashboard');
        } else {
          throw new Error('Login failed. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Login Form */}
          <div>
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
                                    type={field.type}
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
                      disabled={isLoading}
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
                    
                    <div className="text-center text-sm">
                      {isRegister ? (
                        <>
                          Already have an account?{' '}
                           <Button 
                             variant="link" 
                             className="p-0 h-auto" 
                             onClick={() => {
                               setIsRegister(false); 
                               setError(null);
                               form.reset({
                                 email: '',
                                 password: '',
                                 name: '',
                                 user_type: 'candidate',
                               });
                             }}
                           >
                             Log In
                           </Button>
                        </>
                      ) : (
                        <>
                          Don't have an account?{' '}
                           <Button 
                             variant="link" 
                             className="p-0 h-auto" 
                             onClick={() => {
                               setIsRegister(true); 
                               setError(null);
                               form.reset({
                                 email: '',
                                 password: '',
                                 name: '',
                                 user_type: 'candidate',
                               });
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
          
          {/* Demo Credentials */}
          {!isRegister && (
            <div>
              <LoginCredentials />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthForm;