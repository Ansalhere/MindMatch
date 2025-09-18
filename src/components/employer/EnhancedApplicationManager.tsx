import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, X, Loader2, Trophy, User, Phone, Mail, MapPin, Crown, MessageSquare, Calendar, Building } from 'lucide-react';
import { toast } from "sonner";
import { updateApplicationStatus } from '@/lib/supabase';
import { usePremiumFeatures } from '@/hooks/usePremiumFeatures';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EnhancedApplicationManagerProps {
  applications: any[];
  onStatusUpdate?: () => void;
  jobTitle?: string;
}

const EnhancedApplicationManager = ({ applications = [], onStatusUpdate, jobTitle }: EnhancedApplicationManagerProps) => {
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

  const getRankTier = (score: number) => {
    if (score >= 90) return { label: "Exceptional", color: "text-purple-600" };
    if (score >= 80) return { label: "Top Tier", color: "text-green-600" };
    if (score >= 70) return { label: "Strong", color: "text-blue-600" };
    if (score >= 60) return { label: "Good", color: "text-orange-600" };
    return { label: "Entry Level", color: "text-gray-600" };
  };

  if (applications.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Applications Yet</h3>
          <p className="text-sm text-muted-foreground text-center">
            {jobTitle ? `No candidates have applied for "${jobTitle}" yet.` : "No applications to display"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Premium Features Banner */}
      {features.viewAllContactDetails && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-primary font-semibold mb-2">
              <Crown className="h-4 w-4" />
              Premium Access Enabled
            </div>
            <p className="text-sm text-muted-foreground">{offerMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Candidate Applications
            <Badge variant="outline" className="ml-auto">
              {applications.length} Total
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Contact & Details</TableHead>
                  <TableHead>Ranking</TableHead>
                  <TableHead>Application</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => {
                  const rankTier = app.candidate?.rank_score ? getRankTier(app.candidate.rank_score) : null;
                  
                  return (
                    <TableRow key={app.id} className="hover:bg-muted/50">
                      {/* Candidate Info */}
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">{app.candidate?.name || "Unknown Candidate"}</div>
                            <div className="text-sm text-muted-foreground">
                              {app.candidate?.company && `at ${app.candidate.company}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact Details */}
                      <TableCell>
                        <div className="space-y-1">
                          {features.viewAllContactDetails ? (
                            <>
                              {app.candidate?.email && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-3 w-3 text-muted-foreground" />
                                  <span>{app.candidate.email}</span>
                                </div>
                              )}
                              {app.candidate?.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3 w-3 text-muted-foreground" />
                                  <span>{app.candidate.phone}</span>
                                </div>
                              )}
                              {app.candidate?.location && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span>{app.candidate.location}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              Contact details available in full version
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Ranking */}
                      <TableCell>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center text-amber-600 mb-1">
                            <Trophy className="h-4 w-4 mr-1" />
                            <span className="font-bold text-lg">{app.candidate?.rank_score || "N/A"}</span>
                          </div>
                          {rankTier && (
                            <span className={`text-xs font-medium ${rankTier.color}`}>
                              {rankTier.label}
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* Application Details */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(app.created_at).toLocaleDateString()}
                          </div>
                          {app.candidate_note && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary">
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  View Cover Letter
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Cover Letter</DialogTitle>
                                  <DialogDescription>
                                    Message from {app.candidate?.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="p-4 bg-muted rounded-lg">
                                  <p className="text-sm whitespace-pre-wrap">{app.candidate_note}</p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {app.status === 'pending' ? (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleUpdateStatus(app.id, 'rejected')}
                                disabled={updatingAppId === app.id}
                                className="h-8"
                              >
                                {updatingAppId === app.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                              </Button>
                              <Button 
                                size="sm" 
                                onClick={() => handleUpdateStatus(app.id, 'accepted')}
                                disabled={updatingAppId === app.id}
                                className="h-8"
                              >
                                {updatingAppId === app.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3" />
                                )}
                              </Button>
                            </>
                          ) : (
                            <Badge variant={app.status === 'accepted' ? 'default' : 'destructive'}>
                              {app.status === 'accepted' ? 'Accepted' : 'Rejected'}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(app => app.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(app => app.status === 'accepted').length}
            </div>
            <div className="text-sm text-muted-foreground">Accepted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {applications.filter(app => app.status === 'rejected').length}
            </div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedApplicationManager;