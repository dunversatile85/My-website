import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin rounded-full border-b-2 border-t-2",
  {
    variants: {
      size: {
        default: "h-8 w-8",
        sm: "h-4 w-4",
        lg: "h-16 w-16",
      },
      color: {
        primary: "border-primary-foreground",
        current: "border-current",
      },
    },
    defaultVariants: {
      size: "default",
      color: "current",
    },
  }
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export function Spinner({ size, color, className }: SpinnerProps) {
  return <div className={cn(spinnerVariants({ size, color }), className)} />;
}
