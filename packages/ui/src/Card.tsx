import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

const cardVariants = cva("rounded-lg", {
  variants: {
    tone: {
      paper: "bg-cd-paper-warm",
      ink: "bg-cd-ink text-cd-cream",
      outline: "border border-cd-line",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-6 sm:p-8",
    },
  },
  defaultVariants: {
    tone: "paper",
    padding: "md",
  },
});

export type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants>;

export function Card({ className, tone, padding, ...props }: CardProps) {
  return (
    <div
      className={cn(cardVariants({ tone, padding }), className)}
      {...props}
    />
  );
}
