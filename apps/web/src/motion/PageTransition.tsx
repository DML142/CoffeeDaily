"use client";

import { gsap } from "gsap";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const CLOSE_DURATION = 0.25;
const OPEN_DURATION = 0.25;
const ROTATION_DEG = 12;

function resolveInternalHref(anchor: HTMLAnchorElement): string | null {
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return null;

  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  if (
    url.pathname === window.location.pathname &&
    url.search === window.location.search
  ) {
    return null;
  }

  return url.pathname + url.search + url.hash;
}

export function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const shouldRevealRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (!shouldRevealRef.current) return;
    shouldRevealRef.current = false;

    const overlay = overlayRef.current;
    if (!overlay) return;

    gsap.fromTo(
      overlay,
      { transformOrigin: "100% 0%", rotate: 0, scale: 1 },
      {
        rotate: ROTATION_DEG,
        scale: 0,
        duration: OPEN_DURATION,
        ease: "power2.inOut",
      },
    );
  }, [pathname]);

  useEffect(() => {
    if (reducedMotion) return;

    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        pendingHrefRef.current ||
        !(event.target instanceof HTMLElement)
      ) {
        return;
      }

      const anchor = event.target.closest("a");
      if (!anchor) return;

      const href = resolveInternalHref(anchor);
      if (!href) return;

      event.preventDefault();

      const overlay = overlayRef.current;
      if (!overlay) {
        router.push(href);
        return;
      }

      pendingHrefRef.current = href;
      gsap.fromTo(
        overlay,
        { transformOrigin: "0% 100%", rotate: -ROTATION_DEG, scale: 0 },
        {
          rotate: 0,
          scale: 1,
          duration: CLOSE_DURATION,
          ease: "power2.inOut",
          onComplete: () => {
            const nextHref = pendingHrefRef.current;
            pendingHrefRef.current = null;
            shouldRevealRef.current = true;
            if (nextHref) router.push(nextHref);
          },
        },
      );
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [reducedMotion, router]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[200] scale-0 bg-cd-ink"
    />
  );
}
