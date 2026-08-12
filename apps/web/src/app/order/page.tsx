"use client";

import { orders } from "@coffee-daily/mocks";
import { Button } from "@coffee-daily/ui/Button";
import { Input } from "@coffee-daily/ui/Input";
import { type FormEvent, useState } from "react";
import { usePageTransition } from "@/motion/PageTransition";
import { Reveal } from "@/motion/Reveal";

export default function OrderLookupPage() {
  const { navigate } = usePageTransition();
  const [receiptNumber, setReceiptNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const normalizedPhone = phone.replace(/\D/g, "");
    const order = orders.find(
      (candidate) =>
        candidate.receiptNumber.toLowerCase() ===
          receiptNumber.trim().toLowerCase() &&
        normalizedPhone.length > 0 &&
        candidate.phone.replace(/\D/g, "").endsWith(normalizedPhone),
    );

    if (!order) {
      setError("No order found for that receipt number and phone.");
      return;
    }

    setError(null);
    navigate(`/order/${order.receiptNumber}`);
  }

  return (
    <>
      <section className="bg-cd-paper-warm px-4 py-16 sm:px-6 lg:px-10">
        <div className="container">
          <p className="mb-6 text-label text-cd-ink-mute">[ Order ]</p>
          <h1 className="mb-6 max-w-2xl text-display-xl text-cd-ink">
            Track your order
          </h1>
          <p className="max-w-2xl text-body-l text-cd-ink-mute">
            Enter the receipt number and the phone number used to place the
            order.
          </p>
        </div>
      </section>

      <section className="bg-cd-paper px-4 py-8 sm:px-6 lg:px-10">
        <Reveal className="container max-w-[720px]">
          <form
            className="flex flex-col gap-4 sm:flex-row"
            onSubmit={handleSubmit}
          >
            <label htmlFor="order-receipt-number" className="flex-1">
              <span className="sr-only">Receipt number</span>
              <Input
                id="order-receipt-number"
                placeholder="Receipt number"
                value={receiptNumber}
                onChange={(event) => setReceiptNumber(event.target.value)}
              />
            </label>
            <label htmlFor="order-phone" className="flex-1">
              <span className="sr-only">Phone number</span>
              <Input
                id="order-phone"
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </label>
            <Button type="submit" className="shrink-0">
              Look up
            </Button>
          </form>
        </Reveal>
        {error ? (
          <p className="container mt-4 max-w-[720px] text-body-s text-cd-danger">
            {error}
          </p>
        ) : null}
      </section>
    </>
  );
}
