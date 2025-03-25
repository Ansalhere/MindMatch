
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronUp, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatCardProps {
  title: string;
  value: string | number;
  secondaryText?: string;
  icon?: ReactNode;
  progress?: number;
  bgColor?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  tooltip?: string;
}

const StatCard = ({
  title,
  value,
  secondaryText,
  icon,
  progress,
  bgColor = "bg-primary/5",
  buttonText,
  onButtonClick,
  tooltip,
}: StatCardProps) => {
  return (
    <Card className={bgColor}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {tooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground/70" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end mb-2">
          <span className="text-2xl font-bold">{value}</span>
          {secondaryText && (
            <div className="text-xs flex items-center">
              {icon || <ChevronUp className="h-4 w-4 mr-1" />}
              <span>{secondaryText}</span>
            </div>
          )}
          {buttonText && onButtonClick && (
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onButtonClick}>
              {buttonText}
            </Button>
          )}
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="h-2" />
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
