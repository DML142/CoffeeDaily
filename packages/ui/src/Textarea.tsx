import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  hasError?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, hasError, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full border border-cd-line bg-cd-paper-warm px-4 py-3 text-body-s text-cd-ink placeholder:text-cd-ink-mute focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cd-orange disabled:cursor-not-allowed disabled:opacity-50",
          hasError && "border-cd-danger",
          className,
        )}
        aria-invalid={hasError}
        {...props}
      />
    );
  },
);
