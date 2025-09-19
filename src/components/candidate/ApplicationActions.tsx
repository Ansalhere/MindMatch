import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Clock, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Application {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  job: {
    id: string;
    title: string;
    company: string;
  };
}

interface ApplicationActionsProps {
  applications: Application[];
  onUpdate?: () => void;
}

const ApplicationActions = ({ applications, onUpdate }: ApplicationActionsProps) => {
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      setWithdrawingId(applicationId);
      
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      toast.success('Application withdrawn successfully');
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Error withdrawing application:', error);
      toast.error('Failed to withdraw application: ' + error.message);
    } finally {
      setWithdrawingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (applications.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Clock className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Applications</h3>
          <p className="text-sm text-muted-foreground text-center">
            You haven't applied to any jobs yet. Start exploring opportunities!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">My Applications</h3>
      {applications.map((application) => (
        <Card key={application.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-lg">{application.job.title}</h4>
                  <Badge className={getStatusColor(application.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(application.status)}
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </div>
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  at {application.job.company}
                </p>
                <p className="text-xs text-muted-foreground">
                  Applied on {new Date(application.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {application.status === 'pending' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={withdrawingId === application.id}
                        className="text-destructive hover:text-destructive"
                      >
                        {withdrawingId === application.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        Withdraw
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          Withdraw Application
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to withdraw your application for "{application.job.title}" 
                          at {application.job.company}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleWithdrawApplication(application.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Withdraw Application
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                {application.status !== 'pending' && (
                  <div className="text-sm text-muted-foreground">
                    {application.status === 'accepted' ? 'Congratulations!' : 'Better luck next time'}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationActions;