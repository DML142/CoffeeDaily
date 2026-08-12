"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const START_BRIGHTNESS = 0.35;

export function FooterReveal({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const main = mainRef.current;
    const footer = footerRef.current;
    if (!main || !footer || reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const headerHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--cd-header-h",
        ),
      ) || 0;

    const tween = gsap.fromTo(
      footer,
      { filter: `brightness(${START_BRIGHTNESS})` },
      {
        filter: "brightness(1)",
        ease: "none",
        scrollTrigger: {
          trigger: main,
          start: "bottom bottom",
          end: `bottom top+=${headerHeight}`,
          scrub: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(footer, { clearProps: "filter" });
    };
  }, [reducedMotion]);

  return (
    <>
      <main ref={mainRef} className="relative z-10">
        {children}
      </main>
      <Footer ref={footerRef} />
    </>
  );
}
