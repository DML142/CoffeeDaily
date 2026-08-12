"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const START_BRIGHTNESS = 0.35;
const LAG_PERCENT = 40;

export function FooterReveal({ children }: { children: ReactNode }) {
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const tween = gsap.fromTo(
      footer,
      { yPercent: -LAG_PERCENT, filter: `brightness(${START_BRIGHTNESS})` },
      {
        yPercent: 0,
        filter: "brightness(1)",
        ease: "none",
        scrollTrigger: {
          trigger: footer,
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(footer, { clearProps: "transform,filter" });
    };
  }, [reducedMotion]);

  return (
    <>
      <main className="relative z-10">{children}</main>
      <Footer ref={footerRef} />
    </>
  );
}
