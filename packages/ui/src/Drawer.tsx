import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  side?: "left" | "right";
  children: ReactNode;
  className?: string;
};

export function Drawer({
  open,
  onOpenChange,
  title,
  side = "right",
  children,
  className,
}: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-cd-ink/60",
            "motion-safe:data-[state=open]:animate-[drawer-overlay-fade-in_400ms_ease-in-out]",
            "motion-safe:data-[state=closed]:animate-[drawer-overlay-fade-out_400ms_ease-in-out]",
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed top-0 z-50 h-full w-full max-w-xs bg-cd-paper-warm p-6 focus:outline-none",
            side === "right"
              ? "right-0 motion-safe:data-[state=open]:animate-[drawer-slide-in-right_400ms_ease-in-out] motion-safe:data-[state=closed]:animate-[drawer-slide-out-right_400ms_ease-in-out]"
              : "left-0 motion-safe:data-[state=open]:animate-[drawer-slide-in-left_400ms_ease-in-out] motion-safe:data-[state=closed]:animate-[drawer-slide-out-left_400ms_ease-in-out]",
            className,
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-display-m">{title}</Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="text-body-s text-cd-ink-mute hover:text-cd-ink"
            >
              ✕
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
