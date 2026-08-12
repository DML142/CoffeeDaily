import { locations } from "@coffee-daily/mocks";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

type CheckoutPageParams = {
  params: Promise<{ locationId: string }>;
};

export function generateStaticParams() {
  return locations.map((location) => ({ locationId: location.id }));
}

export default async function CheckoutPage({ params }: CheckoutPageParams) {
  const { locationId } = await params;
  const location = locations.find((candidate) => candidate.id === locationId);

  if (!location) {
    notFound();
  }

  return (
    <>
      <section className="bg-cd-paper-warm px-4 py-16 sm:px-6 lg:px-10">
        <div className="container">
          <p className="mb-6 text-label text-cd-ink-mute">[ Checkout ]</p>
          <h1 className="mb-4 text-display-xl text-cd-ink">{location.name}</h1>
          <Link href="/cart" className="text-body-s underline">
            Back to cart
          </Link>
        </div>
      </section>

      <CheckoutForm location={location} />
    </>
  );
}
