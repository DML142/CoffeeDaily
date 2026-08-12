"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type CursorVariant = "default" | "link" | "button" | "text" | "label";

const VARIANT_STYLE: Record<
  CursorVariant,
  { width: number; height: number; className: string }
> = {
  default: {
    width: 32,
    height: 32,
    className: "rounded-full border border-cd-ink",
  },
  link: {
    width: 56,
    height: 56,
    className: "rounded-full border border-cd-ink",
  },
  button: { width: 48, height: 48, className: "rounded-full bg-cd-orange" },
  text: { width: 2, height: 24, className: "bg-cd-ink" },
  label: { width: 88, height: 88, className: "rounded-full bg-cd-ink" },
};

function resolveCursorTarget(element: HTMLElement) {
  const explicit = element.closest<HTMLElement>("[data-cursor]");
  if (explicit) {
    const variant = (explicit.dataset.cursor ?? "default") as CursorVariant;
    return { variant, label: explicit.dataset.cursorLabel ?? null };
  }
  if (element.closest("a")) return { variant: "link" as const, label: null };
  return null;
}

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const pointerFine = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = pointerFine && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.05, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.05, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

    let hasPositioned = false;

    function handlePointerMove(event: PointerEvent) {
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
      if (!hasPositioned) {
        hasPositioned = true;
        document.body.style.cursor = "none";
        setConfirmed(true);
      }
    }

    function handlePointerOver(event: PointerEvent) {
      if (!(event.target instanceof HTMLElement)) return;
      const resolved = resolveCursorTarget(event.target);
      if (!resolved) return;
      setVariant(resolved.variant);
      setLabel(resolved.label);
    }

    function handlePointerOut(event: PointerEvent) {
      if (!(event.target instanceof HTMLElement)) return;
      const current = event.target.closest("[data-cursor], a");
      if (!current) return;
      const related = event.relatedTarget;
      if (!(related instanceof Node) || !current.contains(related)) {
        setVariant("default");
        setLabel(null);
      }
    }

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.body.style.removeProperty("cursor");
      setConfirmed(false);
      setVariant("default");
      setLabel(null);
    };
  }, [enabled]);

  if (!enabled) return null;

  const style = VARIANT_STYLE[variant];
  const showDot = variant !== "label";

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cd-ink transition-opacity duration-200 ${
          confirmed && showDot ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{ width: style.width, height: style.height }}
        className={`pointer-events-none fixed left-0 top-0 z-[100] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-[width,height,background-color] duration-200 ${style.className} ${
          confirmed ? "opacity-100" : "opacity-0"
        }`}
      >
        {label ? (
          <span className="text-label normal-case tracking-normal text-cd-cream">
            {label}
          </span>
        ) : null}
      </div>
    </>
  );
}
