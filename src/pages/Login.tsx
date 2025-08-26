import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Loader2, Building, Shield } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { signIn } from '@/lib/supabase';
import { simpleLoginSchema, type SimpleLoginFormData } from '@/lib/validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const Login = () => {
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
    console.log('Login form submitted with data:', data);
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: signInData, error } = await signIn(data.email, data.password);
      
      if (error) {
        throw error;
      }
      
      if (signInData?.user && signInData?.session) {
        toast({ title: "Success", description: "Welcome back! Successfully logged in." });
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Login failed. Please try again.');
      }
    } catch (err: any) {
      let errorMessage = 'An error occurred during login';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
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
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Job Seeker Login</CardTitle>
                <CardDescription className="text-sm">
                  Access your career dashboard
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
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
                      console.log('🔵 Login button clicked!');
                      console.log('🔵 Form is valid:', form.formState.isValid);
                      console.log('🔵 Form errors:', form.formState.errors);
                      console.log('🔵 Form values:', form.getValues());
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 space-y-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary hover:underline font-medium">
                      Sign up here
                    </Link>
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-background text-muted-foreground">Other Options</span>
                  </div>
                </div>
                 
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/employer-login')}
                    className="text-xs"
                  >
                    <Building className="h-3 w-3 mr-1" />
                    Employer Login
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

export default Login;