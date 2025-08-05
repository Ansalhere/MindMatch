import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const AuthTest = () => {
  const { user, session, isLoading } = useUser();
  const [details, setDetails] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user || session) {
      setDetails({
        user: user ? {
          id: user.id,
          email: user.email,
          user_type: user.user_type,
          name: user.name
        } : null,
        session: session ? {
          access_token: session.access_token ? 'Present' : 'Missing',
          refresh_token: session.refresh_token ? 'Present' : 'Missing',
          expires_at: session.expires_at,
          user_id: session.user?.id
        } : null
      });
    }
  }, [user, session]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Authentication Status
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : user ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Authentication State:</h3>
            <div className="text-sm text-muted-foreground">
              <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
              <div>User Present: {user ? 'Yes' : 'No'}</div>
              <div>Session Present: {session ? 'Yes' : 'No'}</div>
            </div>
          </div>

          {details && (
            <div>
              <h3 className="font-medium mb-2">Auth Details:</h3>
              <pre className="bg-muted p-4 rounded text-xs overflow-auto">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          )}

          <div className="flex gap-2">
            {user ? (
              <>
                <Button onClick={handleSignOut} variant="outline">
                  Sign Out
                </Button>
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')}>
                Go to Login
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest;