import Link from "next/link";

const SITEMAP_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/locations", label: "Locations" },
  { href: "/about", label: "About" },
];

const PRODUCT_LABELS = ["Coffee", "Food", "Beans", "Merch"];

const SOCIAL_LINKS = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "TikTok" },
  { href: "#", label: "X" },
];

export function Footer() {
  return (
    <footer className="flex min-h-[calc(100vh-var(--cd-header-h))] flex-col justify-between bg-cd-ink text-cd-cream">
      <div className="overflow-hidden whitespace-nowrap border-b border-white/10 py-6 text-display-l">
        Beyond your expectations / Beyond your expectations / Beyond your
        expectations /
      </div>

      <div className="container flex w-full items-start justify-between gap-8 py-16">
        <div className="grid flex-1 grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <p className="mb-4 text-label text-cd-ink-mute">Visit us</p>
            <p className="text-body-s">1200 W Fulton St</p>
            <p className="text-body-s">Chicago, IL 60607</p>
          </div>
          <div>
            <p className="mb-4 text-label text-cd-ink-mute">Sitemap</p>
            <ul className="flex flex-col gap-2 text-body-s">
              {SITEMAP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-label text-cd-ink-mute">Products</p>
            <ul className="flex flex-col gap-2 text-body-s">
              {PRODUCT_LABELS.map((label) => (
                <li key={label}>{label}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-label text-cd-ink-mute">Socials</p>
            <ul className="flex flex-col gap-2 text-body-s">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <a
          href="#top"
          aria-label="Back to top"
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/30 sm:flex"
        >
          &uarr;
        </a>
      </div>

      <div className="container flex w-full flex-wrap items-center justify-between gap-4 py-6 text-body-s text-cd-ink-mute">
        <p>&copy; 2026 Coffee Daily</p>
        <div className="flex gap-6">
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
