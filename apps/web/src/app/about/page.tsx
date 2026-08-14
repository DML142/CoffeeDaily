import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/motion/Reveal";

export const metadata: Metadata = {
  title: "About — Coffee Daily",
};

const STORY_SECTIONS = [
  {
    label: "[ Since the start ]",
    title: "A shop before it was a chain",
    body: "Coffee Daily opened as one counter in Fulton Market, roasting whatever the week's batch allowed. The counter grew into six spots around Chicago, run by the same crew that pulled the first shots.",
    image: "/img/a-shop-before-it-was-a-chain.jpg",
    imageFirst: true,
  },
  {
    label: "[ Sourcing ]",
    title: "Direct trade, named farms",
    body: "We buy from growers we've met, not brokers we haven't. Every bag on the shelf lists the farm, the altitude, and the harvest date.",
    image: "/img/direct-trade-named-farms.jpeg",
    imageFirst: false,
  },
  {
    label: "[ Roasting ]",
    title: "Small batches, every week",
    body: "Beans go on the roaster within days of arriving and into a cup within a week of that. Nothing sits in a warehouse waiting for a shelf slot.",
    image: "/img/small-batches-every-week.jpg",
    imageFirst: true,
  },
  {
    label: "[ The crew ]",
    title: "Baristas first, everything else second",
    body: "Every roaster on staff started behind the bar. Cupping notes get argued over at the counter, not decided in a boardroom.",
    image: "/img/baristas-first-everything-else-second.webp",
    imageFirst: false,
  },
];

const STATS = [
  { value: "6", label: "locations across Chicago" },
  { value: "7", label: "days from roast to cup" },
  { value: "0", label: "syrups pretending to be flavor" },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[calc(100vh-var(--cd-header-h))] items-end overflow-hidden bg-cd-ink px-4 py-24 sm:px-6 lg:px-10">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/video/making-coffee.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-cd-ink/60" />
        <div className="container relative">
          <p className="mb-6 text-label text-cd-cream/70">[ About ]</p>
          <h1 className="mb-6 max-w-4xl text-display-xl text-cd-cream">
            Built around the roast, not the brand
          </h1>
          <p className="max-w-2xl text-body-l text-cd-cream/80">
            Coffee Daily started as one counter roasting small batches for
            whoever walked in. Six locations later, the counter still runs the
            same way.
          </p>
        </div>
      </section>

      {STORY_SECTIONS.map((section) => (
        <section
          key={section.title}
          className="flex min-h-[calc(100vh-var(--cd-header-h))] flex-col bg-cd-paper px-4 py-16 sm:px-6 lg:px-10"
        >
          <Reveal className="container grid w-full flex-1 grid-cols-1 grid-rows-[1fr] gap-12 md:grid-cols-2">
            <div
              className={`relative overflow-hidden rounded-lg bg-cd-paper-warm ${section.imageFirst ? "" : "md:order-1"}`}
            >
              <Image
                src={section.image}
                alt={section.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div
              className={`flex flex-col justify-center ${section.imageFirst ? "" : "md:order-2"}`}
            >
              <p className="mb-4 text-label text-cd-ink-mute">
                {section.label}
              </p>
              <p className="mb-6 text-display-l">{section.title}</p>
              <p className="text-body text-cd-ink-mute">{section.body}</p>
            </div>
          </Reveal>
        </section>
      ))}

      <section className="bg-cd-ink px-4 py-16 text-cd-cream sm:px-6 lg:px-10">
        <div className="container">
          <p className="mb-10 text-label text-cd-ink-mute">
            [ By the numbers ]
          </p>
          <Reveal stagger className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="mb-2 text-display-xl text-cd-orange">
                  {stat.value}
                </p>
                <p className="text-body text-cd-ink-mute">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-cd-paper px-4 py-16 sm:px-6 lg:px-10">
        <Reveal className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-xl text-display-l">
            Find the counter closest to you
          </p>
          <Link
            href="/locations"
            className="shrink-0 border border-cd-ink px-6 py-3 text-body-s transition-colors duration-200 hover:bg-cd-ink hover:text-cd-cream"
          >
            See all locations
          </Link>
        </Reveal>
      </section>
    </>
  );
}
