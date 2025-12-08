import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Crown, FileText, Sparkles, Zap, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface ResumePremiumGateProps {
  open: boolean;
  onClose: () => void;
  resumeCount: number;
  onUpgrade: () => void;
}

const ResumePremiumGate = ({ open, onClose, resumeCount, onUpgrade }: ResumePremiumGateProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'single' | 'unlimited'>('single');
  const [processing, setProcessing] = useState(false);

  const plans = [
    {
      id: 'single' as const,
      name: 'Single Resume',
      price: 99,
      originalPrice: 199,
      features: [
        'Create 1 additional ATS-optimized resume',
        'All premium templates',
        'AI-powered content suggestions',
        'PDF & Word download',
        'Valid for 30 days',
      ],
    },
    {
      id: 'unlimited' as const,
      name: 'Unlimited Resumes',
      price: 299,
      originalPrice: 599,
      features: [
        'Unlimited resume creations',
        'All premium templates including Executive',
        'Advanced AI content generation',
        'Multiple format downloads',
        'Priority support',
        'Valid for 1 year',
      ],
      popular: true,
    },
  ];

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    toast.info('Redirecting to payment gateway...');
    
    // In production, integrate with Stripe or Razorpay
    setTimeout(() => {
      setProcessing(false);
      toast.success('Payment feature coming soon! For now, enjoy free access.');
      onUpgrade();
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-yellow-500" />
            Unlock Premium Resume Builder
          </DialogTitle>
          <DialogDescription>
            You've created {resumeCount} resume(s). Upgrade to create more ATS-friendly resumes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`p-4 cursor-pointer transition-all relative ${
                selectedPlan === plan.id
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 right-4 bg-gradient-to-r from-primary to-purple-500">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{plan.name}</h3>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-bold">₹{plan.price}</span>
                <span className="text-muted-foreground line-through text-sm">
                  ₹{plan.originalPrice}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {Math.round((1 - plan.price / plan.originalPrice) * 100)}% OFF
                </Badge>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <Button
            onClick={handlePayment}
            disabled={processing}
            className="w-full h-12 text-lg gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
          >
            {processing ? (
              <>
                <Zap className="h-5 w-5 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Pay ₹{plans.find(p => p.id === selectedPlan)?.price} - Get Started
              </>
            )}
          </Button>
          
          <p className="text-center text-xs text-muted-foreground">
            Secure payment powered by Razorpay. 100% money-back guarantee.
          </p>
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Why upgrade?
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 78% of resumes are rejected by ATS before human review</li>
            <li>• Our premium templates are optimized for 50+ major ATS systems</li>
            <li>• AI-powered suggestions increase interview callbacks by 3x</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResumePremiumGate;
