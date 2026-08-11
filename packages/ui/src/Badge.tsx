import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../lib/cn";

const badgeVariants = cva("inline-block rounded-full px-3 py-1 text-label", {
  variants: {
    tone: {
      neutral: "border border-cd-line text-cd-ink",
      success: "bg-cd-success/10 text-cd-success",
      danger: "bg-cd-danger/10 text-cd-danger",
      orange: "bg-cd-orange/10 text-cd-orange",
    },
  },
  defaultVariants: {
    tone: "neutral",
  },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
