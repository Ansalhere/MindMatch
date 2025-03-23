
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Briefcase, User, Search, Building, Star, Trophy, Eye } from "lucide-react";
import { toast } from "sonner";

const Packages = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'candidate' | 'employer'>('candidate');
  
  const handlePurchase = (plan: string) => {
    toast.success(`${plan} plan selected! This feature will be available soon.`);
  };
  
  return (
    <div className="container mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Subscription Packages</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the right plan to enhance your experience on FresherPools. All features are 
          currently free during our beta period!
        </p>
      </div>
      
      <Tabs defaultValue="candidate" className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="candidate" onClick={() => setUserType('candidate')}>
            <User className="mr-2 h-4 w-4" />
            For Candidates
          </TabsTrigger>
          <TabsTrigger value="employer" onClick={() => setUserType('employer')}>
            <Building className="mr-2 h-4 w-4" />
            For Employers
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="candidate" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              title="Free"
              description="Get started with basic features"
              price="$0"
              period="forever"
              ctaText="Current Plan"
              ctaAction={() => {}}
              ctaDisabled={true}
              highlighted={false}
              features={[
                { text: "Create profile", included: true },
                { text: "Apply to jobs", included: true },
                { text: "Basic ranking", included: true },
                { text: "3 skill assessments per month", included: true },
                { text: "Standard visibility to employers", included: true },
                { text: "Basic analytics", included: true },
                { text: "Profile promotion", included: false },
                { text: "Priority ranking consideration", included: false },
                { text: "Unlimited skill assessments", included: false },
              ]}
            />
            
            <PricingCard
              title="Pro"
              description="Boost your visibility and ranking"
              price="$9.99"
              period="per month"
              ctaText="Get Started"
              ctaAction={() => handlePurchase('Pro')}
              ctaDisabled={false}
              highlighted={true}
              badge="Popular"
              features={[
                { text: "All Free features", included: true },
                { text: "Highlighted profile", included: true },
                { text: "10 skill assessments per month", included: true },
                { text: "Enhanced visibility to employers", included: true },
                { text: "Detailed performance analytics", included: true },
                { text: "Job match recommendations", included: true },
                { text: "One profile promotion per month", included: true },
                { text: "Priority ranking updates", included: true },
                { text: "Unlimited skill assessments", included: false },
              ]}
            />
            
            <PricingCard
              title="Premium"
              description="Maximum career advancement potential"
              price="$24.99"
              period="per month"
              ctaText="Get Started"
              ctaAction={() => handlePurchase('Premium')}
              ctaDisabled={false}
              highlighted={false}
              badge="Best Value"
              features={[
                { text: "All Pro features", included: true },
                { text: "Featured profile placement", included: true },
                { text: "Unlimited skill assessments", included: true },
                { text: "Maximum visibility to employers", included: true },
                { text: "Advanced performance analytics", included: true },
                { text: "Priority job matches", included: true },
                { text: "Three profile promotions per month", included: true },
                { text: "Priority ranking consideration", included: true },
                { text: "Early access to new features", included: true },
              ]}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="employer" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingCard
              title="Starter"
              description="Essentials for small businesses"
              price="$0"
              period="forever"
              ctaText="Current Plan"
              ctaAction={() => {}}
              ctaDisabled={true}
              highlighted={false}
              features={[
                { text: "Company profile", included: true },
                { text: "Post up to 3 jobs", included: true },
                { text: "View 20 candidate profiles", included: true },
                { text: "Basic candidate filtering", included: true },
                { text: "Access to top 1000 ranked candidates", included: true },
                { text: "Rank-based job restrictions", included: false },
                { text: "Advanced candidate comparison", included: false },
                { text: "Featured job postings", included: false },
                { text: "Unlimited candidate views", included: false },
              ]}
            />
            
            <PricingCard
              title="Business"
              description="Perfect for growing companies"
              price="$49.99"
              period="per month"
              ctaText="Get Started"
              ctaAction={() => handlePurchase('Business')}
              ctaDisabled={false}
              highlighted={true}
              badge="Most Popular"
              features={[
                { text: "All Starter features", included: true },
                { text: "Post up to 10 jobs", included: true },
                { text: "View 100 candidate profiles", included: true },
                { text: "Advanced candidate filtering", included: true },
                { text: "Access to top 500 ranked candidates", included: true },
                { text: "Rank-based job restrictions", included: true },
                { text: "Basic candidate comparison", included: true },
                { text: "One featured job posting", included: true },
                { text: "Unlimited candidate views", included: false },
              ]}
            />
            
            <PricingCard
              title="Enterprise"
              description="Full access for talent acquisition"
              price="$99.99"
              period="per month"
              ctaText="Get Started"
              ctaAction={() => handlePurchase('Enterprise')}
              ctaDisabled={false}
              highlighted={false}
              badge="Unlimited Access"
              features={[
                { text: "All Business features", included: true },
                { text: "Unlimited job postings", included: true },
                { text: "Unlimited candidate views", included: true },
                { text: "Premium candidate filtering", included: true },
                { text: "Access to all ranked candidates", included: true },
                { text: "Advanced rank-based restrictions", included: true },
                { text: "Advanced candidate comparison", included: true },
                { text: "Three featured job postings", included: true },
                { text: "Dedicated account manager", included: true },
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="text-center mt-12">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  ctaText: string;
  ctaAction: () => void;
  ctaDisabled: boolean;
  highlighted: boolean;
  badge?: string;
  features: {
    text: string;
    included: boolean;
  }[];
}

const PricingCard = ({
  title,
  description,
  price,
  period,
  ctaText,
  ctaAction,
  ctaDisabled,
  highlighted,
  badge,
  features
}: PricingCardProps) => {
  return (
    <Card className={`border ${highlighted ? 'border-primary shadow-lg' : ''}`}>
      <CardHeader>
        {badge && (
          <Badge className="self-start mb-2">
            {badge === "Popular" || badge === "Most Popular" ? (
              <Crown className="h-3 w-3 mr-1" />
            ) : (
              <Star className="h-3 w-3 mr-1" />
            )}
            {badge}
          </Badge>
        )}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground"> {period}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <Check className="h-5 w-5 text-primary mr-2 shrink-0" />
              ) : (
                <X className="h-5 w-5 text-muted-foreground mr-2 shrink-0" />
              )}
              <span className={!feature.included ? "text-muted-foreground" : ""}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={ctaAction}
          disabled={ctaDisabled}
          className="w-full"
          variant={highlighted ? "default" : "outline"}
        >
          {ctaText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Packages;
