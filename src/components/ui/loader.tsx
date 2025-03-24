
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export const Loader = ({ 
  className, 
  size = 24,
  ...props 
}: LoaderProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" style={{ height: size, width: size }} />
    </div>
  );
};
