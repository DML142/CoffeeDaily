"use client";

import type { Product, Size, Vessel } from "@coffee-daily/types";
import gsap from "gsap";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const CupPreview = dynamic(
  () => import("@/components/product/CupPreview").then((mod) => mod.CupPreview),
  { ssr: false },
);

const PREVIEW_MS = 5000;
const SLIDE_SECONDS = 0.4;

function supportsWebGl() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"));
  } catch {
    return false;
  }
}

export type ProductStageProps = {
  product: Product;
  vessel: Vessel;
  size: Size;
  canPreview: boolean;
};

export function ProductStage({
  product,
  vessel,
  size,
  canPreview,
}: ProductStageProps) {
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
  );
  const imageRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReadyRef = useRef(false);
  const isPendingRef = useRef(false);
  const webGlRef = useRef<boolean | null>(null);
  const hasMovedRef = useRef(false);
  const [hasPreview, setHasPreview] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  const [isBroken, setIsBroken] = useState(false);

  const optionKey = `${vessel}-${size}`;
  const previousKeyRef = useRef(optionKey);
  const isPreviewEnabled = canPreview && !prefersReducedMotion && !isBroken;

  const startWindow = useCallback(() => {
    setIsShowing(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsShowing(false), PREVIEW_MS);
  }, []);

  const handleReady = useCallback(() => {
    isReadyRef.current = true;
    if (!isPendingRef.current) return;
    isPendingRef.current = false;
    startWindow();
  }, [startWindow]);

  const handleContextLost = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    isReadyRef.current = false;
    isPendingRef.current = false;
    setIsShowing(false);
    setHasPreview(false);
    setIsBroken(true);
  }, []);

  useEffect(() => {
    if (optionKey === previousKeyRef.current) return;
    previousKeyRef.current = optionKey;
    if (!isPreviewEnabled) return;
    webGlRef.current ??= supportsWebGl();
    if (!webGlRef.current) {
      setIsBroken(true);
      return;
    }
    if (isReadyRef.current) {
      startWindow();
      return;
    }
    isPendingRef.current = true;
    setHasPreview(true);
  }, [optionKey, isPreviewEnabled, startWindow]);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;
    if (prefersReducedMotion) {
      gsap.set(image, { clearProps: "transform" });
      hasMovedRef.current = false;
      return;
    }
    if (!isShowing && !hasMovedRef.current) return;
    hasMovedRef.current = true;
    const tween = gsap.to(image, {
      yPercent: isShowing ? 110 : 0,
      duration: SLIDE_SECONDS,
      ease: "power2.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [isShowing, prefersReducedMotion]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <div className="relative aspect-square max-h-[60vh] w-full overflow-hidden bg-cd-line lg:aspect-auto lg:max-h-none">
      {hasPreview ? (
        <div className="absolute inset-0" data-testid="cup-preview">
          <CupPreview
            vessel={vessel}
            size={size}
            isActive={isShowing}
            onReady={handleReady}
            onContextLost={handleContextLost}
          />
        </div>
      ) : null}
      <div ref={imageRef} className="absolute inset-0">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}
