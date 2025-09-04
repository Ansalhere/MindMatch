import { useState } from 'react';
import { Phone, Mail, MessageCircle, Calendar, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

interface ContactActionsProps {
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateId: string;
}

const ContactActions = ({ candidateName, candidateEmail, candidatePhone, candidateId }: ContactActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkedInContact = () => {
    // Generic LinkedIn search - in a real app, you'd have LinkedIn profile URLs
    const searchQuery = encodeURIComponent(candidateName);
    window.open(`https://www.linkedin.com/search/results/people/?keywords=${searchQuery}`, '_blank');
    toast.info("Opening LinkedIn search");
  };

  const handleScheduleMeeting = () => {
    // Generic calendar link - in a real app, you'd integrate with Calendly, Google Calendar, etc.
    const subject = encodeURIComponent(`Meeting with ${candidateName}`);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // Schedule for next week
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${subject}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(`Meeting with ${candidateName} to discuss opportunities`)}`;
    
    window.open(googleCalendarUrl, '_blank');
    toast.success("Opening calendar");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <MessageCircle className="h-4 w-4 mr-2" />
          Contact Candidate
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {candidateName}</DialogTitle>
          <DialogDescription>
            Choose how you'd like to reach out to this candidate
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              For privacy protection, contact details are only available for candidates you have active applications with or through approved channels.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Professional Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground mb-3">
                Contact information is protected. Use these professional channels:
              </div>
              
              <Button 
                onClick={handleLinkedInContact}
                className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Find on LinkedIn
              </Button>
              
              <Button 
                onClick={handleScheduleMeeting}
                className="w-full justify-start"
                variant="outline"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground p-3 bg-secondary/50 rounded-lg">
            💡 <strong>Pro tip:</strong> Connect on LinkedIn first to build a professional relationship before reaching out directly.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactActions;