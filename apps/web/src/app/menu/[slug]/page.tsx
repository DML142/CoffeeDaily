import { products } from "@coffee-daily/mocks";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";

type ProductPageParams = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((candidate) => candidate.slug === slug);
  return { title: product ? `${product.name} — Coffee Daily` : "Coffee Daily" };
}

export default async function ProductPage({ params }: ProductPageParams) {
  const { slug } = await params;
  const product = products.find((candidate) => candidate.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <section className="bg-cd-paper px-4 py-10 sm:px-6 lg:px-10">
        <div className="container">
          <Link
            href="/menu"
            className="text-body-s underline transition-colors duration-200 hover:text-cd-orange"
          >
            Back to menu
          </Link>
        </div>
      </section>

      <ProductDetail product={product} />
    </>
  );
}
