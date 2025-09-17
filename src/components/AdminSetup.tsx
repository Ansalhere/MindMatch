import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Copy, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner";
import { Link } from 'react-router-dom';

const AdminSetup = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const adminCredentials = {
    email: 'admin@fresherpools.com',
    password: 'admin123'
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        <Card className="shadow-lg border-2 border-primary/20">
          <CardHeader className="text-center space-y-3 pb-4">
            <div className="mx-auto bg-primary p-3 rounded-lg w-16 h-16 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Super Admin Setup</CardTitle>
              <CardDescription className="text-base">
                Administrator login credentials for FresherPools
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-lg p-4 border border-primary/20">
              <h3 className="font-semibold text-primary mb-2">Admin Access Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email:</label>
                    <p className="font-mono text-sm">{adminCredentials.email}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(adminCredentials.email, 'Email')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Password:</label>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">
                        {showPassword ? adminCredentials.password : '•'.repeat(adminCredentials.password.length)}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(adminCredentials.password, 'Password')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Security Notice</h4>
              <p className="text-sm text-yellow-700">
                This is a demo admin account. In production, please change these credentials 
                and implement proper authentication security measures.
              </p>
            </div>

            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link to="/admin-login">
                  Access Admin Panel
                </Link>
              </Button>
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/">
                  ← Back to Home
                </Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Super Admin Features:</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Complete user management</li>
                <li>• Job posting oversight</li>
                <li>• Content moderation</li>
                <li>• System configuration</li>
                <li>• Analytics and reporting</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSetup;