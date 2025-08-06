import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { signIn } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const LoginTest = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTestLogin = async () => {
    console.log('=== SIMPLE LOGIN TEST ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Calling signIn...');
      const { data, error } = await signIn(email, password);
      
      console.log('SignIn result:', { data, error });
      
      if (error) {
        console.error('Login error:', error);
        toast.error(error.message);
      } else if (data?.user) {
        console.log('Login successful!');
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        console.error('No user data returned');
        toast.error('Login failed - no user data');
      }
    } catch (err) {
      console.error('Catch block error:', err);
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Simple Login Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label>Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          
          <div>
            <label>Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <Button 
            onClick={() => {
              console.log('Button clicked!');
              handleTestLogin();
            }}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Logging in...' : 'Test Login'}
          </Button>

          <div className="text-sm text-muted-foreground">
            Test with: techcorp@example.com / Demo123!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginTest;