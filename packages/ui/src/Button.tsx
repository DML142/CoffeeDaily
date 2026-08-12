import { type VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 text-body-s transition-[background-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cd-orange disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-cd-orange text-cd-cream ring-1 ring-inset ring-transparent hover:bg-cd-cream hover:text-cd-orange hover:ring-cd-orange",
        secondary:
          "border border-cd-ink text-cd-ink hover:bg-cd-ink hover:text-cd-cream",
        ghost: "text-cd-ink hover:text-cd-orange",
        danger:
          "bg-cd-danger text-cd-cream ring-1 ring-inset ring-transparent hover:bg-cd-cream hover:text-cd-danger hover:ring-cd-danger",
      },
      size: {
        sm: "px-3 py-1.5",
        md: "px-4 py-2",
        lg: "px-6 py-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant, size, isLoading, disabled, children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : null}
        {children}
      </button>
    );
  },
);
