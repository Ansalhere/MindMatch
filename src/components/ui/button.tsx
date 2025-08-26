
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transform hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl font-bold border border-primary/20 relative overflow-hidden",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground hover:from-destructive/90 hover:to-destructive/80 shadow-lg hover:shadow-xl font-bold border border-destructive/20",
        outline:
          "border-2 border-primary bg-background hover:bg-primary/10 hover:border-primary text-primary font-bold shadow-md hover:shadow-lg backdrop-blur-sm",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/80 shadow-md hover:shadow-lg font-bold border border-secondary/20",
        ghost: "hover:bg-accent/60 hover:text-accent-foreground font-semibold backdrop-blur-sm rounded-lg",
        link: "text-primary underline-offset-4 hover:underline font-semibold hover:text-primary/80",
        premium: "bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-xl hover:shadow-2xl font-bold border border-amber-400/30",
        success: "bg-gradient-to-r from-emerald-500 via-green-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg hover:shadow-xl font-bold border border-emerald-400/30",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 rounded-lg px-6 text-sm",
        lg: "h-16 rounded-2xl px-12 py-4 text-lg font-extrabold",
        icon: "h-12 w-12",
        xs: "h-8 px-3 text-xs rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
