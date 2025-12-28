import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, LogIn, UserPlus, CheckCircle2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthGateModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthGateModal = ({ open, onClose }: AuthGateModalProps) => {
  const navigate = useNavigate();

  const benefits = [
    'Download unlimited free resumes',
    'Access all ATS-optimized templates',
    'Save your progress automatically',
    'Get personalized AI suggestions',
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">Ready to Download?</DialogTitle>
          <DialogDescription className="text-base">
            Create a free account to download your resume and unlock premium features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={() => navigate('/auth?mode=signup')}
            className="w-full gap-2 h-12"
            size="lg"
          >
            <UserPlus className="h-5 w-5" />
            Create Free Account
          </Button>
          <Button
            onClick={() => navigate('/auth?mode=login')}
            variant="outline"
            className="w-full gap-2"
          >
            <LogIn className="h-5 w-5" />
            Already have an account? Login
          </Button>
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-medium">Free users get 2 resume downloads!</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthGateModal;
