import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { Send, Mail } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  recipientType: 'candidate' | 'employer';
}

const ContactModal = ({ isOpen, onClose, recipientId, recipientName, recipientType }: ContactModalProps) => {
  const { user } = useUser();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: recipientId,
          subject: subject.trim(),
          message: message.trim(),
          conversation_id: `${user.id}-${recipientId}`
        });

      if (error) throw error;

      // Create notification for recipient
      await supabase
        .from('notifications')
        .insert({
          user_id: recipientId,
          title: 'New Message Received',
          message: `You have received a new message from ${user.name || user.email}`,
          type: 'message'
        });

      toast.success("Message sent successfully!");
      setSubject('');
      setMessage('');
      onClose();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultSubjects = {
    candidate: [
      "Job Opportunity Discussion",
      "Interview Invitation",
      "Position Inquiry",
      "Profile Review"
    ],
    employer: [
      "Application Follow-up",
      "Position Interest",
      "Additional Information",
      "Interview Request"
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact {recipientName}
          </DialogTitle>
          <DialogDescription>
            Send a direct message to this {recipientType}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter message subject"
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {defaultSubjects[recipientType].map((defaultSubject) => (
                <Button
                  key={defaultSubject}
                  variant="outline"
                  size="sm"
                  onClick={() => setSubject(defaultSubject)}
                  className="text-xs h-6"
                >
                  {defaultSubject}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message here..."
              rows={4}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !subject.trim() || !message.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;