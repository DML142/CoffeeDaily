"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pointerFine = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const smoothScrollEnabled = pointerFine && !reducedMotion;

  useEffect(() => {
    if (!smoothScrollEnabled) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ autoRaf: false });
    const update = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [smoothScrollEnabled]);

  return <>{children}</>;
}
