import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, X, Zap, ChevronUp, Sparkles, FileText, Download, Star } from 'lucide-react';
import ResumePremiumGate from './ResumePremiumGate';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumFloatingBannerProps {
  isPremium: boolean;
  downloadCount: number;
  onUpgrade: () => void;
}

const PremiumFloatingBanner = ({ isPremium, downloadCount, onUpgrade }: PremiumFloatingBannerProps) => {
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const features = [
    { icon: FileText, label: 'Unlimited Resumes' },
    { icon: Sparkles, label: 'Advanced AI Tailoring' },
    { icon: Download, label: 'Unlimited Downloads' },
    { icon: Star, label: 'All 7+ Premium Templates' },
  ];

  if (isPremium || dismissed) return null;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg"
        >
          <div className="bg-gradient-to-r from-primary via-purple-500 to-primary p-[1px] rounded-xl shadow-2xl shadow-primary/20">
            <div className="bg-background rounded-xl overflow-hidden">
              {/* Expanded Features Panel */}
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-b border-border/50 bg-muted/30">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Crown className="h-4 w-4 text-amber-500" />
                        Premium Features
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {features.map((feature, idx) => {
                          const Icon = feature.icon;
                          return (
                            <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Icon className="h-3.5 w-3.5 text-primary" />
                              <span>{feature.label}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs">
                        <span className="text-muted-foreground">Starting at <span className="text-foreground font-semibold">₹99</span></span>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20">Money-back guarantee</Badge>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Banner */}
              <div className="p-3 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shrink-0">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Upgrade to Premium</span>
                    <Badge variant="secondary" className="text-xs">50% OFF</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {downloadCount}/2 free downloads • Unlock unlimited resumes
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(!expanded)}
                    className="gap-1 text-xs h-8 px-2"
                  >
                    <ChevronUp className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    {expanded ? 'Less' : 'Features'}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowPremiumGate(true)}
                    className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs h-8"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    Upgrade
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setDismissed(true)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <ResumePremiumGate
        open={showPremiumGate}
        onClose={() => setShowPremiumGate(false)}
        resumeCount={downloadCount}
        onUpgrade={onUpgrade}
      />
    </>
  );
};

export default PremiumFloatingBanner;
