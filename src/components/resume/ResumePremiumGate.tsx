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
import { CheckCircle2, Crown, FileText, Sparkles, Zap, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ResumePremiumGateProps {
  open: boolean;
  onClose: () => void;
  resumeCount: number;
  onUpgrade: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
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

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        console.log('Razorpay already loaded');
        resolve(true);
        return;
      }
      
      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="razorpay"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true));
        existingScript.addEventListener('error', () => resolve(false));
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded');
        resolve(true);
      };
      script.onerror = (e) => {
        console.error('Failed to load Razorpay script:', e);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to continue');
        setProcessing(false);
        return;
      }

      const selectedPlanData = plans.find(p => p.id === selectedPlan);
      if (!selectedPlanData) return;

      // Load Razorpay script first
      toast.loading('Loading payment gateway...', { id: 'payment-loading' });
      const loaded = await loadRazorpayScript();
      
      if (!loaded || !window.Razorpay) {
        toast.dismiss('payment-loading');
        toast.error('Failed to load payment gateway. Please check your internet connection and try again.');
        setProcessing(false);
        return;
      }
      
      toast.dismiss('payment-loading');
      toast.loading('Creating order...', { id: 'order-loading' });

      // Create order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('razorpay-order', {
        body: {
          amount: selectedPlanData.price,
          currency: 'INR',
          receipt: `resume_${user.id}_${Date.now()}`,
          notes: {
            plan: selectedPlan,
            user_id: user.id,
          },
        },
      });
      
      toast.dismiss('order-loading');

      if (orderError) {
        console.error('Order creation failed:', orderError);
        toast.error('Failed to create order. Please try again.');
        setProcessing(false);
        return;
      }
      
      if (!orderData || !orderData.orderId) {
        console.error('Invalid order data:', orderData);
        toast.error('Failed to create order. Please try again.');
        setProcessing(false);
        return;
      }
      
      console.log('Order created:', orderData);

      // Initialize Razorpay
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'FresherPools',
        description: `${selectedPlanData.name} - Resume Builder`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('razorpay-verify', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user.id,
                package_type: selectedPlan,
              },
            });

            if (verifyError || !verifyData?.success) {
              toast.error('Payment verification failed. Please contact support.');
              return;
            }

            toast.success('Payment successful! Premium features unlocked.');
            onUpgrade();
            onClose();
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          email: user.email,
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setProcessing(false);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong. Please try again.');
      setProcessing(false);
    }
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
                <Loader2 className="h-5 w-5 animate-spin" />
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
