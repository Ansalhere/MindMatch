import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building, Loader2, Shield, UserCheck } from 'lucide-react';
import { toast } from "sonner";
import { signIn } from '@/lib/supabase';
import { loginSchema, type AuthFormData } from '@/lib/validation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Layout from '@/components/Layout';
import { Link } from 'react-router-dom';

const EmployerLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: signInData, error } = await signIn(data.email, data.password);
      
      if (error) {
        throw error;
      }
      
      if (signInData?.user && signInData?.session) {
        toast.success("Welcome back! Successfully logged in.");
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
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Employer Portal</CardTitle>
                <CardDescription className="text-gray-600">
                  Access your hiring dashboard
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
                        <FormLabel>Company Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="hr@company.com" {...field} />
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
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <Building className="h-4 w-4 mr-2" />
                        Access Dashboard
                      </>
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-6 space-y-3">
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                      Sign up as Employer
                    </Link>
                  </p>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Other Login Options</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Job Seeker
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin-login')}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
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

export default EmployerLogin;