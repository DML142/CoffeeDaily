import type { OrderStatus } from "@coffee-daily/types";
import { cn } from "@coffee-daily/ui/lib/cn";

const HAPPY_PATH_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "paid", label: "Paid" },
  { status: "accepted", label: "Accepted" },
  { status: "preparing", label: "Preparing" },
  { status: "ready", label: "Ready" },
  { status: "completed", label: "Completed" },
];

export type StatusTimelineProps = {
  status: OrderStatus;
};

export function StatusTimeline({ status }: StatusTimelineProps) {
  const currentIndex = HAPPY_PATH_STEPS.findIndex(
    (step) => step.status === status,
  );

  return (
    <ol className="flex flex-wrap items-center gap-2">
      {HAPPY_PATH_STEPS.map((step, index) => (
        <li key={step.status} className="flex items-center gap-2">
          {index > 0 ? (
            <span className="text-body-s text-cd-line">→</span>
          ) : null}
          <span
            className={cn(
              "text-body-s",
              index === currentIndex && "font-bold text-cd-orange",
              index < currentIndex && "text-cd-ink",
              index > currentIndex && "text-cd-ink-mute",
            )}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
