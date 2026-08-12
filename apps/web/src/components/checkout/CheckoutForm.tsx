"use client";

import { products } from "@coffee-daily/mocks";
import type { Location } from "@coffee-daily/types";
import { Button } from "@coffee-daily/ui/Button";
import { Input } from "@coffee-daily/ui/Input";
import { Select } from "@coffee-daily/ui/Select";
import { Textarea } from "@coffee-daily/ui/Textarea";
import { formatMoney } from "@coffee-daily/utils/money";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Reveal } from "@/motion/Reveal";
import { useCartStore } from "@/stores/useCartStore";

const PICKUP_SLOTS = [
  "Today, 3:00 PM",
  "Today, 3:15 PM",
  "Today, 3:30 PM",
  "Today, 3:45 PM",
];

const checkoutSchema = z
  .object({
    countryCode: z.literal("+1"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .refine(
        (value) => /^\d{10}$/.test(value.replace(/\D/g, "")),
        "Enter a valid 10-digit phone number",
      ),
    name: z.string().min(1, "Full name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    pickupTime: z.enum(["asap", "slot"]),
    pickupSlot: z.string().optional(),
    notes: z.string().max(500, "500 characters max").optional(),
  })
  .refine((data) => data.pickupTime !== "slot" || Boolean(data.pickupSlot), {
    message: "Pick a time slot",
    path: ["pickupSlot"],
  });

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function generateReceiptNumber() {
  return `CD-${Math.floor(10000 + Math.random() * 90000)}`;
}

export type CheckoutFormProps = {
  location: Location;
};

export function CheckoutForm({ location }: CheckoutFormProps) {
  const allLines = useCartStore((state) => state.lines);
  const lines = useMemo(
    () => allLines.filter((line) => line.locationId === location.id),
    [allLines, location.id],
  );
  const clearLocation = useCartStore((state) => state.clearLocation);
  const [receipt, setReceipt] = useState<{
    number: string;
    totalMinor: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { countryCode: "+1", pickupTime: "asap" },
  });

  const pickupTime = watch("pickupTime");
  const subtotalMinor = lines.reduce(
    (sum, line) => sum + line.unitPriceMinor * line.quantity,
    0,
  );

  function onSubmit() {
    const receiptNumber = generateReceiptNumber();
    clearLocation(location.id);
    setReceipt({ number: receiptNumber, totalMinor: subtotalMinor });
  }

  if (receipt) {
    return (
      <section className="bg-cd-paper px-4 pb-16 sm:px-6 lg:px-10">
        <div className="container max-w-[720px] bg-cd-paper-warm p-6 sm:p-8">
          <p className="mb-2 text-label text-cd-ink-mute">
            Receipt {receipt.number}
          </p>
          <p className="mb-6 text-display-l">Order confirmed</p>
          <p className="mb-8 text-body text-cd-ink-mute">
            Paid {formatMoney(receipt.totalMinor)} at {location.name}. Track it
            any time with your receipt number and phone.
          </p>
          <Link
            href={`/order/${receipt.number}`}
            className="inline-block border border-cd-ink px-6 py-3 text-body-s"
          >
            Track this order
          </Link>
        </div>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="bg-cd-paper px-4 pb-16 sm:px-6 lg:px-10">
        <div className="container">
          <p className="text-body text-cd-ink-mute">
            Nothing to check out for this location.{" "}
            <Link href="/cart" className="underline">
              Back to cart
            </Link>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cd-paper px-4 pb-16 sm:px-6 lg:px-10">
      <Reveal>
        <form
          className="mx-auto flex max-w-[720px] flex-col gap-8"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="bg-cd-paper-warm p-6 sm:p-8">
            <p className="mb-6 text-label text-cd-ink-mute">
              [ 1. Order review ]
            </p>
            <div className="flex flex-col divide-y divide-cd-line">
              {lines.map((line) => {
                const product = products.find(
                  (candidate) => candidate.id === line.productId,
                );
                return (
                  <div key={line.id} className="flex items-center gap-4 py-3">
                    <div className="h-16 w-16 shrink-0 bg-cd-line" />
                    <div className="flex-1">
                      <p className="mb-1 text-body">
                        {product?.name ?? "Item"}
                      </p>
                      <p className="text-body-s text-cd-ink-mute">
                        {line.vessel}, {line.size}, ×{line.quantity}
                      </p>
                    </div>
                    <p className="font-mono text-body-s">
                      {formatMoney(line.unitPriceMinor * line.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-cd-line pt-4">
              <p className="text-body">Subtotal</p>
              <p className="font-mono text-display-m">
                {formatMoney(subtotalMinor)}
              </p>
            </div>
          </div>

          <div className="bg-cd-paper-warm p-6 sm:p-8">
            <p className="mb-6 text-label text-cd-ink-mute">
              [ 2. Pickup location ]
            </p>
            <p className="mb-2 text-display-m">{location.name}</p>
            <p className="text-body-s text-cd-ink-mute">{location.address}</p>
          </div>

          <div className="bg-cd-paper-warm p-6 sm:p-8">
            <p className="mb-6 text-label text-cd-ink-mute">[ 3. Contact ]</p>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <label htmlFor="checkout-country-code" className="w-28">
                  <span className="sr-only">Country code</span>
                  <Select
                    id="checkout-country-code"
                    {...register("countryCode")}
                  >
                    <option value="+1">US +1</option>
                  </Select>
                </label>
                <label htmlFor="checkout-phone" className="flex-1">
                  <span className="sr-only">Phone number</span>
                  <Input
                    id="checkout-phone"
                    type="tel"
                    placeholder="Phone number"
                    hasError={Boolean(errors.phone)}
                    {...register("phone")}
                  />
                </label>
              </div>
              {errors.phone ? (
                <p className="text-body-s text-cd-danger">
                  {errors.phone.message}
                </p>
              ) : null}

              <label htmlFor="checkout-name">
                <span className="sr-only">Full name</span>
                <Input
                  id="checkout-name"
                  type="text"
                  placeholder="Full name"
                  hasError={Boolean(errors.name)}
                  {...register("name")}
                />
              </label>
              {errors.name ? (
                <p className="text-body-s text-cd-danger">
                  {errors.name.message}
                </p>
              ) : null}

              <label htmlFor="checkout-email">
                <span className="sr-only">Email</span>
                <Input
                  id="checkout-email"
                  type="email"
                  placeholder="Email"
                  hasError={Boolean(errors.email)}
                  {...register("email")}
                />
              </label>
              {errors.email ? (
                <p className="text-body-s text-cd-danger">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="bg-cd-paper-warm p-6 sm:p-8">
            <p className="mb-6 text-label text-cd-ink-mute">
              [ 4. Pickup time ]
            </p>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 border border-cd-line px-4 py-3 text-body-s">
                <input type="radio" value="asap" {...register("pickupTime")} />
                ASAP
              </label>
              <label className="flex flex-wrap items-center gap-3 border border-cd-line px-4 py-3 text-body-s">
                <input type="radio" value="slot" {...register("pickupTime")} />
                Pick a time
                <Select
                  className="sm:ml-auto sm:w-auto"
                  disabled={pickupTime !== "slot"}
                  {...register("pickupSlot")}
                >
                  {PICKUP_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Select>
              </label>
              {errors.pickupSlot ? (
                <p className="text-body-s text-cd-danger">
                  {errors.pickupSlot.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="bg-cd-paper-warm p-6 sm:p-8">
            <p className="mb-2 text-label text-cd-ink-mute">
              [ 5. Params file ]
            </p>
            <p className="mb-6 text-body-s text-cd-ink-mute">
              Upload a PDF or TXT to prefill fields. Optional.
            </p>
            <input
              type="file"
              accept=".pdf,.txt"
              className="w-full text-body-s"
            />
          </div>

          <div className="bg-cd-paper-warm p-6 sm:p-8">
            <p className="mb-6 text-label text-cd-ink-mute">[ 6. Notes ]</p>
            <Textarea
              rows={4}
              maxLength={500}
              placeholder="Anything we should know? (optional)"
              {...register("notes")}
            />
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Pay {formatMoney(subtotalMinor)}
          </Button>
        </form>
      </Reveal>
    </section>
  );
}
