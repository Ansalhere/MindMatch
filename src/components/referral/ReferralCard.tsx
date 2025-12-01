import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gift, Share2, Users, Crown, Copy, Check, Flame, Calendar } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { SocialShareButtons } from './SocialShareButtons';

export const ReferralCard = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [referralRewards, setReferralRewards] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchReferralData();
    }
  }, [user?.id]);

  const fetchReferralData = async () => {
    try {
      // Get user's referral code
      const { data: existingCode } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_id', user?.id)
        .limit(1)
        .maybeSingle();

      if (existingCode) {
        setReferralCode(existingCode.referral_code);
      } else {
        // Generate new code if doesn't exist
        const { data: newCode } = await supabase.rpc('generate_referral_code');
        setReferralCode(newCode || '');
      }

      // Get referral rewards
      const { data: rewards } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      setReferralRewards(rewards || { referral_points: 0, total_referrals: 0, premium_unlocked: false });
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast({ title: 'Link copied!', description: 'Share it with your friends' });
    setTimeout(() => setCopied(false), 2000);
  };

  const sendReferral = async () => {
    if (!email || !user?.id) return;
    
    setSending(true);
    try {
      const { error } = await supabase.from('referrals').insert({
        referrer_id: user.id,
        referred_email: email,
        referral_code: referralCode,
        status: 'pending'
      });

      if (error) throw error;

      toast({ 
        title: 'Referral sent!', 
        description: `We'll notify you when ${email} signs up` 
      });
      setEmail('');
      fetchReferralData();
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to send referral',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) return null;

  const progressToFree = Math.min((referralRewards?.total_referrals || 0) / 3, 1) * 100;
  const premiumUnlocked = referralRewards?.premium_unlocked || referralRewards?.total_referrals >= 3;

  return (
    <Card className="border-primary/20 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Referral Program</CardTitle>
                <CardDescription>Get 3 referrals, unlock Premium FREE!</CardDescription>
              </div>
            </div>
            {premiumUnlocked && (
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Premium Unlocked
              </Badge>
            )}
          </div>
        </CardHeader>
      </div>

      <CardContent className="pt-6 space-y-6">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your Progress</span>
            <span className="font-semibold">
              {referralRewards?.total_referrals || 0} / 3 Referrals
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
              style={{ width: `${progressToFree}%` }}
            />
          </div>
          {!premiumUnlocked && (
            <p className="text-sm text-muted-foreground">
              {3 - (referralRewards?.total_referrals || 0)} more {3 - (referralRewards?.total_referrals || 0) === 1 ? 'referral' : 'referrals'} to unlock Premium features!
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-muted/50 border">
            <Users className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{referralRewards?.total_referrals || 0}</p>
            <p className="text-sm text-muted-foreground">Total Referrals</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border">
            <Gift className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{referralRewards?.referral_points || 0}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border">
            <Flame className="h-5 w-5 text-orange-500 mb-2" />
            <p className="text-2xl font-bold">{referralRewards?.login_streak || 0}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border">
            <Calendar className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-bold">{referralRewards?.daily_login_points || 0}</p>
            <p className="text-sm text-muted-foreground">Login Points</p>
          </div>
        </div>

        {/* Share Section */}
        <div className="space-y-3">
          <p className="font-medium">Share Your Referral Link</p>
          <div className="flex gap-2 mb-3">
            <Input 
              readOnly 
              value={`${window.location.origin}/register?ref=${referralCode}`}
              className="font-mono text-sm"
            />
            <Button onClick={copyReferralLink} variant="outline" size="icon">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <SocialShareButtons referralLink={`${window.location.origin}/register?ref=${referralCode}`} />
        </div>

        {/* Invite by Email */}
        <div className="space-y-3">
          <p className="font-medium">Invite via Email</p>
          <div className="flex gap-2">
            <Input 
              type="email"
              placeholder="friend@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={sendReferral} disabled={sending || !email}>
              <Share2 className="h-4 w-4 mr-2" />
              {sending ? 'Sending...' : 'Invite'}
            </Button>
          </div>
        </div>

        {/* Daily Login Info */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Daily Login Rewards
          </p>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-4">
            <li>• Earn 1 point for logging in daily</li>
            <li>• Build your streak for bonus points</li>
            <li>• Every 7-day streak earns extra points!</li>
          </ul>
        </div>

        {/* Premium Features Preview */}
        {!premiumUnlocked && (
          <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
              🎁 Premium Features Waiting for You:
            </p>
            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 ml-4">
              <li>• Advanced Resume Builder with AI</li>
              <li>• Priority Job Recommendations</li>
              <li>• Unlimited Applications</li>
              <li>• Enhanced Profile Visibility</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
