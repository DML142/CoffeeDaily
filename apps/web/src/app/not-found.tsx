import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-var(--cd-header-h))] flex-col items-center justify-center gap-6 bg-cd-paper px-4 text-center">
      <p className="text-label text-cd-ink-mute">[ 404 ]</p>
      <h1 className="max-w-xl text-display-l text-cd-ink">
        Nothing brewing at this address.
      </h1>
      <Link
        href="/"
        className="bg-cd-orange px-6 py-3 text-body-s text-cd-cream transition-colors hover:bg-cd-orange-deep"
      >
        Back home
      </Link>
    </div>
  );
}
