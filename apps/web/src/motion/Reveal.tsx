"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const RISE_PX = 24;
const DURATION_S = 0.8;
const STAGGER_S = 0.06;
const TRIGGER_START = "top 85%";

type RevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
};

export function Reveal({ children, className, stagger = false }: RevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const targets = stagger ? Array.from(container.children) : container;
    gsap.set(targets, { opacity: 0, y: RISE_PX, pointerEvents: "none" });

    const tween = gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: DURATION_S,
      ease: "power3.out",
      stagger: stagger ? STAGGER_S : 0,
      onComplete: () => gsap.set(targets, { pointerEvents: "auto" }),
      scrollTrigger: {
        trigger: container,
        start: TRIGGER_START,
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(targets, { clearProps: "opacity,transform,pointerEvents" });
    };
  }, [reducedMotion, stagger]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
