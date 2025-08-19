import { useState } from 'react';
import { Phone, Mail, MessageCircle, Calendar, ExternalLink } from 'lucide-react';
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
import { toast } from "sonner";

interface ContactActionsProps {
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  candidateId: string;
}

const ContactActions = ({ candidateName, candidateEmail, candidatePhone, candidateId }: ContactActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmailContact = () => {
    if (candidateEmail) {
      const subject = encodeURIComponent(`Opportunity Discussion - ${candidateName}`);
      const body = encodeURIComponent(`Dear ${candidateName},\n\nI hope this message finds you well. I am reaching out regarding potential opportunities that might align with your career goals.\n\nI would love to discuss how your skills and experience could contribute to our team.\n\nLooking forward to hearing from you.\n\nBest regards`);
      window.open(`mailto:${candidateEmail}?subject=${subject}&body=${body}`, '_blank');
      toast.success("Email client opened");
    } else {
      toast.error("Email not available");
    }
  };

  const handlePhoneContact = () => {
    if (candidatePhone) {
      window.open(`tel:${candidatePhone}`, '_blank');
      toast.success("Dialing number");
    } else {
      toast.error("Phone number not available");
    }
  };

  const handleWhatsAppContact = () => {
    if (candidatePhone) {
      const message = encodeURIComponent(`Hi ${candidateName}, I'm interested in discussing career opportunities with you. Can we schedule a call?`);
      const cleanPhone = candidatePhone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
      toast.success("Opening WhatsApp");
    } else {
      toast.error("Phone number not available for WhatsApp");
    }
  };

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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleEmailContact}
                disabled={!candidateEmail}
                className="w-full justify-start"
                variant="outline"
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
                {candidateEmail && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {candidateEmail.length > 20 ? candidateEmail.substring(0, 20) + '...' : candidateEmail}
                  </Badge>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Phone Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handlePhoneContact}
                disabled={!candidatePhone}
                className="w-full justify-start"
                variant="outline"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Direct
                {candidatePhone && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {candidatePhone}
                  </Badge>
                )}
              </Button>
              
              <Button 
                onClick={handleWhatsAppContact}
                disabled={!candidatePhone}
                className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp Message
              </Button>
            </CardContent>
          </Card>

          <Separator />

          <div className="space-y-3">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactActions;