import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

interface ContactEmployerButtonProps {
  employerId: string;
  employerName: string;
  jobTitle?: string;
  className?: string;
}

const ContactEmployerButton = ({ 
  employerId, 
  employerName, 
  jobTitle, 
  className 
}: ContactEmployerButtonProps) => {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState(jobTitle ? `Inquiry about ${jobTitle}` : '');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { user } = useUser();

  const handleSendMessage = async () => {
    if (!user) {
      toast.error("Please log in to send messages");
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSending(true);

      // Insert message into database
      const { error: messageError } = await supabase
        .from('messages')
        .insert([{
          sender_id: user.id,
          receiver_id: employerId,
          subject: subject.trim(),
          message: message.trim()
        }]);

      if (messageError) throw messageError;

      // Send email notification
      try {
        await supabase.functions.invoke('send-notification-email', {
          body: {
            type: 'message',
            recipientId: employerId,
            data: {
              subject: subject.trim(),
              message: message.trim(),
              senderName: user.name || user.email,
              senderEmail: user.email
            }
          }
        });
      } catch (emailError) {
        console.error("Error sending email notification:", emailError);
        // Don't fail the message if email fails
      }

      toast.success("Message sent successfully!");
      setOpen(false);
      setSubject(jobTitle ? `Inquiry about ${jobTitle}` : '');
      setMessage('');
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Mail className="h-4 w-4 mr-2" />
          Contact Employer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contact {employerName}</DialogTitle>
          <DialogDescription>
            Send a direct message to the employer about this opportunity.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter message subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your message here..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={sending}>
              {sending ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactEmployerButton;