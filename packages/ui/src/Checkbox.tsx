import { Check } from "lucide-react";
import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

export type CheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: ReactNode;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ className, label, disabled, ...props }, ref) {
    return (
      <label
        className={cn(
          "inline-flex items-center gap-2 text-body-s text-cd-ink",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className,
        )}
      >
        <span className="relative inline-flex h-5 w-5 shrink-0">
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            className="peer absolute inset-0 z-10 h-full w-full cursor-[inherit] appearance-none"
            {...props}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 border border-cd-line bg-cd-paper-warm peer-checked:border-cd-ink peer-checked:bg-cd-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cd-orange"
          />
          <Check
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 text-cd-cream opacity-0 peer-checked:opacity-100"
          />
        </span>
        {label}
      </label>
    );
  },
);
