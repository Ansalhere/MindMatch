import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Building, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { signUp, signIn } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Add additional fields for employer signup
const employerFields = [
  { name: 'company', label: 'Company Name', type: 'text', required: true },
  { name: 'industry', label: 'Industry', type: 'text', required: true },
  { name: 'size', label: 'Company Size', type: 'select', options: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'], required: true },
  { name: 'website', label: 'Company Website', type: 'url', required: false },
];

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState<'candidate' | 'employer'>('candidate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({});
  const navigate = useNavigate();

  // Modify to include employer fields
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (isRegister) {
        // Prepare user metadata with conditional employer fields
        const userData = {
          name,
          user_type: userType,
          ...(userType === 'employer' && {
            company: formValues.company || '',
            industry: formValues.industry || '',
            size: formValues.size || '',
            website: formValues.website || '',
          })
        };
        
        const { data, error } = await signUp(email, password, userData);
        
        if (error) throw error;
        
        if (data) {
          toast.success("Successfully signed up!");
          navigate('/dashboard');
        }
      } else {
        const { data, error } = await signIn(email, password);
        
        if (error) throw error;
        
        if (data) {
          toast.success("Successfully logged in!");
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'An error occurred');
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
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>{isRegister ? 'Create an Account' : 'Log In'}</CardTitle>
              <CardDescription>
                {isRegister 
                  ? 'Sign up to find jobs or candidates' 
                  : 'Welcome back! Log in to continue'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label>Account Type</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <Button 
                          type="button"
                          variant={userType === 'candidate' ? 'default' : 'outline'}
                          className="w-full"
                          onClick={() => setUserType('candidate')}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Candidate
                        </Button>
                        <Button 
                          type="button"
                          variant={userType === 'employer' ? 'default' : 'outline'}
                          className="w-full"
                          onClick={() => setUserType('employer')}
                        >
                          <Building className="h-4 w-4 mr-2" />
                          Employer
                        </Button>
                      </div>
                    </div>
                    
                    {/* Show employer fields if employer is selected */}
                    {isRegister && userType === 'employer' && (
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
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
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
                        onClick={() => {setIsRegister(false); setError(null);}}
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
                        onClick={() => {setIsRegister(true); setError(null);}}
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthForm;
