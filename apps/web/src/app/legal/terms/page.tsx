import type { Metadata } from "next";
import { Reveal } from "@/motion/Reveal";

export const metadata: Metadata = {
  title: "Terms — Coffee Daily",
};

export default function TermsPage() {
  return (
    <section className="bg-cd-paper px-4 py-16 sm:px-6 lg:px-10">
      <Reveal className="container max-w-[720px]">
        <p className="mb-6 text-label text-cd-ink-mute">[ Terms ]</p>
        <h1 className="mb-10 text-display-l text-cd-ink">Terms of service</h1>

        <div className="flex flex-col gap-8 text-body text-cd-ink-mute">
          <p>
            These terms cover ordering ahead for pickup at a Coffee Daily
            location.
          </p>

          <div>
            <p className="mb-2 text-body text-cd-ink">Orders and pickup</p>
            <p>
              Orders belong to the location you select at checkout. Pickup times
              are estimates, not guarantees. Bring your receipt number to
              collect your order.
            </p>
          </div>

          <div>
            <p className="mb-2 text-body text-cd-ink">Payment</p>
            <p>
              Payment is due at checkout. Prices reflect the selected
              location&apos;s stock and may differ between locations.
            </p>
          </div>

          <div>
            <p className="mb-2 text-body text-cd-ink">Contact</p>
            <p>
              Questions about an order go to the location where it was placed.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
