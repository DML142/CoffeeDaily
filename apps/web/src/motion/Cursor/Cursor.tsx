"use client";

import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const DOT_SIZE = 6;
const CIRCLE_SIZE = 48;
const LABEL_SIZE = 88;

function resolveCursorTarget(element: HTMLElement) {
  const labelled = element.closest<HTMLElement>("[data-cursor-label]");
  if (labelled) return { label: labelled.dataset.cursorLabel ?? null };
  if (element.closest("a, button")) return { label: null };
  return null;
}

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const pointerFine = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = pointerFine && !reducedMotion;

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    if (!dot) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.3, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.3, ease: "power3" });

    let hasPositioned = false;

    function handlePointerMove(event: PointerEvent) {
      dotX(event.clientX);
      dotY(event.clientY);
      if (!hasPositioned) {
        hasPositioned = true;
        setConfirmed(true);
      }
    }

    function handlePointerOver(event: PointerEvent) {
      if (!(event.target instanceof HTMLElement)) return;
      const resolved = resolveCursorTarget(event.target);
      if (!resolved) return;
      setActive(true);
      setLabel(resolved.label);
    }

    function handlePointerOut(event: PointerEvent) {
      if (!(event.target instanceof HTMLElement)) return;
      const current = event.target.closest("[data-cursor-label], a, button");
      if (!current) return;
      const related = event.relatedTarget;
      if (!(related instanceof Node) || !current.contains(related)) {
        setActive(false);
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
      setConfirmed(false);
      setActive(false);
      setLabel(null);
    };
  }, [enabled]);

  if (!enabled) return null;

  const size = active ? (label ? LABEL_SIZE : CIRCLE_SIZE) : DOT_SIZE;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={`pointer-events-none fixed left-0 top-0 z-[100] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full mix-blend-difference transition-[width,height,background-color,opacity] duration-200 ${
        active ? "bg-cd-cream/40 backdrop-blur" : "bg-cd-cream"
      } ${confirmed ? "opacity-100" : "opacity-0"}`}
    >
      {label ? (
        <span className="text-label normal-case tracking-normal text-cd-cream">
          {label}
        </span>
      ) : null}
    </div>
  );
}
