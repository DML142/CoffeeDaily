import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type ModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-cd-ink/60" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-cd-paper-warm p-6 focus:outline-none sm:p-8",
            className,
          )}
        >
          <Dialog.Title className="text-display-m mb-2">{title}</Dialog.Title>
          {description ? (
            <Dialog.Description className="mb-6 text-body-s text-cd-ink-mute">
              {description}
            </Dialog.Description>
          ) : null}
          {children}
          <Dialog.Close
            aria-label="Close"
            className="absolute right-4 top-4 text-body-s text-cd-ink-mute hover:text-cd-ink"
          >
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
