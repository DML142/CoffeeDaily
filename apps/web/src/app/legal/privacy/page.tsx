import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy — Coffee Daily",
};

export default function PrivacyPage() {
  return (
    <section className="bg-cd-paper px-4 py-16 sm:px-6 lg:px-10">
      <div className="container max-w-[720px]">
        <p className="mb-6 text-label text-cd-ink-mute">[ Privacy ]</p>
        <h1 className="mb-10 text-display-l text-cd-ink">Privacy policy</h1>

        <div className="flex flex-col gap-8 text-body text-cd-ink-mute">
          <p>
            This policy covers what Coffee Daily collects when you browse the
            site, place an order for pickup, or contact a location.
          </p>

          <div>
            <p className="mb-2 text-body text-cd-ink">What we collect</p>
            <p>
              Order details you enter at checkout — name, phone number, email,
              and pickup preferences — along with basic usage data needed to run
              the site and keep it secure.
            </p>
          </div>

          <div>
            <p className="mb-2 text-body text-cd-ink">How we use it</p>
            <p>
              To take your order, contact you about it, and track order status.
              We do not sell your information.
            </p>
          </div>

          <div>
            <p className="mb-2 text-body text-cd-ink">Contact</p>
            <p>
              Questions about this policy go to the location where you placed
              your order.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
