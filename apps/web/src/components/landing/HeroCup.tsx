"use client";

import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const REST_Y = 48;
const RISE_DISTANCE = 160;
const START_Y = REST_Y + RISE_DISTANCE;
const DURATION = 0.8;

export function HeroCup() {
  const cupRef = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const cup = cupRef.current;
    if (!cup || reducedMotion) return;

    const tween = gsap.to(cup, {
      y: REST_Y,
      duration: DURATION,
      ease: "power3.out",
    });

    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  return (
    <Link
      ref={cupRef}
      href="/menu/iced-cold-brew"
      data-cursor-label="See it"
      className={`group col-start-1 row-start-1 z-10 w-[min(75vw,560px)] select-none self-end ${
        reducedMotion ? "translate-y-[48px]" : ""
      }`}
      style={
        reducedMotion ? undefined : { transform: `translateY(${START_Y}px)` }
      }
    >
      <Image
        src="/img/cup.png"
        alt="Iced coffee in a to-go cup"
        width={419}
        height={596}
        priority
        draggable={false}
        className="w-full select-none drop-shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
      />
      <span className="absolute left-1/2 top-1/4 -translate-x-1/2 rounded-full bg-cd-ink px-6 py-3 text-label normal-case tracking-normal text-cd-cream [@media(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:hidden">
        See it
      </span>
    </Link>
  );
}
