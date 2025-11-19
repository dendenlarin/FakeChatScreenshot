import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:shadow-lg active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary/80 text-primary-foreground hover:bg-primary border border-primary/50 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]",
        destructive: "bg-destructive/80 text-destructive-foreground hover:bg-destructive border border-destructive/50 shadow-[0_0_15px_rgba(255,0,110,0.3)] hover:shadow-[0_0_25px_rgba(255,0,110,0.5)]",
        outline: "border-2 border-primary/50 bg-transparent hover:bg-primary/10 text-foreground hover:border-primary shadow-[0_0_10px_rgba(0,240,255,0.2)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]",
        secondary: "bg-secondary/80 text-secondary-foreground hover:bg-secondary border border-secondary/50 shadow-[0_0_15px_rgba(176,38,255,0.3)] hover:shadow-[0_0_25px_rgba(176,38,255,0.5)]",
        ghost: "hover:bg-accent/20 hover:text-accent-foreground border border-transparent hover:border-accent/30",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
