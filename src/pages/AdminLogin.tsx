import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield, Loader2, Building, UserCheck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { signIn } from '@/lib/supabase';
import { simpleLoginSchema, type SimpleLoginFormData } from '@/lib/validation';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Layout from '@/components/Layout';

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<SimpleLoginFormData>({
    resolver: zodResolver(simpleLoginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: SimpleLoginFormData) => {
    console.log('Admin login form submitted with data:', data);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting to sign in with:', data.email);
      const { data: signInData, error } = await signIn(data.email, data.password);
      
      console.log('Sign in response:', { success: !error, error: { _type: typeof error, value: error?.message || 'undefined' }, session: !!signInData?.session });
      
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      if (signInData?.user && signInData?.session) {
        console.log('Sign in successful for user:', signInData.user.id);
        
        // Check if user exists in our users table first
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('user_type, email, id')
          .eq('email', signInData.user.email)
          .single();
        
        console.log('Admin check - userData:', userData, 'userError:', userError);
        
        // Special case for superadmin@fresherpools.com - create admin user if doesn't exist
        if (signInData.user.email === 'superadmin@fresherpools.com') {
          if (userError && userError.code === 'PGRST116') {
            // User doesn't exist in users table, create it with the actual auth user ID
            console.log('Creating admin user in users table with ID:', signInData.user.id);
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: signInData.user.id, // Use the actual auth user ID
                email: 'superadmin@fresherpools.com',
                name: 'Super Administrator',
                user_type: 'admin',
                company: 'FresherPools',
                location: 'India',
                bio: 'System Administrator with full access to platform management',
                is_premium: true,
                rank_score: 100,
                avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
              });
            
            if (insertError) {
              console.error('Error creating admin user:', insertError);
              throw new Error(`Failed to create admin profile: ${insertError.message}`);
            }
            
            console.log('Admin user created successfully');
          } else if (!userData || userData.user_type !== 'admin') {
            console.log('User exists but is not admin:', userData);
            throw new Error('Access denied. Admin privileges required.');
          }
          
          toast({ title: "Success", description: "Admin login successful!" });
          console.log('Navigating to super-admin dashboard');
          navigate('/super-admin', { replace: true });
        } else {
          console.log('Non-admin email attempted:', signInData.user.email);
          throw new Error('Access denied. Admin email required.');
        }
      } else {
        console.log('No user or session in response');
        throw new Error('Login failed. Please try again.');
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred during login';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      console.error('Admin login error:', err);
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
        <div className="max-w-sm w-full">
          <Card className="shadow-sm border">
            <CardHeader className="text-center space-y-3 pb-4">
              <div className="mx-auto bg-primary p-2 rounded-lg w-12 h-12 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Admin Access</CardTitle>
                <CardDescription className="text-sm">
                  Secure login for system administrators
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Demo credentials notice */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700 font-medium">Demo Admin Credentials:</p>
                <p className="text-xs text-blue-600 mt-1">
                  Email: <span className="font-mono">superadmin@fresherpools.com</span><br />
                  Password: <span className="font-mono">admin123</span>
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="superadmin@fresherpools.com" {...field} />
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
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                      {error}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    onClick={(e) => {
                      console.log('Admin login button clicked!');
                      console.log('Form is valid:', form.formState.isValid);
                      console.log('Form errors:', form.formState.errors);
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground">Other Options</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="text-xs"
                  >
                    <UserCheck className="h-3 w-3 mr-1" />
                    Job Seeker
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/employer-login')}
                    className="text-xs"
                  >
                    <Building className="h-3 w-3 mr-1" />
                    Employer
                  </Button>
                </div>
                
                <div className="text-center space-y-2 pt-2">
                  <div>
                    <span className="text-xs text-muted-foreground">Need an admin account? </span>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => navigate('/admin-signup')}
                      className="text-xs p-0 h-auto"
                    >
                      Create Admin Account
                    </Button>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => navigate('/auth-selector')}
                    className="text-xs text-muted-foreground"
                  >
                    ← Back to Login Options
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;