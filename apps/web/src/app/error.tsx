"use client";

import { Button } from "@coffee-daily/ui/Button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-var(--cd-header-h))] flex-col items-center justify-center gap-6 bg-cd-paper px-4 text-center">
      <p className="text-label text-cd-ink-mute">[ Something broke ]</p>
      <h1 className="max-w-xl text-display-l text-cd-ink">
        That page hit a snag. Try again, or head back to the menu.
      </h1>
      <div className="flex gap-4">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className="border border-cd-ink px-4 py-2 text-body-s">
          Back home
        </Link>
      </div>
    </div>
  );
}
