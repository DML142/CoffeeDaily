import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  hasError?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, hasError, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full border border-cd-line bg-cd-paper-warm px-4 py-3 text-body-s text-cd-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cd-orange disabled:cursor-not-allowed disabled:opacity-50",
          hasError && "border-cd-danger",
          className,
        )}
        aria-invalid={hasError}
        {...props}
      >
        {children}
      </select>
    );
  },
);
