import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Building, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const DemoCredentials = () => {
  const credentials = [
    {
      type: 'Candidate',
      icon: <User className="h-4 w-4" />,
      email: 'alice@example.com',
      password: 'password123',
      description: 'Sample candidate with skills and experience',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      type: 'Employer',
      icon: <Building className="h-4 w-4" />,
      email: 'techcorp@example.com',
      password: 'password123',
      description: 'Employer account for posting jobs',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
  ];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard`);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Demo Login Credentials</h3>
        <p className="text-sm text-muted-foreground">
          Use these credentials to explore different user roles
        </p>
      </div>
      
      {credentials.map((cred, index) => (
        <Card key={index} className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {cred.icon}
                <span>{cred.type} Account</span>
              </div>
              <Badge variant="outline" className={cred.color}>
                Demo
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {cred.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-mono">{cred.email}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(cred.email, 'Email')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div>
                  <p className="text-xs text-muted-foreground">Password</p>
                  <p className="text-sm font-mono">{cred.password}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(cred.password, 'Password')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> These are demo accounts for testing purposes only. 
          In production, these credentials should be removed or restricted.
        </p>
      </div>
    </div>
  );
};

export default DemoCredentials;