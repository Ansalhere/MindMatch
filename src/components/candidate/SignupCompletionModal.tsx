import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface SignupCompletionModalProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
}

const SignupCompletionModal = ({ open, onClose, userName }: SignupCompletionModalProps) => {
  const navigate = useNavigate();

  const handleBuildResume = () => {
    onClose();
    navigate('/resume-builder');
  };

  const handleSkip = () => {
    onClose();
    navigate('/dashboard');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome to RankMe.AI, {userName || 'Candidate'}! 🎉
          </DialogTitle>
          <DialogDescription className="text-base">
            Your account has been created successfully. Let's get you started!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary text-primary-foreground rounded-lg">
                <FileText className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">
                  Build Your Professional Resume
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create a stunning, ATS-optimized resume in minutes with our professional templates. 
                  We have 7 beautiful templates to choose from!
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="text-sm bg-white px-3 py-1 rounded-full border">
                    ✓ 7 Professional Templates
                  </div>
                  <div className="text-sm bg-white px-3 py-1 rounded-full border">
                    ✓ ATS-Friendly
                  </div>
                  <div className="text-sm bg-white px-3 py-1 rounded-full border">
                    ✓ Download as PDF
                  </div>
                  <div className="text-sm bg-white px-3 py-1 rounded-full border">
                    ✓ Auto-Fill from Profile
                  </div>
                </div>
                <Button 
                  onClick={handleBuildResume}
                  className="w-full"
                  size="lg"
                >
                  Build My Resume Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>

          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip for now - Take me to dashboard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupCompletionModal;
