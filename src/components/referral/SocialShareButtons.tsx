import { Button } from '@/components/ui/button';
import { MessageCircle, Twitter, Linkedin, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareButtonsProps {
  referralLink: string;
  message?: string;
}

export const SocialShareButtons = ({ referralLink, message }: SocialShareButtonsProps) => {
  const defaultMessage = "Join FresherPools - the best job platform for freshers! Use my referral link to sign up:";
  const shareMessage = message || defaultMessage;
  
  const encodedMessage = encodeURIComponent(shareMessage);
  const encodedLink = encodeURIComponent(referralLink);

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}%20${encodedLink}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedLink}`;
    window.open(twitterUrl, '_blank');
  };

  const shareOnLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`;
    window.open(linkedinUrl, '_blank');
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join FresherPools',
          text: shareMessage,
          url: referralLink,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('Failed to share');
        }
      }
    } else {
      navigator.clipboard.writeText(`${shareMessage} ${referralLink}`);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnWhatsApp}
        className="flex-1 min-w-[80px] bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30 text-[#25D366]"
      >
        <MessageCircle className="h-4 w-4 mr-1.5" />
        WhatsApp
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnTwitter}
        className="flex-1 min-w-[80px] bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/30 text-[#1DA1F2]"
      >
        <Twitter className="h-4 w-4 mr-1.5" />
        Twitter
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={shareOnLinkedIn}
        className="flex-1 min-w-[80px] bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border-[#0A66C2]/30 text-[#0A66C2]"
      >
        <Linkedin className="h-4 w-4 mr-1.5" />
        LinkedIn
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={nativeShare}
        className="flex-1 min-w-[80px]"
      >
        <Share2 className="h-4 w-4 mr-1.5" />
        More
      </Button>
    </div>
  );
};
