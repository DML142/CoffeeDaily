import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, hasError, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full border border-cd-line bg-cd-paper-warm px-4 py-3 text-body-s text-cd-ink placeholder:text-cd-ink-mute focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cd-orange disabled:cursor-not-allowed disabled:opacity-50",
        hasError && "border-cd-danger",
        className,
      )}
      aria-invalid={hasError}
      data-cursor="text"
      {...props}
    />
  );
});
