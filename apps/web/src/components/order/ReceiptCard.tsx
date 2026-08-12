import { locations } from "@coffee-daily/mocks";
import type { Order } from "@coffee-daily/types";
import { Badge } from "@coffee-daily/ui/Badge";
import { formatMoney } from "@coffee-daily/utils/money";
import { StatusTimeline } from "@/components/order/StatusTimeline";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending_payment: "Pending payment",
  paid: "Paid",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export type ReceiptCardProps = {
  order: Order;
};

export function ReceiptCard({ order }: ReceiptCardProps) {
  const location = locations.find(
    (candidate) => candidate.id === order.locationId,
  );

  return (
    <div className="container max-w-[720px] bg-cd-paper-warm p-6 sm:p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <p className="mb-2 text-label text-cd-ink-mute">
            Receipt {order.receiptNumber}
          </p>
          <p className="text-display-m">{location?.name ?? "Location"}</p>
        </div>
        <Badge tone="orange">{STATUS_LABELS[order.status]}</Badge>
      </div>

      <div className="mb-8">
        <p className="mb-4 text-label text-cd-ink-mute">Status</p>
        <StatusTimeline status={order.status} />
      </div>

      <div className="mb-8 flex flex-col divide-y divide-cd-line">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-3">
            <div className="h-16 w-16 shrink-0 bg-cd-line" />
            <div className="flex-1">
              <p className="mb-1 text-body">{item.productName}</p>
              <p className="text-body-s text-cd-ink-mute">
                {item.vessel}, {item.size}, ×{item.quantity}
              </p>
            </div>
            <p className="font-mono text-body-s">
              {formatMoney(item.unitPriceMinor * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 flex items-center justify-between border-t border-cd-line pt-4">
        <p className="text-body">Total</p>
        <p className="font-mono text-display-m">
          {formatMoney(order.totalMinor)}
        </p>
      </div>

      <button
        type="button"
        disabled
        className="inline-block border border-cd-ink px-6 py-3 text-body-s disabled:cursor-not-allowed disabled:opacity-50"
        title="Receipt PDFs ship with the backend in phase 4"
      >
        Download receipt PDF
      </button>
    </div>
  );
}
