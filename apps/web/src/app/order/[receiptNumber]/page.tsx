import { orders } from "@coffee-daily/mocks";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReceiptCard } from "@/components/order/ReceiptCard";
import { Reveal } from "@/motion/Reveal";

type OrderPageParams = {
  params: Promise<{ receiptNumber: string }>;
};

export function generateStaticParams() {
  return orders.map((order) => ({ receiptNumber: order.receiptNumber }));
}

export async function generateMetadata({
  params,
}: OrderPageParams): Promise<Metadata> {
  const { receiptNumber } = await params;
  return { title: `Order ${receiptNumber} — Coffee Daily` };
}

export default async function OrderDetailPage({ params }: OrderPageParams) {
  const { receiptNumber } = await params;
  const order = orders.find(
    (candidate) => candidate.receiptNumber === receiptNumber,
  );

  if (!order) {
    notFound();
  }

  return (
    <section className="bg-cd-paper px-4 py-16 sm:px-6 lg:px-10">
      <Reveal>
        <ReceiptCard order={order} />
      </Reveal>
    </section>
  );
}
