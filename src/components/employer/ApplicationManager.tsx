
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, Loader2, Trophy, User, Phone, Mail, MapPin, Crown } from 'lucide-react';
import { toast } from "sonner";
import { updateApplicationStatus } from '@/lib/supabase';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';
import ReplyToApplication from './ReplyToApplication';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ApplicationManagerProps {
  applications: any[];
  onStatusUpdate?: () => void;
}

const ApplicationManager = ({ applications = [], onStatusUpdate }: ApplicationManagerProps) => {
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);
  const { features, offerMessage } = usePremiumFeatures();

  const handleUpdateStatus = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      setUpdatingAppId(applicationId);
      const { error } = await updateApplicationStatus(applicationId, newStatus);
      
      if (error) throw error;
      
      toast.success(`Application ${newStatus === 'accepted' ? 'accepted' : 'rejected'} successfully`);
      if (onStatusUpdate) onStatusUpdate();
    } catch (error: any) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application: " + error.message);
    } finally {
      setUpdatingAppId(null);
    }
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-8 bg-muted/30 rounded-lg">
        <p className="text-muted-foreground">No applications to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {features.viewAllContactDetails && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-primary font-semibold mb-2">
            <Crown className="h-4 w-4" />
            Premium Access Enabled
          </div>
          <p className="text-sm text-muted-foreground">{offerMessage}</p>
        </div>
      )}
      
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Candidate Info</TableHead>
          <TableHead>Contact Details</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Ranking</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app.id}>
            <TableCell className="font-medium">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{app.candidate?.name || "Unknown Candidate"}</span>
                </div>
                {app.note && (
                  <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    <strong>Cover Letter:</strong> {app.note}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1 text-sm">
                {app.candidate?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{app.candidate.email}</span>
                  </div>
                )}
                {app.candidate?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{app.candidate.phone}</span>
                  </div>
                )}
                {app.candidate?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>{app.candidate.location}</span>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={`${
                app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                app.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center text-amber-500">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{app.candidate?.rank_score || "N/A"}</span>
                </div>
                {app.candidate?.rank_score && (
                  <span className="text-xs text-muted-foreground">
                    {app.candidate.rank_score > 80 ? "Top tier" : 
                     app.candidate.rank_score > 60 ? "Mid tier" : "Entry tier"}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <ReplyToApplication
                  candidateId={app.candidate_id}
                  candidateName={app.candidate?.name || 'Candidate'}
                  applicationId={app.id}
                />
                {app.status === 'pending' && (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleUpdateStatus(app.id, 'rejected')}
                      disabled={updatingAppId === app.id}
                    >
                      {updatingAppId === app.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 mr-1" />
                      )}
                      Reject
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateStatus(app.id, 'accepted')}
                      disabled={updatingAppId === app.id}
                    >
                      {updatingAppId === app.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Accept
                    </Button>
                  </>
                )}
                {app.status !== 'pending' && (
                  <Badge variant="outline">
                    {app.status === 'accepted' ? 'Accepted' : 'Rejected'}
                  </Badge>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationManager;
