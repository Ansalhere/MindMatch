import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const SubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      // Insert email into newsletter_subscriptions table
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email: email.trim() }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('This email is already subscribed!');
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        toast.success('Successfully subscribed to our newsletter!');
        setEmail('');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Thank you!</h3>
            <p className="text-muted-foreground">
              You've been subscribed to our newsletter. We'll keep you updated with the latest features and career opportunities.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-center">
          <Mail className="h-5 w-5 mr-2" />
          Stay Updated
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Get updates on new features, job opportunities, and career tips.
        </p>
      </CardContent>
    </Card>
  );
};

export default SubscriptionForm;