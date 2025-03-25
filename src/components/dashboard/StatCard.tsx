
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface StatCardProps {
  title: string;
  value: string | number;
  secondaryText?: string;
  icon?: ReactNode;
  progress?: number;
  bgColor?: string;
  buttonText?: string;
  onButtonClick?: () => void;
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
}: StatCardProps) => {
  return (
    <Card className={bgColor}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
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
