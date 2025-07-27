
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, AlertCircle } from 'lucide-react';
import { toast } from "sonner";
import { sampleLogins } from '../data/sampleProfiles';

const LoginCredentials = () => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    toast.success("Credentials copied to clipboard!");
    
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          Demo Login Credentials
        </CardTitle>
        <CardDescription>
          Use these demo credentials to test the application. These accounts are pre-created for demonstration purposes.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="candidates">
          <TabsList className="mb-4">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="employers">Employers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="candidates">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead className="text-right">Copy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleLogins.candidates.map((candidate, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant="outline">Candidate</Badge>
                    </TableCell>
                    <TableCell>{candidate.email}</TableCell>
                    <TableCell>{candidate.password}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopy(`Email: ${candidate.email}\nPassword: ${candidate.password}`, `c${index}`)}
                      >
                        {copiedIndex === `c${index}` ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="employers">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead className="text-right">Copy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleLogins.employers.map((employer, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant="outline">Employer</Badge>
                    </TableCell>
                    <TableCell>{employer.email}</TableCell>
                    <TableCell>{employer.password}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopy(`Email: ${employer.email}\nPassword: ${employer.password}`, `e${index}`)}
                      >
                        {copiedIndex === `e${index}` ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-primary/5 border-t">
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="font-medium">Important:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 ml-6">
            <li>Use these demo credentials to test different user types</li>
            <li>Demo accounts showcase various features and user roles</li>
            <li>In production, passwords would be securely hashed and never stored in plain text</li>
          </ol>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginCredentials;
