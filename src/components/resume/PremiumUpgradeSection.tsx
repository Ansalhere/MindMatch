import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Download,
  Zap,
  Star,
  ArrowRight
} from 'lucide-react';
import ResumePremiumGate from './ResumePremiumGate';

interface PremiumUpgradeSectionProps {
  isPremium: boolean;
  downloadCount: number;
  onUpgrade: () => void;
}

const PremiumUpgradeSection = ({ isPremium, downloadCount, onUpgrade }: PremiumUpgradeSectionProps) => {
  const [showPremiumGate, setShowPremiumGate] = useState(false);

const features = [
    { icon: FileText, label: 'Unlimited Resumes', free: '2 free', premium: 'Unlimited' },
    { icon: Sparkles, label: 'AI Tailoring', free: 'Basic', premium: 'Advanced AI' },
    { icon: Download, label: 'Downloads', free: '2/month', premium: 'Unlimited' },
    { icon: Star, label: 'Premium Templates', free: '4 templates', premium: 'All 7+' },
  ];

  if (isPremium) {
    return (
      <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                Premium Active
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">PRO</Badge>
              </h3>
              <p className="text-sm text-muted-foreground">
                Enjoy unlimited resumes and all premium features
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden border-2 border-primary/20">
        <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-purple-500 rounded-lg">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground">
                  {downloadCount}/2 free downloads used
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setShowPremiumGate(true)}
              className="gap-2 bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
            >
              <Zap className="h-4 w-4" />
              Upgrade
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-3 rounded-lg bg-muted/50">
                  <Icon className="h-5 w-5 mx-auto mb-2 text-primary" />
                  <p className="text-xs font-medium">{feature.label}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs text-muted-foreground line-through">{feature.free}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-primary font-medium">{feature.premium}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              Starting at ₹99
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              Money-back guarantee
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              Instant access
            </div>
          </div>
        </CardContent>
      </Card>

      <ResumePremiumGate
        open={showPremiumGate}
        onClose={() => setShowPremiumGate(false)}
        resumeCount={downloadCount}
        onUpgrade={onUpgrade}
      />
    </>
  );
};

export default PremiumUpgradeSection;