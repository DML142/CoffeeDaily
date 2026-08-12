import * as RadixSelect from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
  id?: string;
  name?: string;
  "aria-label"?: string;
};

export function Select({
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  hasError,
  className,
  id,
  name,
  ...ariaProps
}: SelectProps) {
  return (
    <RadixSelect.Root
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
    >
      <RadixSelect.Trigger
        id={id}
        aria-invalid={hasError}
        className={cn(
          "flex w-full items-center justify-between gap-2 border border-cd-line bg-cd-paper-warm px-4 py-3 text-body-s text-cd-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cd-orange disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-cd-ink-mute",
          hasError && "border-cd-danger",
          className,
        )}
        {...ariaProps}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown className="h-4 w-4 shrink-0 text-cd-ink-mute" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className="z-50 max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)] overflow-hidden border border-cd-line bg-cd-paper-warm text-body-s text-cd-ink shadow-lg"
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className="flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2 outline-none data-[highlighted]:bg-cd-ink data-[highlighted]:text-cd-cream"
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator>
                  <Check className="h-4 w-4" />
                </RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
